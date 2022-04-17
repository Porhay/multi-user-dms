import React, {useContext, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import {observer} from "mobx-react-lite";
import {Spinner} from "react-bootstrap";

import {check} from "./http";
import {Context} from "./index";

import AppRouter from "./components/AppRouter";
import Navigation from "./components/Navigation";
import './styles/App.css';

const App = observer(() => {
    const {user} = useContext(Context)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        check().then(data => {
            user.setUser(true)
            user.setIsAuth(true)
        }).finally(() => setLoading(false))
    }, [])

    if (loading) {
        return <Spinner className={"d-flex align-items-center justify-content-center"} animation={"border"}/>
    }

    return (
        <BrowserRouter>
            <Navigation />
            <AppRouter />
        </BrowserRouter>
    )
})

export default App;
