import React, {useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

import {Context} from "../index";
import {ROUTES} from "../constants";
import Dropdown from './Dropdown'

import '../styles/Navigation.css';


const Navigation = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const [notifications, setNotifications] = useState([{name: 'It\'s empty for now'}])
    const accountList = [
        {
            name: 'Account',
            action: () => navigate(ROUTES.ACCOUNT)
        },
        {
            name: 'Settings',
            action: () => navigate(ROUTES.SETTINGS)
        },
        {
            name: 'Randomizer',
            action: () => navigate(ROUTES.RANDOMIZER)
        },
        {
            name: 'Log out',
            action: () => logOut()
        },
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

    const NavItem = (props) => {
        const [open, setOpen] = useState(false);

        const onClickOutsideListener = () => {
            setOpen(false)
            document.removeEventListener("click", onClickOutsideListener)
        }

        return (
            <li onMouseLeave={() => {document.addEventListener("click", onClickOutsideListener)}} className="nav-item">
                <a className="icon-button" onClick={() => setOpen(!open)}>{props.icon}</a>
                {open &&
                    <Dropdown onMouseLeave={() => {document.addEventListener("click", onClickOutsideListener)}}
                              items={props.items}>
                    </Dropdown>
                }
            </li>
        )
    }

    return (
        <Navbar>
            <Logo/>
            {user.isAuth ?
                <div className="nav-items-right">
                    <NavItem items={notifications} icon={<NotificationsNoneIcon className="icon"/>} />
                    <NavItem items={accountList} icon={<AccountCircleOutlinedIcon className="icon"/>} />
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
