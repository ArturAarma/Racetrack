import { useContext, useEffect, useState } from "react";
import "./FrontDesk2.css";
import { Link } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

function Frontdesk() {
  const socket = useContext(SocketContext);
  const [sessions, setSessions] = useState([]);

  const addNewSession = (sessionName) => {
    if (sessions.find((session) => session.name === sessionName)) {
      alert(
        "Session with that name already exists. Please choose an unique name."
      );
    } else {
      if (sessionName.trim() !== "") {
        setSessions([
          ...sessions,
          {
            name: sessionName,
            drivers: [],
            isConfirmed: false,
            isActive: false,
            isFinished: false,
            raceMode: "danger",
            startTime: null,
            leaderboard: [],
          },
        ]);
      }
    }
  };

  const removeSession = (sessionName) => {
    setSessions(sessions.filter((session) => session.name !== sessionName));
  };

  const handleUpdateSession = (sessionName, updatedDrivers) => {
    setSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.name === sessionName
          ? { ...s, drivers: updatedDrivers, isConfirmed: true }
          : s
      )
    );
  };

  // emit session data whenever sessions get updated
  useEffect(() => {
    if (!socket) return;
    socket.emit("updateSessions", sessions);
  }, [socket, sessions]);

  console.log(sessions);

  return (
    <div className="container">
      <div className="frontdeskHeader">Front desk</div>
      <AddSession onAddSession={addNewSession} />
      <div className="racerpanel">
        {sessions.map((session, index) => (
          <EditSession
            key={index}
            session={session}
            queue={index + 1}
            onRemove={removeSession}
            onUpdate={handleUpdateSession}
          />
        ))}
      </div>
      <div>
        <Link to="/" className="bbutton" id="linkback">
          Back to the main page
        </Link>
      </div>
    </div>
  );
}

// Add session component
function AddSession({ onAddSession }) {
  const [sessionName, setSessionName] = useState("");

  const handleAddSession = (event) => {
    event.preventDefault(); // Prevents form from reloading the page
    onAddSession(sessionName); // Call function to add session
    setSessionName(""); // Reset input field
  };

  return (
    <div className="add-session-container">
      <div>
        Add a session:
        <form onSubmit={handleAddSession}>
          <input
            type="text"
            placeholder="Session Name"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
          ></input>
          <button className="bbutton" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
}

// Edit session component
function EditSession({ session, onRemove, onUpdate, queue }) {
  const [editEnabled, setEditEnabled] = useState(true);
  const [drivers, setDrivers] = useState([...session.drivers]);

  // Makes sure that drivers state updates when session.drivers changes
  useEffect(() => {
    setDrivers([...session.drivers]);
  }, [session.drivers]);

  const toggleEdit = () => {
    setEditEnabled(!editEnabled);
  };

  const handleChange = (carNr, driverName) => {
    setDrivers((prevDrivers) => {
      // Create a new array from existing drivers
      const updatedDrivers = [...prevDrivers];

      // Find the driver object for this carNr (returns -1 if not found)
      const driverIndex = updatedDrivers.findIndex(
        (driver) => driver.car === carNr
      );

      if (driverName.trim() !== "") {
        // Update driver name when driver with this carNr is found in the array
        if (driverIndex !== -1) {
          updatedDrivers[driverIndex] = {
            ...updatedDrivers[driverIndex],
            name: driverName,
          };

          // If driver with this carNr is not found in the array, add it
        } else {
          updatedDrivers.push({
            car: carNr,
            name: driverName,
            laps: [],
            bestLap: null,
          });
        }
      } else {
        // If driver name is cleared, remove that car entry
        return updatedDrivers.filter((driver) => driver.car !== carNr);
      }

      return updatedDrivers;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out cars if no driver name is submitted
    const filteredDrivers = drivers.filter(
      (driver) => driver.name.trim() !== ""
    );

    // check that driver fields are not empty
    if (filteredDrivers.length === 0) {
      alert("Set name for at least 1 driver.");
      return;
    }

    // check that drivers names are unique
    const driverNames = filteredDrivers.map((driver) => driver.name.trim());
    // Set removes duplicates so size will be different than length if duplicates are found
    const hasDuplicates = new Set(driverNames).size !== driverNames.length;
    if (hasDuplicates) {
      alert("Please choose unique driver names.");
      return;
    }

    onUpdate(session.name, filteredDrivers);
    setEditEnabled(false);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onRemove(session.name);
    setEditEnabled(false);
  };

  const findDriver = (array, key, carNr, returnKey) => {
    const foundObject = array.find((driverObj) => driverObj[key] === carNr);
    return foundObject ? foundObject[returnKey] : "";
  };

  return (
    <div className="session-container">
      <div className="session-header">
        Session #{queue}: <br></br>
        {session.name}
      </div>
      <div className={session.isActive ? "session-active" : "session-inactive"}>
        {session.isActive
          ? "Session active, unable to edit"
          : "Session inactive"}
      </div>

      <div className="session-drivers">
        <form onSubmit={handleSubmit}>
          <div className="drivers-row">
            <label>Car #1 </label>
            <input
              type="text"
              placeholder="Driver 1"
              value={findDriver(drivers, "car", 1, "name")}
              onChange={(e) => handleChange(1, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #2 </label>
            <input
              type="text"
              placeholder="Driver 2"
              value={findDriver(drivers, "car", 2, "name")}
              onChange={(e) => handleChange(2, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #3 </label>
            <input
              type="text"
              placeholder="Driver 3"
              value={findDriver(drivers, "car", 3, "name")}
              onChange={(e) => handleChange(3, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #4 </label>
            <input
              type="text"
              placeholder="Driver 4"
              value={findDriver(drivers, "car", 4, "name")}
              onChange={(e) => handleChange(4, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #5 </label>
            <input
              type="text"
              placeholder="Driver 5"
              value={findDriver(drivers, "car", 5, "name")}
              onChange={(e) => handleChange(5, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #6 </label>
            <input
              type="text"
              placeholder="Driver 6"
              value={findDriver(drivers, "car", 6, "name")}
              onChange={(e) => handleChange(6, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #7 </label>
            <input
              type="text"
              placeholder="Driver 7"
              value={findDriver(drivers, "car", 7, "name")}
              onChange={(e) => handleChange(7, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          <div className="drivers-row">
            <label>Car #8 </label>
            <input
              type="text"
              placeholder="Driver 8"
              value={findDriver(drivers, "car", 8, "name")}
              onChange={(e) => handleChange(8, e.target.value)}
              disabled={!editEnabled}
            />
          </div>
          {editEnabled && (
            <button type="submit" className="edit-button">
              Confirm
            </button>
          )}
        </form>

        {!editEnabled && !session.isActive && (
          <button className="edit-button" onClick={toggleEdit}>
            Edit
          </button>
        )}
      </div>
      {editEnabled && (
        <button className="edit-button" onClick={handleRemove}>
          Remove
        </button>
      )}
    </div>
  );
}

export default Frontdesk;
