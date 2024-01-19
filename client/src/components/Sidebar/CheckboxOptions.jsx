import React, { useContext } from 'react';
import { InventoryContext } from '../../contexts/inventory.context';
import './sidebar.css';

function CheckboxOptions() {
    const { inventory } = useContext(InventoryContext);


    return (
        <div className='checkbox-options-container'>
            <button>Highlight Selected</button>
            <button>Delete Selected</button>
        </div>
    )
}

export default CheckboxOptions
