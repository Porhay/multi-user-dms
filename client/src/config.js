
// export const baseURL = process.env.NODE_ENV === 'production' ? process.env.EXTERNAL_SERVER_URL : 'http://localhost:8000'
// export const baseURL = 'https://dms-server-2k3z.onrender.com'
export const baseURL = 'http://localhost:8000'
export const timeout = 1000 * 60 * 5 // 5m

console.log(process.env.NODE_ENV);
console.log(process.env.EXTERNAL_SERVER_URL);
console.log(process.env.REACT_APP_EXTERNAL_SERVER_URL);
