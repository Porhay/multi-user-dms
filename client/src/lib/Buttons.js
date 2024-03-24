import React from "react";
import '../styles/Buttons.css';

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


const Icon = (props) => {
    switch (props.icon) {
        case 'EditOutlinedIcon': return <EditOutlinedIcon style={iconStyle} />
        case 'NotificationsNoneIcon': return <NotificationsNoneIcon style={iconStyle} />
        case 'AccessibleForwardIcon': return <AccessibleForwardIcon style={iconStyle} />
        case 'AccountCircleOutlinedIcon': return <AccountCircleOutlinedIcon style={iconStyle} />
        default: return <span className="default-text">{props.icon}</span> // text
    }
}

const IconTextButton = (props) => {
    return (
        <a className="icon-text-button" onClick={props.onClick}>
            <Icon icon={props.icon} />
            <span style={textStyle}>{props.text}</span>
        </a>
    )
}

const IconButton = (props) => {
    return (
        <a className="icon-button" onClick={props.onClick}>
            <Icon icon={props.icon} />
        </a>
    )
}

const TextButton = (props) => {
    let buttonStyle = 'text-button'
    if (props.variant === 'cancel') {
        buttonStyle = 'text-button-cancel'
    }

    return (
        <div style={props.style}>
            <a className={buttonStyle} onClick={props.onClick}>
                <span style={textStyle}>{props.text}</span>
            </a>
        </div>
    )
}


//=== Button Styles
const iconStyle = { fontSize: 19, paddingBottom: 2 }
const textStyle = { marginLeft: 2 }

export { IconTextButton, IconButton, TextButton }
