import {ROUTES} from "./constants";

import Authentication from "./pages/Authentication";
import Dictionaries from "./pages/Dictionaries";
import Randomizer from "./pages/Randomizer";


export const authRoutes = [
    {
        path: ROUTES.DICTIONARIES,
        Component: Dictionaries
    },
    {
        path: ROUTES.RANDOMIZER,
        Component: Randomizer
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
