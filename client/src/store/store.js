import {makeAutoObservable} from 'mobx'

class UserStore {
    constructor() {
        this._isAuth = true
        this._user = {}
        this._profileImage = {url: 'client/public/images/profile-image-default.jpg'}
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


    setProfileImage(profileImage) {
        this._profileImage = profileImage
    }
    get profileImage() {
        return this._profileImage
    }
}


export {
    UserStore
}
