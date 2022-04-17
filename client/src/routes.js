import {ROUTES} from "./constants";

import AuthenticationPage from "./pages/Authentication";
import DictionariesPage from "./pages/Dictionaries";
import EntriesPage from "./pages/Entries";
import RandomizerPage from "./pages/Randomizer";


export const authRoutes = [
    {
        path: ROUTES.DICTIONARIES,
        Component: DictionariesPage
    },
    {
        path: ROUTES.ENTRIES + '/:id',
        Component: EntriesPage
    },
    {
        path: ROUTES.RANDOMIZER,
        Component: RandomizerPage
    },
]

export const publicRoutes = [
    {
        path: ROUTES.LOGIN,
        Component: AuthenticationPage
    },
    {
        path: ROUTES.REGISTRATION,
        Component: AuthenticationPage
    },
]
