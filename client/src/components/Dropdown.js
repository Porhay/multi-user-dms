import React from 'react';
import '../styles/Dropdown.css';


const Dropdown = (props) => (
    <div className="dropdown">
        {props.items.map(item => <a className="menu-item" onClick={item.action}>{item.name}</a>)}
    </div>
)
export default Dropdown;
