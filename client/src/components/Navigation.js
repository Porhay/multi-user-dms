import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import CommentIcon from '@mui/icons-material/Comment';

import {shareDictionary, getProfileImageUrl} from "../http";
import {baseURL} from "../config.js";

import {Context} from "../index";
import {ROUTES} from "../constants";
import {Dropdown} from './Dropdown'

import avatarDefault from "../assets/images/profile-image-default.jpg";
import '../styles/Navigation.css';


const Navigation = observer(() => {
    const navigate = useNavigate()
    const context = useContext(Context)
    const user = context.user.user


    const [notifications, setNotifications] = useState([])
    useEffect(() => {
        // TODO if no connection to the server subscribe func occurs error every 2 sec
        subscribe().catch(e => console.log(e))
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource(`${baseURL}/notifications/`)
        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data) // {dictionaryId, recipientId, message, id, senderImageUrl}
            const newPost = {
                ...data,
                action: async () => await shareCurrentDictionary(data),
                // TODO fix dropdown shutdown on setState. Save notifications in db?
                cancel: () => setNotifications([...notifications.filter(item => item.id !== data.id)])
            }
            setNotifications(prev => [newPost, ...prev])
        }
        console.log(notifications)
    }

    const shareCurrentDictionary = async (data) => {
        const {dictionaryId, recipientId, id} = data
        await shareDictionary(user.id, dictionaryId, recipientId)
        setNotifications([...notifications.filter(item => item.id !== id)])
    }

    const accountList = [
        {message: 'Accounts', action: () => navigate(ROUTES.ACCOUNT)},
        {message: 'Dictionaries', action: () => navigate(ROUTES.DICTIONARIES)},
        {message: 'Settings', action: () => navigate(ROUTES.SETTINGS)},
        {message: 'Log out', action: () => logOut()},
    ]

    const logOut = () => {
        context.user.setUser({})
        context.user.setIsAuth(false)
        navigate(ROUTES.LOGIN)
        localStorage.clear()
    }

    const Navbar = (props) => (
        <nav className="navbar">
            <ul className="navbar-nav">
                {props.children}
            </ul>
        </nav>
    )

    const ProfileImage = () => (
        <img src={user.userData.downloadUrl ? user.userData.downloadUrl : avatarDefault}
             className="navigation-profile-image" alt="profile image"/>
    )

    return (
        <Navbar>
            <a href="/" className="a-logo" onClick={() => navigate(ROUTES.DICTIONARIES)}>
                {/*<AccessibleForwardIcon/>DMS*/}
                <CommentIcon fontSize="small"/> DMS
            </a>
            <div className="nav-items-right">
                {context.user.isAuth ?
                    <div className="nav-one-item-right">
                        <li key={notifications.message} className="nav-item">
                            <Dropdown
                                items={notifications}
                                icon={<NotificationsNoneIcon className="icon"/>}
                                className='nav-notification-dropdown'
                                option='notification'
                            />
                        </li>
                        <li key={notifications.message} className="nav-item">
                            <Dropdown
                                items={accountList}
                                icon={<ProfileImage/>}
                                className='nav-image-dropdown'
                            />
                        </li>
                    </div>
                    :
                    <div>
                        <a className="menu-item" onClick={() => navigate(ROUTES.LOGIN)}>
                            Authorisation
                        </a>
                    </div>
                }
            </div>
        </Navbar>
    )
})

export default Navigation;
