import axios from 'axios'
import jwt_decode from 'jwt-decode'
import * as config from '../config.js'

const host = axios.create({ baseURL: config.baseURL, timeout: config.timeout })
const authHost = axios.create({ baseURL: config.baseURL, timeout: config.timeout })

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


export const createOrUpdateDictionary = async (data) => {
    const userId = data.userId
    const body = {
        name: data.name
    }
    if (data.dictionaryId) {
        body.dictionaryId = data.dictionaryId
    }
    return await host.post(`/users/${userId}/dictionaries/`, body)
}

export const getDictionaries = async (userId) => {
    return await host.get(`/users/${userId}/dictionaries/`)
}

export const deleteDictionary = async (userId, dictionaryId) => {
    return await host.delete(`/users/${userId}/dictionaries/${dictionaryId}/`)
}

export const shareDictionary = async (userId, dictionaryId, recipientId) => {
    return await authHost.post(`/users/${userId}/share-dictionary/`, { dictionaryId, recipientId })
}

export const createEntry = async (data) => {
    const { userId, dictionaryId, key, value } = data
    return await host.post(`/users/${userId}/dictionaries/${dictionaryId}/entries/`, { key, value })
}

export const getEntries = async (userId, dictionaryId) => {
    return await host.get(`/users/${userId}/dictionaries/${dictionaryId}/entries/`)
}

export const deleteEntry = async (userId, dictionaryId, entryId) => {
    return await host.delete(`/users/${userId}/dictionaries/${dictionaryId}/entries/${entryId}/`)
}

export const registration = catchError(async (email, password) => {
    const response = await host.post('/users/', { email, password })
    localStorage.setItem('token', response.data.token)
    return { ...jwt_decode(response.data.token), userData: response.data.user };
})

export const login = catchError(async (email, password) => {
    const response = await host.post('/users/login/', { email, password });
    localStorage.setItem('token', response.data.token);
    return { ...jwt_decode(response.data.token), userData: response.data.user };
});

export const check = async () => {
    const response = await authHost.get('/users/check/')
    localStorage.setItem('token', response.data.token)
    return { ...jwt_decode(response.data.token), userData: response.data.user }
}

export const updateProfile = async (userId, fields) => {
    return await authHost.post(`/users/${userId}/update-profile/`, { fields })
}

export const addToFriendsByUsername = async (userId, friendId) => {
    return await authHost.post(`/users/${userId}/friends/`, { friendId: friendId })
}

export const updateUsername = async (userId, username) => {
    return await authHost.post(`/users/${userId}/username/`, { username: username })
}

export const getByIdOrUsername = async (data) => {
    return await authHost.get(`/users/${data}`)
}

export const getFriends = async (userId) => {
    return await authHost.get(`/users/${userId}/friends/`)
}

// TODO refactor like in endpoints higher
export const subscribeNotifications = async () => {
    const eventSource = new EventSource(`${config.baseURL}/notifications/`)
    eventSource.onmessage = function (event) {
        return JSON.parse(event.data)
    }
}

export const sendNotification = async (message, dictionaryId, recipientId, senderImageUrl) => {
    return await authHost.post('/notifications/', {
        message, dictionaryId, recipientId, senderImageUrl
    })
}

export const sendProfileImage = async (userId, formData) => {
    return await authHost.post(`/users/${userId}/upload-profile-image/`, formData)
}

export const updateProfileImage = catchError(async (userId, formData) => {
    const response = await authHost.post(`/users/${userId}/files/`, formData)
    return response.data
})

export const getProfileImageUrl = catchError(async (userId, fileId) => {
    const response = await authHost.get(`/users/${userId}/files/${fileId}`)
    console.log(response.data);
    return response.data
})

export const importDictionary = async (userId, formData) => {
    return await authHost.post(`/users/${userId}/import-dictionary/`, formData)
}
