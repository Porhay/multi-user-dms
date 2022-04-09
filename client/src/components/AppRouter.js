import React, {useContext} from 'react'
import { Routes, Route } from 'react-router-dom'
import {observer} from "mobx-react-lite"

import {Context} from "../index"
import {authRoutes, publicRoutes} from "../routes"


const AppRouter = observer(() => {
    const {user} = useContext(Context)


    // TODO Replace Route path='*' with redirecting component '/' route
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route path={path} element={<Component />} exact />
            )}
            {publicRoutes.map(({path, Component}) =>
                <Route path={path} element={<Component />} exact />
            )}
            <Route path='*' element={<p>There's nothing here!</p>} />
        </Routes>
    )
})

export default AppRouter
