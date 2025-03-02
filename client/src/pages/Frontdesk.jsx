import "./frontdesk.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RacerList from "../components/RacerList.ts";
import AddRacer from "../components/AddRacer";





function Frontdesk() {
   
   
    
    


    return (
        <div className="container">
            <div className="frontdeskHeader">Front desk</div>
            <div className="racerpanel">
                <AddRacer />
                //
            </div>
            <div>
            <Link to="/" className="bbutton" id="linkback">Back to the main page</Link>
            </div>
            
        </div>
    );
    
}

export default Frontdesk;

