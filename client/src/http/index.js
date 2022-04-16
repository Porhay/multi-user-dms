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


const userId = '726d6368-80bd-4820-9d11-bc43fc215d47'
const dictionaryId = '726d6368-80bd-4820-9d11-bc43fc215d47'
const createEntry = async (key, value) => {
    return await host.post(`/users/${userId}/dictionaries/${dictionaryId}/entries/`,
        {key, value})
}

const getRandomOne = async () => {
    return await host.get(`/random/${dictionaryId}`)
}



const registration = async (email, password) => {
    const {data} = await host.post('/user/registration', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

const login = async (email, password) => {
    const {data} = await host.post('/user/login', {email, password})
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}

const check = async () => {
    const {data} = await authHost.get('api/user/auth' )
    localStorage.setItem('token', data.token)
    return jwt_decode(data.token)
}


export {
    host,
    createEntry,
    getRandomOne,
    registration,
    login,
    check
}
