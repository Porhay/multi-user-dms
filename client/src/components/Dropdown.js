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

    // TODO move outside and replace with avatar image for account & IconButton for notifications
    return (
        <>
            <a onMouseLeave={onMouseLeaveListener()} className="icon-button"
               onClick={() => setOpen(!open)}>{props.icon}</a>
            {open &&
                <div onMouseLeave={onMouseLeaveListener()} style={props.style} className={props.className}>
                    {props.items.length !== 0 ? props.items.map(item => {
                        return <a key={item.message} className="menu-item" onClick={item.action}>{item.message}</a>
                    }) : <div className="nav-items-empty-div">&nbsp;&nbsp;It's empty for now&nbsp;&nbsp;</div>}
                </div>}
        </>
    )
}

export default Dropdown;
