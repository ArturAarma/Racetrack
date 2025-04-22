import "./FrontdeskLogin.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import FrontDesk from "./front-desk";
import { useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';




<<<<<<< HEAD
import checkPw from '../components/CheckPw';
=======

>>>>>>> 976042e5db55c0fdbd1f90a17de3735da1d5317f



function FrontDeskLogin() {
   
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(null);
<<<<<<< HEAD

    const loginClick = (event) => {
        event.preventDefault();
        if (socket) {
=======
    const [isChecking, setChecking] = useState(false);

    const loginClick = (event) => {
        event.preventDefault();
        if (socket && !isChecking) {
            setChecking(true);
>>>>>>> 976042e5db55c0fdbd1f90a17de3735da1d5317f
            socket.emit("checkPassword", password);
        }
        
    };
    
    
    useEffect(() => {
        if (!socket) return;

        socket.on("loginResult", (role) => {
<<<<<<< HEAD
=======
            setChecking(false);
>>>>>>> 976042e5db55c0fdbd1f90a17de3735da1d5317f
            if (role === "frontdesk") {
                navigate("/front-desk");
            } else {
                alert("Invalid password");
            }
        });

        return () => {
            socket.off("loginResult");
        };
            }, [socket]);

        
  

<<<<<<< HEAD
    return (
        <div className="container">
            <form onSubmit={loginClick}>
            {loginStatus === null ? (
                <div>
                <div className="login">
                    <input 
                    type="text" 
                    placeholder="password" 
                    id="loginInput" 
                    defaultValue={""} 
                    onChange={e => setPassword(e.target.value)} 
                    />
                    <button type="submit">Login</button>
                </div>
                <div>
                    <Link to="/" className="bbutton">Back to the main page</Link>
                </div>
                </div>
            ) : loginStatus === "frontdesk" ? (
                <div className='front desk'>
                   <FrontDesk/>
                </div>
            ) : loginStatus === "invalid" ? (
                <div className='invalid'>
                    <div>Enter valid password</div>
                    <Link to="/" className="bbutton">Back to the main page</Link>
                </div>
            ) : (
                <div className='invalid'>
                    <div>Unexpected error. Please try again.</div>
                    <Link to="/" className="bbutton">Back to the main page</Link>
                </div>

            )}
            </form>
        </div>
    );
=======
            return (
                <div className="container">
                  <form onSubmit={loginClick}>
                    <div className="login">
                      <input 
                        type="text" 
                        placeholder="password" 
                        id="loginInput" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                      />
                      <button type="submit" disabled={isChecking}>
                        {isChecking ? "Checking..." : "Login"}
                      </button>
                    </div>
                    <div>
                      <Link to="/" className="bbutton">Back to the main page</Link>
                    </div>
                  </form>
                </div>
              );
>>>>>>> 976042e5db55c0fdbd1f90a17de3735da1d5317f
    
}

export default FrontDeskLogin;

