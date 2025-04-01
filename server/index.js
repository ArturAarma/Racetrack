import { Server } from "socket.io";
import mongoose from "mongoose";
import Sessions from "./model/Sessions.js"; // mongodb model for sessions
import CurrentSession from "./model/CurrentSession.js"; // mongodb model for currentSession
import EnableUpdateSession from "./model/EnableUpdateSession.js"; // mongodb model for enableUpdateSession
import "dotenv/config";

// Map to store different states
const stateMap = new Map();
// Map the initial states
stateMap.set("sessions", []);
stateMap.set("currentSession", null);
stateMap.set("enableUpdateSession", false);

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
  });

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected");
  // Send the latest states to newly connected clients from the map
  socket.emit("getSessions", stateMap.get("sessions"));
  socket.emit("getCurrentSession", stateMap.get("currentSession"));
  socket.emit("getEnableUpdateSession", stateMap.get("enableUpdateSession"));

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
        await new CurrentSession(firstConfirmedSession).save();
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
      await new CurrentSession(firstConfirmedSession).save();
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

io.listen(4000);
