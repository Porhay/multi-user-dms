import {makeAutoObservable} from 'mobx'

class UserStore {
    constructor() {
        this._isAuth = false
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
    updateUserData(toUpdate) {
        this._user = { ...this._user, userData: {...this._user.userData, ...toUpdate } }
    }
    get user() {
        return this._user
    }
}


export {
    UserStore
}
