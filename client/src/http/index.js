import axios from 'axios'
import jwt_decode from 'jwt-decode'

const PORT = 8000
const host = axios.create({
    // TODO Take local network ip from server side and replace with baseURL
    baseURL: `http://localhost:${PORT}` || `http://192.168.0.102:${PORT}`,  // 'http://localhost:8000' ||
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


const createDictionary = async (data) => {
    const {userId, name} = data
    return await host.post(`/users/${userId}/dictionaries/`, {name})
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
    const {data} = await host.post('/users/login/', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

const check = async () => {
    const {data} = await authHost.get('/users/check/' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

const updateProfile = async (userId, fields) => {
    return await authHost.post(`/users/${userId}/update-profile/`, {fields})
}


const addFriend = async (userId, friendId) => {
    return await authHost.post(`/users/${userId}/friends/`, {friendId})
}

const getFriend = async (userId, friendName) => {
    return await authHost.get(`/users/${userId}/friends/${friendName}`, { params: { friend: friendName } })
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

const sendNotification = async (message, dictionaryId, recipientId) => {
    return await authHost.post('/notifications/', {
        message, dictionaryId, recipientId
    })
}

export {
    host,

    createDictionary,
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

    addFriend,
    getFriend,
    getFriends,

    subscribeNotifications,
    sendNotification,
}
