import React, {useContext} from 'react';
import {NavLink, useNavigate} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Container, Nav, Navbar, Button} from "react-bootstrap";

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
        <Navbar bg="dark" variant="dark">
            <Container>
                <NavLink style={{color:'white', textDecoration: 'none'}} to={ROUTES.DICTIONARIES}>DMS</NavLink>
                {user.isAuth ?
                    <Nav className="ml-auto" style={{color: 'white'}}>
                        <Button
                            variant={"outline-light"}
                            onClick={() => logOut()}
                            className="ml-2"
                        >
                            Log out
                        </Button>
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
