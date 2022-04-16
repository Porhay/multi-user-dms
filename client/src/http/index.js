import axios from 'axios'

// TODO fix export
const host = axios.create({
    // TODO Take local network ip from server side and replace with baseURL
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


export {
    host,
    createEntry,
    getRandomOne
}
