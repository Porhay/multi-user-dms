import React, {useState} from 'react';
import {TextButton} from "../lib/Buttons";

import avatarDefault from "../assets/images/profile-image-default.jpg";
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

    if (!props.option || props.option === 'default') {
        return (
            <>
                <a onMouseLeave={onMouseLeaveListener()} className="icon-button"
                   onClick={() => setOpen(!open)}>{props.icon}</a>
                {open &&
                    <div onMouseLeave={onMouseLeaveListener()} className={props.className}>
                        {props.items.length !== 0 ? props.items.map(item => {
                            return <a key={item.message} className="menu-item" onClick={item.action}>{item.message}</a>
                        }) : <div className="nav-items-empty-div">&nbsp;&nbsp;It's empty for now&nbsp;&nbsp;</div>}
                    </div>}
            </>
        )
    } else if (props.option === 'notification') {
        return (
            <>
                <a onMouseLeave={onMouseLeaveListener()} className="icon-button"
                   onClick={() => setOpen(!open)}>{props.icon}</a>
                {open &&
                    <div onMouseLeave={onMouseLeaveListener()} className={props.className}>
                        {props.items.length !== 0 ? props.items.map(item => {
                            return (
                                <div className='dropdown-notification-div'>
                                    <div className="dropdown-notification-sender-image-div">
                                        <img src={item.senderImageUrl || avatarDefault}
                                             className="dropdown-notification-sender-image" alt="sender image"/>
                                    </div>
                                    <a key={item.message} className="notification-menu-item">{item.message}</a>
                                    <TextButton onClick={item.action} text='✓'/>
                                    <TextButton onClick={item.cancel} text='×'/>
                                </div>
                            )
                        }) : <div className="nav-items-empty-div">&nbsp;&nbsp;It's empty for now&nbsp;&nbsp;</div>}
                    </div>}
            </>
        )
    }

}


export {Dropdown};
