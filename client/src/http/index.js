import axios from "axios"

// TODO fix export
const host = axios.create({
    baseURL: 'http://localhost:3000',
    timeout: 1000,
    headers: {'X-Custom-Header': 'foobar'}
})

export {
    host
}
