import {ROUTES} from "./constants";

import Authentication from "./pages/Authentication";
import Dictionaries from "./pages/Dictionaries";


export const authRoutes = [
    {
        path: ROUTES.DICTIONARIES,
        Component: Dictionaries
    },
]

export const publicRoutes = [
    {
        path: ROUTES.LOGIN,
        Component: Authentication
    },
    {
        path: ROUTES.REGISTRATION,
        Component: Authentication
    },
]
