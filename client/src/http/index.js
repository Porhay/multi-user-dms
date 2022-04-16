import axios from 'axios'
import jwt_decode from 'jwt-decode'


const host = axios.create({
    // TODO Take local network ip from server side and replace with baseURL
    baseURL: 'http://localhost:8000' || 'http://192.168.0.100:8000',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

const authHost = axios.create({
    baseURL: 'http://localhost:8000' || 'http://192.168.0.100:8000',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

authHost.interceptors.request.use((config) => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
})


const createDictionary = async (userId, name) => {
    return await host.post(`/users/${userId}/dictionaries/`, {name})
}

const getDictionaries = async (userId) => {
    return await host.get(`/users/${userId}/dictionaries/`)
}



const createEntry = async (data) => {
    const {userId, dictionaryId, key, value} = data
    return await host.post(`/users/${userId}/dictionaries/${dictionaryId}/entries/`,
        {key, value})
}

const getAll = async (userId, dictionaryId) => {
    return await host.get(`/users/${userId}/dictionaries/${dictionaryId}/entries/`)

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

// const check = async () => {
//     const {data} = await authHost.get('api/user/auth' )
//     localStorage.setItem('token', data.token)
//     return jwt_decode(data.token)
// }


export {
    host,
    createEntry,
    getRandomOne,
    registration,
    login,
    // check
}
