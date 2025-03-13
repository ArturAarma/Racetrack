import { useContext, useEffect, useState } from "react";
import "./FrontDesk2.css";
import { Link } from "react-router-dom";
// import { SocketContext } from "../context/SocketContext";

function Frontdesk() {
  //   const socket = useContext(SocketContext);
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
            //   id: sessions.length,
            name: sessionName,
            drivers: ["", "", "", "", "", "", "", ""],
            isActive: false,
            isFinished: false,
            raceMode: "",
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
          {drivers.map((driver, index) => (
            <div key={index} className="driver-row">
              <label>Car #{index + 1} </label>
              <input
                type="text"
                placeholder={`Driver ${index + 1}`}
                value={drivers[index] || ""}
                onChange={(e) => handleChange(index, e.target.value)}
                disabled={!editEnabled}
              />
            </div>
          ))}
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
