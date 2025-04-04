import axios from './axios.js';

export const loginRequest = user => axios.post(`/login`, user);

export const verifyToken = (token) => axios.get(`/auth/verify`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
});