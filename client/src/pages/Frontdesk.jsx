import "./frontdesk.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ssback from '../img/ssback.png'





function Frontdesk() {
   
   
    
    


    return (
        <div className="container">
            <div className="frontdeskHeader">Front desk</div>
            <div>
            <img className="classimg" src={ssback}/>
            <Link to="/" className="bbutton" id="linkback">Back to the main page</Link>
             
            

            </div>
            
        </div>
    );
    
}

export default Frontdesk;

