import React, {createContext} from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import {UserStore, DictionaryStore} from './store/store'


export const Context = createContext(null)

ReactDOM.render(
    <Context.Provider value={{
        user: new UserStore(),
        dictionary: new DictionaryStore()
    }}>
        <App />
    </Context.Provider>,
    document.getElementById('root')
);
