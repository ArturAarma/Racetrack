import "./FrontdeskLogin.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import Frontdesk from "./Frontdesk";

import checkPw from '../components/CheckPw';



function FrontdeskLogin() {
   
   
    const [password, setPassword] = useState("");
    const [loginStatus, setLoginStatus] = useState(null);

    const loginClick = (event) => {
        event.preventDefault(); 
        const status = checkPw(password);
        setLoginStatus(status.toLowerCase());
    };
    


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
                   <Frontdesk/>
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
    
}

export default FrontdeskLogin;

