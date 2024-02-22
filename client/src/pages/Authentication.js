import React, { useContext, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify"
import { observer } from 'mobx-react-lite'

import { Context } from '../index'
import { ROUTES } from '../constants'
import { login, registration } from '../http'
import { FormInput, Form, FormInputExplanation, FormTitle } from "../lib/Forms";
import { TextButton } from "../lib/Buttons";

import '../styles/Authentication.css';


const AuthenticationPage = observer(() => {
    const context = useContext(Context)
    // const user = context.user.user

    const isLogin = useLocation().pathname === ROUTES.LOGIN
    const navigate = useNavigate()

    // Global state
    const [state, setState] = useState({
        email: '',
        password: ''
    })

    const loginOrRegister = async () => {
        try {
            const userData = isLogin ?
                await toast.promise(login(state.email, state.password),
                    {
                        pending: 'Waiting for login...',
                        success: 'You are in',
                        error: 'Wrong email or password'
                    })
                :
                await toast.promise(registration(state.email, state.password),
                    {
                        pending: 'Waiting for registration...',
                        success: 'Registered successfully',
                        error: 'Check for email or password requirements'
                    })

            context.user.setUser(userData)
            context.user.setIsAuth(true)
            navigate(ROUTES.DICTIONARIES)
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    const handleAuthKeyDown = async () => {
        if (state.email !== '' && state.password !== '') {
            await loginOrRegister()
        }
    }

    return (
        <div className="authentication-container">
            <ToastContainer
                style={{ marginTop: 30 }} position="top-right" autoClose={2000} closeOnClick
            />
            <div className="authentication-position-container">
                <div>
                    <Form >
                        <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <FormTitle text="Email" />
                            <FormInput
                                variant='space-left'
                                value={state.email}
                                onChange={e => setState({ ...state, email: e.target.value })}
                                onKeyDown={handleAuthKeyDown}
                            >
                            </FormInput>
                        </div>

                        <FormTitle text="Password" />
                        <FormInput
                            variant='space-left'
                            value={state.password}
                            onChange={e => setState({ ...state, password: e.target.value })}
                            onKeyDown={handleAuthKeyDown}
                        >
                        </FormInput>
                    </Form>
                    {isLogin ?
                        <div>
                            <FormInputExplanation text="Dont have an account? " />
                            <NavLink className='authentication-explanation' to={ROUTES.REGISTRATION}>Register!</NavLink>
                        </div>
                        :
                        <div>
                            <FormInputExplanation text="Have an account? " />
                            <NavLink className='authentication-explanation' to={ROUTES.LOGIN}>Log in!</NavLink>
                        </div>
                    }
                    <TextButton
                        style={{ marginTop: 15 }}
                        onClick={handleAuthKeyDown}
                        text={isLogin ? 'Log in' : 'Registration'}
                    />
                </div>
            </div>
        </div>
    )
})

export default AuthenticationPage;
