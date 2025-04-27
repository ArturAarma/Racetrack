import { Server } from "socket.io";
import http from "http";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { tunnelmole } from "tunnelmole";
import mongoose from "mongoose";
import Sessions from "./model/Sessions.js"; // mongodb model for sessions
import CurrentSession from "./model/CurrentSession.js"; // mongodb model for currentSession
import EnableUpdateSession from "./model/EnableUpdateSession.js"; // mongodb model for enableUpdateSession
import dotenv from "dotenv";
dotenv.config(); // load environment variables from .env
process.env.TUNNELMOLE_QUIET_MODE = 1; // disable tunnelmole dev logs

// Map to store different states
const stateMap = new Map();
// Map the initial states
stateMap.set("sessions", []);
stateMap.set("currentSession", null);
stateMap.set("enableUpdateSession", false);

//require('dotenv').config();

const devTimer = process.env.DEV_TIMER; // 1-minute in dev, default to 60
const raceTimer = process.env.RACE_TIMER || 600; // 10-minute in production, default to 600
if (process.env.NODE_ENV === "development") {
  stateMap.set("timer", devTimer);
} else {
  stateMap.set("timer", raceTimer);
}
console.log(stateMap.get("timer"));

console.log(`Timer is set to: ${process.env.NODE_ENV === "development" ? devTimer : raceTimer} seconds.`);

if (process.env.FRONTDESK_PW && process.env.LAPLINE_PW && process.env.RACECONTROL_PW) {
  console.log("✅ Environment variables set!");
} else {
  console.log("❌ You havent set up the environment variables, so im gonna stop working!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB Atlas");

    // set sessions state from db
    const sessionsDoc = await Sessions.findOne({}, { _id: 0 });
    stateMap.set("sessions", sessionsDoc?.sessions || []);

    // set currentSession state from db
    const currentSessionDoc = await CurrentSession.findOne({}, { _id: 0 });
    if (currentSessionDoc?.name) {
      stateMap.set("currentSession", currentSessionDoc || null);
    }

    // set enableUpdateSession from db
    const enableUpdateDoc = await EnableUpdateSession.findOne({}, { _id: 0 });
    stateMap.set("enableUpdateSession", enableUpdateDoc?.enableUpdateSession || false);

    console.log("💾 States updated from DB");
  })
  .catch((err) => {
    console.log("Connection error: ", err);
    console.log("❌ Error connecting to MongoDB");
    process.exit();
  });

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

// manual __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// serve static files from React build
app.use(express.static(path.join(__dirname, "../client/build")));
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/socket.io")) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  } else {
    next();
  }
});

io.on("connection", (socket) => {
  console.log("Socket connected");
  // Send the latest states to newly connected clients from the map
  socket.emit("getSessions", stateMap.get("sessions"));
  socket.emit("getCurrentSession", stateMap.get("currentSession"));
  socket.emit("getEnableUpdateSession", stateMap.get("enableUpdateSession"));

  socket.on("requestTimerDuration", () => {
    socket.emit("getTimerDuration", stateMap.get("timer"));
  });

  socket.on("checkPassword", (password) => {
    console.log(password);

    let passwords = {
      frontDesk: process.env.FRONTDESK_PW,
      racecontrol: process.env.RACECONTROL_PW,
      lapline: process.env.LAPLINE_PW,
    };

    if (password === passwords.frontDesk) {
      socket.emit("loginResult", "frontdesk");
    } else if (password === passwords.racecontrol) {
      socket.emit("loginResult", "racecontrol");
    } else if (password === passwords.lapline) {
      socket.emit("loginResult", "lapline");
    } else {
      setTimeout(() => {
        socket.emit("loginResult", "invalid");
      }, 500);
    }

    socket.on("disconnect", () => {
      console.log("❌ A user disconnected");
    });
  });

  // update confirmed sessions from FD to RC
  socket.on("updateSessions", async (sessions) => {
    stateMap.set("sessions", sessions); // Save the changed sessions to State Map
    // update MongoDB
    await Sessions.findOneAndReplace({}, { sessions: sessions }, { upsert: true });

    // find the first session where isConfirmed = true
    const firstConfirmedSession = stateMap.get("sessions").find((session) => session.isConfirmed === true);
    // only update when there is no active/ finished race going
    if (
      !stateMap.get("currentSession") ||
      (!stateMap.get("currentSession").isActive && !stateMap.get("currentSession").isFinished)
    ) {
      stateMap.set("currentSession", firstConfirmedSession);

      await CurrentSession.deleteMany({}); //mongodb
      if (firstConfirmedSession) {
        const sessionToSave = { ...firstConfirmedSession };
        delete sessionToSave._id;
        await new CurrentSession(sessionToSave).save();
      }

      io.emit("getConfirmedCurrentSession", stateMap.get("currentSession")); // notify all clients
    }
    io.emit("sessionsUpdated", stateMap.get("sessions"));
  });

  // update sessions on request
  socket.on("requestSessions", () => socket.emit("getSessions", stateMap.get("sessions")));

  // update currentSession on request
  socket.on("requestCurrentSession", () => socket.emit("getCurrentSession", stateMap.get("currentSession")));

  // update sessions on request
  socket.on("requestConfirmedCurrentSession", async () => {
    const firstConfirmedSession = stateMap.get("sessions").find((session) => session.isConfirmed === true);
    stateMap.set("currentSession", firstConfirmedSession);
    // update mongoDB
    await CurrentSession.deleteMany({}); //mongodb
    if (firstConfirmedSession) {
      const sessionToSave = { ...firstConfirmedSession };
      delete sessionToSave._id;
      await new CurrentSession(sessionToSave).save();
    }
    socket.emit("getConfirmedCurrentSession", stateMap.get("currentSession"));
  });

  // update currentSession from RC to LLT and LB
  socket.on("updateCurrentSession", async (currentSession) => {
    stateMap.set("currentSession", currentSession);
    // update mongodb
    await CurrentSession.findOneAndReplace({}, currentSession, { upsert: true }); //mongodb
    io.emit("currentSessionUpdated", stateMap.get("currentSession"));
  });

  // update LeaderBoard and FrontDesk on "Start Race" from RaceControl
  socket.on("raceStarted", async (sessions) => {
    // update sessions on front-desk when race-control starts a race
    stateMap.set("sessions", sessions);
    await Sessions.findOneAndReplace({}, { sessions: sessions }, { upsert: true });
    io.emit("removedSession", stateMap.get("sessions"));

    // enable fetching new sessions on Leader Board
    stateMap.set("enableUpdateSession", true);
    await EnableUpdateSession.findOneAndUpdate({}, { enableUpdateSession: true }, { upsert: true }); // update to mongodb
    io.emit("startedRaceAlert");

    // send currentSession to clients
    io.emit("currentSessionUpdated", stateMap.get("currentSession"));
  });

  // disable fetching new sessions on LeaderBoard until the next race
  socket.on("endSession", async () => {
    stateMap.set("enableUpdateSession", false);
    await EnableUpdateSession.findOneAndUpdate({}, { enableUpdateSession: false }, { upsert: true }); // update to mongodb
    io.emit("sessionHasEnded");
  });

  // Update RaceControl and LeaderBoard when LapLineTracker adds a lap
  socket.on("lapAdded", async (currentSession) => {
    stateMap.set("currentSession", currentSession);
    await CurrentSession.findOneAndReplace({}, currentSession, { upsert: true }); //mongodb
    io.emit("addedLap", stateMap.get("currentSession"));
  });

  socket.on("FDSessionConfirmed", () => {
    io.emit("sessionConfirmedbyFD");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

httpServer.listen(4000, () => {
  console.log("🚀 Server listening on port 4000");
});

// tunnelmole
const url = await tunnelmole({
  port: 4000,
});

console.log("\n======================================================================");
console.log(`Server started on http://localhost:4000`);
console.log(`Tunnelmole public URL: ${url}`);
console.log("======================================================================\n");
