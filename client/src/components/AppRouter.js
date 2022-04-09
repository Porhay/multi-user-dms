import React, {useContext} from 'react'
import { Routes, Route } from 'react-router-dom'
import {observer} from "mobx-react-lite"

import {authRoutes, publicRoutes} from "../routes"
import {Context} from "../index"

const AppRouter = observer(() => {
    const {user} = useContext(Context)


    // TODO Replace Route with path='*' with redirecting component to '/' route
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
