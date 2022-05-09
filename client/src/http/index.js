import axios from 'axios'
import jwt_decode from 'jwt-decode'

const PORT = 8000
const baseURL = `http://localhost:${PORT}/`
const host = axios.create({
    // TODO Take local network ip from server side and replace with baseURL
    baseURL: baseURL || `http://192.168.0.102:${PORT}`,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

const authHost = axios.create({
    baseURL: `http://localhost:${PORT}` || `http://192.168.0.100:${PORT}`,
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}
authHost.interceptors.request.use(authInterceptor)


const createOrUpdateDictionary = async (data) => {
    const userId = data.userId
    const body = {
        name: data.name
    }
    if (data.dictionaryId) {
        body.dictionaryId = data.dictionaryId
    }
    return await host.post(`/users/${userId}/dictionaries/`, body)
}

const getDictionaries = async (userId) => {
    return await host.get(`/users/${userId}/dictionaries/`)
}

const deleteDictionary = async (userId, dictionaryId) => {
    return await host.delete(`/users/${userId}/dictionaries/${dictionaryId}/`)
}

const shareDictionary = async (userId, dictionaryId, recipientId) => {
    return await authHost.post(`/users/${userId}/share-dictionary/`, {dictionaryId, recipientId})
}



const createEntry = async (data) => {
    const {userId, dictionaryId, key, value} = data
    return await host.post(`/users/${userId}/dictionaries/${dictionaryId}/entries/`,
        {key, value})
}

const getEntries = async (userId, dictionaryId) => {
    console.log(dictionaryId)
    return await host.get(`/users/${userId}/dictionaries/${dictionaryId}/entries/`)
}

const deleteEntry = async (userId, dictionaryId, entryId) => {
    return await host.delete(`/users/${userId}/dictionaries/${dictionaryId}/entries/${entryId}/`)
}

const getRandomOne = async (dictionaryId) => {
    return await host.get(`/random/${dictionaryId}`)
}



const registration = async (email, password) => {
    const {data} = await host.post('/users/', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

const login = async (email, password) => {
    const response = await host.post('/users/login/', {email, password})
    localStorage.setItem('token', response.data.token)
    return {...jwt_decode(response.data.token), userData: response.data.user}
}

const check = async () => {
    const response = await authHost.get('/users/check/' )
    localStorage.setItem('token', response.data.token)
    return {...jwt_decode(response.data.token), userData: response.data.user}
}

const updateProfile = async (userId, fields) => {
    return await authHost.post(`/users/${userId}/update-profile/`, {fields})
}


const addByUsername = async (userId, friendId) => {
    return await authHost.post(`/users/${userId}/friends/`, {friendId})
}

const getByUsername = async (userId, username) => {
    return await authHost.get(`/users/${userId}/friends/${username}`, {params: { username } })
}

const getFriends = async (userId) => {
    return await authHost.get(`/users/${userId}/friends/`)
}


// TODO refactor like in endpoints higher
const subscribeNotifications = async () => {
    const eventSource = new EventSource(`http://localhost:${PORT}/notifications/`)
    eventSource.onmessage = function (event) {
        return JSON.parse(event.data)
    }
}

const sendNotification = async (message, dictionaryId, recipientId, senderImageUrl) => {
    return await authHost.post('/notifications/', {
        message, dictionaryId, recipientId, senderImageUrl
    })
}

const sendProfileImage = async (userId, formData) => {
    return await authHost.post(`/users/${userId}/upload-profile-image/`, formData)
}

const getUser = async (userId) => {
    return await authHost.get(`/users/${userId}/`)
}


export {
    baseURL,
    createOrUpdateDictionary,
    getDictionaries,
    deleteDictionary,
    shareDictionary,

    createEntry,
    getEntries,
    deleteEntry,

    registration,
    login,
    getRandomOne,

    check,

    updateProfile,

    addByUsername,
    getByUsername,
    getFriends,

    subscribeNotifications,
    sendNotification,

    sendProfileImage,
    getUser,
}
