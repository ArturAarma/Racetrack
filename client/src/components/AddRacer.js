
import React, { useState } from 'react';

import RacerList from "../components/RacerList.ts";



function AddRacer() {
    const [count, setCount] = useState(0);

    function handleClick() {
        setCount(count + 1);
    }
    return (
    <div>
        <button onClick={handleClick}>
            Add a racer
        </button>


    <div>
    {RacerList[count].name}

    </div>
</div>
    );
}

export default AddRacer;