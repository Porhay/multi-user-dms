import {makeAutoObservable} from 'mobx'

class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    // Setters
    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }


    // Getters
    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
}


class DictionaryStore {

}

export {
    UserStore,
    DictionaryStore
}
