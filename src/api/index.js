import axios from "axios";

const $api = axios.create({
    withCredentials: true,
    baseURL: `http://localhost:3000/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

$api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.authorization = `Bearer ${token}`;
    } else {
        delete config.headers.authorization;
    }
    return config;
});

export default $api;