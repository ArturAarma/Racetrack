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

  // update confirmed sessions from FD to RC
  socket.on("updateSessions", (sessions) => {
    stateMap.set("sessions", sessions); // Save the changed sessions to State Map
    // find the first sesiion where isConfirmed = true
    const firstConfirmedSession = stateMap.get("sessions").find((session) => session.isConfirmed === true);
    // only update when there is no active/ finished race going
    if (
      !stateMap.get("currentSession") ||
      (!stateMap.get("currentSession").isActive && !stateMap.get("currentSession").isFinished)
    ) {
      stateMap.set("currentSession", firstConfirmedSession);
      io.emit("getConfirmedCurrentSession", stateMap.get("currentSession")); // notify all clients
    }
    io.emit("sessionsUpdated", stateMap.get("sessions"));
  });

  // update sessions on request
  socket.on("requestSessions", () => socket.emit("getSessions", stateMap.get("sessions")));

  // update currentSession on request
  socket.on("requestCurrentSession", () => socket.emit("getCurrentSession", stateMap.get("currentSession")));

  // update sessions on request
  socket.on("requestConfirmedCurrentSession", () => {
    const firstConfirmedSession = stateMap.get("sessions").find((session) => session.isConfirmed === true);
    stateMap.set("currentSession", firstConfirmedSession);
    socket.emit("getConfirmedCurrentSession", stateMap.get("currentSession"));
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

    // send currentSession to clients
    io.emit("currentSessionUpdated", stateMap.get("currentSession"));
  });

  // disable fetching new sessions on LeaderBoard until the next race
  socket.on("endSession", () => {
    stateMap.set("enableUpdateSession", false);
    io.emit("sessionHasEnded");
  });

  // Update RaceControl and LeaderBoard when LapLineTracker adds a lap
  socket.on("lapAdded", (currentSession) => {
    stateMap.set("currentSession", currentSession);
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
