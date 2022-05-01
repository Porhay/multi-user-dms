import {makeAutoObservable} from 'mobx'

class UserStore {
    constructor() {
        this._isAuth = true
        this._user = {}
        makeAutoObservable(this)
    }


    setIsAuth(bool) {
        this._isAuth = bool
    }
    get isAuth() {
        return this._isAuth
    }


    setUser(user) {
        this._user = user
    }
    get user() {
        return this._user
    }
}


export {
    UserStore
}
