import React, {useContext} from 'react';
import {Container, Nav, Navbar, Button, NavDropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import {ROUTES} from "../constants";

import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';


const Navigation = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        navigate(ROUTES.LOGIN)
        localStorage.clear()
    }

    // TODO image dropdown title instead of icon
    // TODO custom dropdown for notifications button
    return (
        <Navbar variant="dark" bg="dark" expand="lg" >
            <Container>
                <Navbar.Brand className="d-flex flex-row align-items-center justify-content-between" onClick={() => navigate(ROUTES.DICTIONARIES)}>
                    <AccessibleForwardIcon/>
                    DMS
                </Navbar.Brand>
                {user.isAuth ?
                    <Nav className="ml-auto"  style={{color: 'white'}}>
                        <Button variant="link" size="sm">
                            <NotificationsNoneIcon style={{color: 'white', marginTop: '2px'}} />
                        </Button>
                        <NavDropdown
                            id="nav-dropdown-dark"
                            title={
                                <AccountCircleOutlinedIcon style={{color: 'white'}}/>
                            }
                            menuVariant="dark"
                        >
                            <NavDropdown.Item onClick={() => navigate(ROUTES.ACCOUNT)}>Account</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(ROUTES.SETTINGS)}>Settings</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate(ROUTES.RANDOMIZER)}>Randomizer</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={() => logOut()}>Log out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    :
                    <Nav className="ml-auto" style={{color: 'white'}}>
                        <Button variant={"outline-light"} onClick={() => navigate(ROUTES.LOGIN)}>Authorisation</Button>
                    </Nav>
                }
            </Container>
        </Navbar>

    );
});

export default Navigation;
