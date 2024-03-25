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
        if (state.email !== '' && state.password !== '') {
            const response = isLogin ? await login(state.email, state.password) :
                await registration(state.email, state.password);

            if (!response.error) {
                context.user.setUser(response)
                context.user.setIsAuth(true)
                navigate(ROUTES.DICTIONARIES)
            } else {
                toast.warning(response.error, {
                    position: "top-right", autoClose: 1500,
                    hideProgressBar: false, closeOnClick: true,
                    pauseOnHover: true, draggable: true
                })
            }
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
                        <div style={{ marginBottom: 10 }}>
                            <FormTitle text="Email" />
                            <FormInput
                                variant='space-left'
                                value={state.email}
                                onChange={e => setState({ ...state, email: e.target.value })}
                                onKeyDown={loginOrRegister}
                            >
                            </FormInput>
                        </div>

                        <FormTitle text="Password" />
                        <FormInput
                            variant='space-left'
                            value={state.password}
                            onChange={e => setState({ ...state, password: e.target.value })}
                            onKeyDown={loginOrRegister}
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
                        style={{ marginTop: 8 }}
                        onClick={loginOrRegister}
                        text={isLogin ? 'Log in' : '  Registration  '}
                    />
                </div>
            </div>
        </div>
    )
})

export default AuthenticationPage;
