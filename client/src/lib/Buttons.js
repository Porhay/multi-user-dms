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
        default: return <text className="default-text">{props.icon}</text> // text
    }
}

const IconTextButton = (props) => {
    return (
        <a className="icon-text-button" onClick={props.onClick}>
            <Icon icon={props.icon}/>
            <text style={textStyle}>{props.text}</text>
        </a>
    )
}


const IconButton = (props) => {
    return (
        <a className="icon-button" onClick={props.onClick}>
            <Icon icon={props.icon}/>
        </a>
    )
}


const SubmitButton = (props) => {
    return (
        <a className="icon-button" onClick={props.onClick}>
            <text style={textStyle}>{props.text}</text>
        </a>
    )
}


//=== Button Styles
const iconStyle = {fontSize: 19, paddingBottom: 2}
const textStyle = {marginLeft: 2}

export {IconTextButton, IconButton, SubmitButton}
