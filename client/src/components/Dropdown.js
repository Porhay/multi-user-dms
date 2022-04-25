import React from 'react';
import '../styles/Dropdown.css';


const Dropdown = (props) => (
    <div onMouseLeave={props.onMouseLeave} className="dropdown">
        {props.items.map(item => <a key={item.message} className="menu-item" onClick={item.action}>{item.message}</a>)}
    </div>
)
export default Dropdown;
