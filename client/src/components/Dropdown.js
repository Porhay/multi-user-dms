import React, {useState} from 'react';
import '../styles/Dropdown.css';


// TODO fix onClickOutside: if mouse enter and leave without click, it will not be opened on next enter
const Dropdown = (props) => {
    const [open, setOpen] = useState(false);

    const onClickOutsideListener = () => {
        setOpen(false)
        document.removeEventListener("click", onClickOutsideListener)
    }

    const onMouseLeaveListener = () => {
        return () => document.addEventListener("click", onClickOutsideListener)
    }

    return (
        <>
            <a onMouseLeave={onMouseLeaveListener()} className="icon-button"
               onClick={() => setOpen(!open)}>{props.icon}</a>
            {open &&
                <div onMouseLeave={onMouseLeaveListener()} className="dropdown">
                    {props.items.map(item => {
                            return (
                                <a key={item.message} className="menu-item" onClick={item.action}>{item.message}</a>
                            )}
                    )}
                </div>}
        </>
    )
}

export default Dropdown;
