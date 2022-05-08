import React, {useContext, useState} from 'react'
import {NavLink, useLocation, useNavigate} from 'react-router-dom'
import {Container, Form, Card, Button, Row} from 'react-bootstrap'
import {toast, ToastContainer} from "react-toastify"
import {observer} from 'mobx-react-lite'

import {ROUTES} from '../constants'
import {login, registration} from '../http'
import {Context} from '../index'


const AuthenticationPage = observer(() => {
    const {user} = useContext(Context)
    const isLogin = useLocation().pathname === ROUTES.LOGIN
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const loginOrRegister = async () => {
        try {
            const userData = isLogin ?
                await toast.promise(login(email, password),
                    {
                        pending: 'Waiting for login...',
                        success: 'You are in',
                        error: 'Wrong email or password'
                    })
                :
                await toast.promise(registration(email, password),
                    {
                        pending: 'Waiting for registration...',
                        success: 'Registered successfully',
                        error: 'Check for email or password requirements'
                    })

            user.setUser(userData)
            user.setIsAuth(true)
            navigate(ROUTES.DICTIONARIES)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: window.innerHeight - 54}}
        >
            <ToastContainer
                style={{marginTop:30}} position="top-right" autoClose={5000}
                closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover
            />
            <Card style={{width: 600}} className="p-5">
                <h2 className="m-auto">{isLogin ? 'Log in' : "Registration"}</h2>
                <Form className="d-flex flex-column">
                    <Form.Control
                        className="mt-3"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <Form.Control
                        className="mt-3"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                    />
                    <Row className="d-flex justify-content-between mt-3 pl-3 pr-3">
                        {isLogin ?
                            <div>
                                Dont have an account? <NavLink to={ROUTES.REGISTRATION}>Register!</NavLink>
                            </div>
                            :
                            <div>
                                Have an account? <NavLink to={ROUTES.LOGIN}>Log in!</NavLink>
                            </div>
                        }
                    </Row>
                </Form>
                <Button
                    variant={"outline-success"}
                    onClick={loginOrRegister}
                    style={{marginTop: 6}}
                >
                    {isLogin ? 'Log in' : 'Registration'}
                </Button>
            </Card>
        </Container>
    );
});

export default AuthenticationPage;
