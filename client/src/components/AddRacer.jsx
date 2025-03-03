import React from 'react';

function AddRacer({ addDriver, removeDriver }) {
    return (
        <div>
            <button className='bbutton' onClick={addDriver}>
                Add a racer
            </button>

            <button className='bbutton' onClick={removeDriver}>
                Remove a racer
            </button>
        </div>
    );
}

export default AddRacer;