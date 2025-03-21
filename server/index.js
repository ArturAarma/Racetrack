import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

// Map to store different states
const stateMap = new Map();

// Map the initial states
stateMap.set("sessions", []);
stateMap.set("currentSession", null);
stateMap.set("enableUpdateSession", false);

io.on("connection", (socket) => {
  // Send the latest states to newly connected clients from the map
  socket.emit("getSessions", stateMap.get("sessions"));
  socket.emit("getCurrentSession", stateMap.get("currentSession"));
  socket.emit("getEnableUpdateSession", stateMap.get("enableUpdateSession"));

  // update sessions from FD to RC
  socket.on("updateSessions", (sessions) => {
    stateMap.set("sessions", sessions); // Save the changed sessions to State Map
    io.emit("sessionsUpdated", stateMap.get("sessions"));
  });

  // update currentSession from RC to LLT and LB
  socket.on("updateCurrentSession", (currentSession) => {
    stateMap.set("currentSession", currentSession);
    io.emit("currentSessionUpdated", stateMap.get("currentSession"));
  });

  // update LeaderBoard and FrontDesk on "Start Race" from RaceControl
  socket.on("raceStarted", (sessions) => {
    // update sessions on front-desk when race-control starts a race
    stateMap.set("sessions", sessions);
    io.emit("removedSession", stateMap.get("sessions"));

    // enable fetching new sessions on Leader Board
    stateMap.set("enableUpdateSession", true);
    io.emit("startedRaceToLB");
  });

  // disable fetching new sessions on LeaderBoard until the next race
  socket.on("endSession", () => {
    stateMap.set("enableUpdateSession", false);
    io.emit("sessionHasEnded");
  });

  // Update RaceControl when LapLineTracker adds a lap
  socket.on("lapAdded", (currentSession) => {
    stateMap.set("currentSession", currentSession);
    io.emit("addedLap", stateMap.get("currentSession"));
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

io.listen(4000);
