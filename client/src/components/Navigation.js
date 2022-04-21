import React, {useContext} from 'react';
import {Container, Nav, Navbar, Button, NavDropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";

import {Context} from "../index";
import {ROUTES} from "../constants";


const Navigation = observer(() => {
    const {user} = useContext(Context)
    const navigate = useNavigate()

    const logOut = () => {
        user.setUser({})
        user.setIsAuth(false)
        navigate(ROUTES.LOGIN)
        localStorage.clear()
    }

    return (
        <Navbar variant="dark" bg="dark" expand="lg" >
            <Container>
                <Navbar.Brand onClick={() => navigate(ROUTES.DICTIONARIES)}>DMS</Navbar.Brand>
                {user.isAuth ?
                    <Nav className="ml-auto" style={{color: 'white'}}>
                        <NavDropdown
                            id="nav-dropdown-dark"
                            title="Account"
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
                        <Button variant={"outline-light"} onClick={() => navigate(ROUTES.LOGIN)}>Авторизация</Button>
                    </Nav>
                }
            </Container>
        </Navbar>

    );
});

export default Navigation;
