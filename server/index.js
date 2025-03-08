import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

// Map to store different states
const stateMap = new Map();

// Map the initial states
stateMap.set("flag", "safe");
stateMap.set("activeDriver", null);

io.on("connection", (socket) => {
  // Send the latest states to newly connected clients from the map
  socket.emit("getFlag", stateMap.get("flag"));
  socket.emit("getDriver", stateMap.get("activeDriver"));

  socket.on("changeFlag", (flagType) => {
    stateMap.set("flag", flagType); // Save the changed flag to State Map
    io.emit("getFlag", flagType);
  });

  socket.on("makeDriverActive", (selectedDriver) => {
    stateMap.set("activeDriver", selectedDriver); // Save the changed activeDriver to State Map
    io.emit("getDriver", selectedDriver);
    console.log(selectedDriver);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: " + socket.id);
  });
});

io.listen(4000);
