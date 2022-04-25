import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

// import {subscribeNotifications} from '../http'

import {Context} from "../index";
import {ROUTES} from "../constants";
import Dropdown from './Dropdown'

import '../styles/Navigation.css';
import {shareDictionary} from "../http";


const Navigation = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()
    const userId = user.user.id


    const [notifications, setNotifications] = useState([{message: 'It\'s empty for now', id: 1}])
    useEffect(() => {
        // TODO if no connection to the server subscribe func occurs error every 2 sec
        subscribe().catch(e => console.log(e))
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:8000/notifications/`)
        eventSource.onmessage = function (event) {
            const data = JSON.parse(event.data) // {dictionaryId, recipientId, message, id}

            const newPost = {
                ...data,
                action: () => shareCurrentDictionary({userId, ...data})
            }
            setNotifications(prev => [newPost, ...prev])
        }
    }

    const shareCurrentDictionary = async (data) => {
        const {userId, dictionaryId, recipientId, id} = data
        await shareDictionary(userId, dictionaryId, recipientId)
        setNotifications([...notifications.filter(item => item.id !== id)])
    }

    const accountList = [
        {message: 'Account', action: () => navigate(ROUTES.ACCOUNT)},
        {message: 'Settings', action: () => navigate(ROUTES.SETTINGS)},
        {message: 'Randomizer', action: () => navigate(ROUTES.RANDOMIZER)},
        {message: 'Log out', action: () => logOut()},
    ]

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
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

    const Logo = () => (
        <a href="/" className="a-logo" onClick={() => navigate(ROUTES.DICTIONARIES)}><AccessibleForwardIcon/>DMS</a>
    )

    const NavItem = (props) => (
        <li key={props.items.message} className="nav-item">
            <Dropdown style={'nav-dropdown'} items={props.items} icon={props.icon} />
        </li>
    )

    return (
        <Navbar>
            <Logo/>
            {user.isAuth ?
                <div className="nav-items-right">
                    <NavItem items={notifications} icon={<NotificationsNoneIcon className="icon"/>}/>
                    <NavItem items={accountList} icon={<AccountCircleOutlinedIcon className="icon"/>}/>
                </div>
                :
                <div className="nav-items-right">
                    <a className="menu-item" onClick={() => navigate(ROUTES.LOGIN)}>
                        Authorisation
                    </a>
                </div>
            }
        </Navbar>
    )
})

export default Navigation;
