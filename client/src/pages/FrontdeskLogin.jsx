import "./FrontdeskLogin.css";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function FrontDeskLogin() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [password, setPassword] = useState("");
  const [isChecking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const loginClick = (event) => {
    event.preventDefault();
    if (socket && !isChecking) {
      setChecking(true);
      setError("");
      socket.emit("checkPassword", password);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("loginResult", (role) => {
      setChecking(false);
      if (role === "frontdesk") {
        sessionStorage.setItem("auth-fd", "frontdesk"); //added sessionStorage
        navigate("/front-desk");
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
        <div className="login">
          <input
            type="password"
            placeholder="password"
            id="loginInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isChecking}>
            {isChecking ? "Checking..." : "Login"}
          </button>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div>
          <Link to="/" className="bbutton">
            Back to the main page
          </Link>
        </div>
      </form>
    </div>
  );
}

export default FrontDeskLogin;
