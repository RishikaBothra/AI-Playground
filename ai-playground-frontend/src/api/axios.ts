import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    });

api.interceptors.request.use((config) =>{
    const token = localStorage.getItem('authToken');
    if(token&& config.headers){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;