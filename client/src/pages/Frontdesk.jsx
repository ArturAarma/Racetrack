import "./frontdesk.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddRacer from "../components/AddRacer";
import RacerList from "../components/RacerList.ts";

function Frontdesk() {
    const [divs, setDivs] = useState([]); // State to store the list of divs

    const addDriver = () => {
        // Add a new div to the list
        if (divs.length < RacerList.length) {
        setDivs([...divs, 
        <div key={divs.length} className="drivers">
            {RacerList[divs.length].name}
        </div>]);
        }
    };

    const removeDriver = () => {
        // Remove the last div from the list
        if (divs.length > 0) {
            const updatedDivs = divs.slice(0, -1);
            setDivs(updatedDivs);
        }
    };

    return (
        <div className="container">
            <div className="frontdeskHeader">Front desk</div>
            <div className="racerpanel">
                <div className="PanelButtons">
                    
                    <AddRacer addDriver={addDriver} removeDriver={removeDriver} />
                </div>
                <div className="Racers">
                    
                    {divs}
                </div>
            </div>
            <div>
                <Link to="/" className="bbutton" id="linkback">Back to the main page</Link>
            </div>
        </div>
    );
}

export default Frontdesk;