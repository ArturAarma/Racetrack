import React from 'react';

function AddRacer({ addDriver, removeDriver }) {
    return (
        <div>
            <button className='bbutton' onClick={addDriver}>
                Add a racer
            </button>
        </div>
    );
}

export default AddRacer;