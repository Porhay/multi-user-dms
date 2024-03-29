// https://dms-server-2k3z.onrender.com
export const baseURL =
  process.env.REACT_APP_NODE_ENV === 'production'
    ? process.env.REACT_APP_EXTERNAL_SERVER_URL
    : 'http://localhost:8000';
export const timeout = 1000 * 60 * 5; // 5m
