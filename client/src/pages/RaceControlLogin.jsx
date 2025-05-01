import "./RaceControlLogin.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import RaceControl from "./RaceControl";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RaceControlLogin() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [password, setPassword] = useState("");
  const [loginStatus, setLoginStatus] = useState(null);
  const [error, setError] = useState("");

  const loginClick = (event) => {
    event.preventDefault();
    if (socket) {
      setError("");
      socket.emit("checkPassword", password);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("loginResult", (role) => {
      if (role === "racecontrol") {
        sessionStorage.setItem("auth-rc", "racecontrol"); //added sessionStorage
        navigate("/race-control");
        window.location.reload();
      } else {
        setError("Invalid password");
      }
    });

    return () => {
      socket.off("loginResult");
    };
  }, [socket]);

  return (
    <div className="container">
      <form onSubmit={loginClick}>
        {loginStatus === null ? (
          <div>
            <div className="login">
              <input
                type="password"
                placeholder="password"
                id="loginInput"
                defaultValue={""}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit">Login</button>
            </div>
            {error && <div className="error-message">{error}</div>}
            <div>
              <Link to="/" className="bbutton">
                Back to the main page
              </Link>
            </div>
          </div>
        ) : loginStatus === "racecontrol" ? (
          <div className="race control">
            <RaceControl />
          </div>
        ) : loginStatus === "invalid" ? (
          <div className="invalid">
            <div>Enter valid password</div>
            <Link to="/" className="bbutton">
              Back to the main page
            </Link>
          </div>
        ) : (
          <div className="invalid">
            <div>Unexpected error. Please try again.</div>
            <Link to="/" className="bbutton">
              Back to the main page
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}

export default RaceControlLogin;
