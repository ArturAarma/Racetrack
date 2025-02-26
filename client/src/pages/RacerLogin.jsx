import "./RacerLogin.css";
import React from 'react';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom/client';



const RacerLogin = () => {
    return (
        <div>
            <div>You are on the racer homepage</div>
            <Link to="/" className="bbutton">Back to the main page</Link>
        
        </div>
    )
    
};

export default RacerLogin;