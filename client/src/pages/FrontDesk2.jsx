import { useContext, useEffect, useState } from "react";
import "./FrontDesk2.css";
import { Link } from "react-router-dom";
// import { SocketContext } from "../context/SocketContext";

function Frontdesk() {
  //   const socket = useContext(SocketContext);
  const [sessions, setSessions] = useState([]);

  // needs a check to not allow adding a name that's already added
  const addNewSession = (sessionName) => {
    if (sessionName.trim() !== "") {
      setSessions([
        ...sessions,
        {
          //   id: sessions.length,
          name: sessionName,
          drivers: ["", "", "", "", "", "", "", ""],
          isActive: false,
          isFinished: false,
        },
      ]);
    }
  };

  // atm if multiple sessions have the same name, clicking "remove" deletes all of them
  const removeSession = (sessionName) => {
    setSessions(sessions.filter((session) => session.name !== sessionName));
  };

  const handleUpdateSession = (sessionName, updatedDrivers) => {
    setSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.name === sessionName ? { ...s, drivers: updatedDrivers } : s
      )
    );
  };

  //   useEffect(() => {
  //     if (!socket) return;
  //     socket.emit("sendSessionData", sessions);
  //   }, [socket, sessions]);

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
  const [editEnabled, setEditEnabled] = useState(false);
  const [drivers, setDrivers] = useState([...session.drivers]);

  // Makes sure that drivers state updates when session.drivers changes
  useEffect(() => {
    setDrivers([...session.drivers]);
  }, [session.drivers]);

  const toggleEdit = () => {
    setEditEnabled(!editEnabled);
  };

  const handleChange = (index, driverName) => {
    const updatedDrivers = [...drivers];
    updatedDrivers[index] = driverName;
    setDrivers(updatedDrivers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(session.name, drivers);
    setEditEnabled(false);
  };

  const handleRemove = (e) => {
    e.preventDefault();
    onRemove(session.name);
    setEditEnabled(false);
  };

  return (
    <div className="session-container">
      <div className="session-header">Session name: {session.name}</div>
      <div className="session-header">Place in line: {queue}</div>
      <div className={session.isActive ? "session-active" : "session-inactive"}>
        {session.isActive
          ? "Session active, unable to edit"
          : "Session inactive"}
      </div>
      <div className="session-drivers">
        <form onSubmit={handleSubmit}>
          <label>Car #1 </label>
          <input
            type="text"
            placeholder="Driver 1"
            value={drivers[0] || ""}
            onChange={(e) => handleChange(0, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #2 </label>
          <input
            type="text"
            placeholder="Driver 2"
            value={drivers[1] || ""}
            onChange={(e) => handleChange(1, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #3 </label>
          <input
            type="text"
            placeholder="Driver 3"
            value={drivers[2] || ""}
            onChange={(e) => handleChange(2, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #4 </label>
          <input
            type="text"
            placeholder="Driver 4"
            value={drivers[3] || ""}
            onChange={(e) => handleChange(3, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #5 </label>
          <input
            type="text"
            placeholder="Driver 5"
            value={drivers[4] || ""}
            onChange={(e) => handleChange(4, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #6 </label>
          <input
            type="text"
            placeholder="Driver 6"
            value={drivers[5] || ""}
            onChange={(e) => handleChange(5, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #7 </label>
          <input
            type="text"
            placeholder="Driver 7"
            value={drivers[6] || ""}
            onChange={(e) => handleChange(6, e.target.value)}
            disabled={!editEnabled}
          />
          <label>Car #8 </label>
          <input
            type="text"
            placeholder="Driver 8"
            value={drivers[7] || ""}
            onChange={(e) => handleChange(7, e.target.value)}
            disabled={!editEnabled}
          />
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
