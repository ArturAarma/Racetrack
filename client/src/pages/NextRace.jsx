import "./NextRace.css";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AddRacer from "../components/AddRacer";
import RacerList from "../components/RacerList.ts";

function NextRace() {
    const [drivers, setDrivers] = useState([]); // State to store the list of divs

    const addDriver = () => {
        // Add a new div to the list
        if (drivers.length < RacerList.length) {
            const newDriver = {
                id: RacerList[drivers.length].name, 
                name: RacerList[drivers.length].name,
            };
            setDrivers([...drivers, newDriver])
        }
    };

    function removeThisDriver(id) {
        setDrivers(drivers.filter(driver => driver.id !== id));
      }

    
    return (
        <div className="container">
            <div className="frontdeskHeader">Front desk</div>
            <div className="racerpanel">
                <div className="PanelButtons">
                    
                    <AddRacer addDriver={addDriver} />
                </div>
                <div className="Racers">
                {drivers.map(driver => (
                        <div key={driver.id} className="drivers" id={driver.id}>
                            <div>{driver.name}</div>
                            <button className="removebutton" onClick={() => removeThisDriver(driver.id)}>
                                -
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <Link to="/" className="bbutton" id="linkback">Back to the main page</Link>
            </div>
        </div>
    );
}

export default NextRace;