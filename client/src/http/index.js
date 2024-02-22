import axios from 'axios'
import jwt_decode from 'jwt-decode'

const PORT = 8000
console.log(process.env.REACT_APP_NODE_ENV);
console.log(process.env.REACT_APP_EXTERNAL_SERVER_URL);
const baseURL = (process.env.REACT_APP_NODE_ENV === 'production' && process.env.REACT_APP_EXTERNAL_SERVER_URL) || `http://localhost:${PORT}` // `http://192.168.1.113:${PORT}`
// const baseURL = 'https://dms-server-2k3z.onrender.com' // TODO: for deploy only, update after fix
const host = axios.create({
    baseURL: baseURL, // TODO: Take local network ip from server side and replace with baseURL
    timeout: 1000 * 60 * 5, // 5m
    headers: { 'X-Custom-Header': 'foobar' }
})

const authHost = axios.create({
    baseURL: baseURL,
    timeout: 1000 * 60 * 5, // 5m
    headers: { 'X-Custom-Header': 'foobar' }
})

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}
authHost.interceptors.request.use(authInterceptor)


const catchError = (apiFunction) => async (...params) => {
    try {
        return await apiFunction(...params);
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            throw error;
        }
    }
};


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
    return await authHost.post(`/users/${userId}/share-dictionary/`, { dictionaryId, recipientId })
}



const createEntry = async (data) => {
    const { userId, dictionaryId, key, value } = data
    return await host.post(`/users/${userId}/dictionaries/${dictionaryId}/entries/`, { key, value })
}

const getEntries = async (userId, dictionaryId) => {
    return await host.get(`/users/${userId}/dictionaries/${dictionaryId}/entries/`)
}

const deleteEntry = async (userId, dictionaryId, entryId) => {
    return await host.delete(`/users/${userId}/dictionaries/${dictionaryId}/entries/${entryId}/`)
}


const registration = catchError(async (email, password) => {
    const response = await host.post('/users/', { email, password })
    localStorage.setItem('token', response.data.token)
    return { ...jwt_decode(response.data.token), userData: response.data.user };
})

const login = catchError(async (email, password) => {
    const response = await host.post('/users/login/', { email, password });
    localStorage.setItem('token', response.data.token);
    return { ...jwt_decode(response.data.token), userData: response.data.user };
});

const check = async () => {
    const response = await authHost.get('/users/check/')
    localStorage.setItem('token', response.data.token)
    return { ...jwt_decode(response.data.token), userData: response.data.user }
}

const updateProfile = async (userId, fields) => {
    return await authHost.post(`/users/${userId}/update-profile/`, { fields })
}


const addToFriendsByUsername = async (userId, friendId) => {
    return await authHost.post(`/users/${userId}/friends/`, { friendId: friendId })
}

const updateUsername = async (userId, username) => {
    return await authHost.post(`/users/${userId}/username/`, { username: username })
}

const getByIdOrUsername = async (data) => {
    return await authHost.get(`/users/${data}`)
}

const getFriends = async (userId) => {
    return await authHost.get(`/users/${userId}/friends/`)
}


// TODO refactor like in endpoints higher
const subscribeNotifications = async () => {
    const eventSource = new EventSource(`${baseURL}/notifications/`)
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


const importDictionary = async (userId, formData) => {
    return await authHost.post(`/users/${userId}/import-dictionary/`, formData)
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

    check,

    updateProfile,

    addToFriendsByUsername,
    getByIdOrUsername,
    getFriends,

    subscribeNotifications,
    sendNotification,

    sendProfileImage,
    importDictionary,
    updateUsername,
}
