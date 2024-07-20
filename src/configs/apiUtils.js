import { handleShowApiError } from '@/features/error/getErrorApi';
import { getAuthHeader } from '@/helpers/Header';
import axios from 'axios';



const baseURL = 'https://tgc67.online/api'
const authHeader = getAuthHeader();
const api = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(config => {
    if (typeof window !== 'undefined') {
        let api_key1 = sessionStorage.getItem('api_key');
        let api_secret1 = sessionStorage.getItem('api_secret');
        if (!api_key1 || !api_secret1) {
            return null;
        }
        config.headers['Authorization'] = `token ${api_key1}:${api_secret1}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

const handleApiError = error => {
    handleShowApiError(error)
    if (error.response) {
        console.error('API Error:', error.response?.status, error.response.data);
        if (error.response.data && error.response.data.error) {
            return error.response.data.error;
        }
        return 'API Error';
    } else if (error.request) {
        console.error('Network Error:', error.request);
        return 'Network Error';
    } else {
        console.error('Error:', error.message);
        return error.message;
    }
};


const get = async (endpoint, params = {}) => {
    try {
        const response = await api.get(endpoint, { params });
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


const post = async (endpoint, data = {}) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


const put = async (endpoint, data = {}) => {
    try {
        const response = await api.put(endpoint, data);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


const patch = async (endpoint, data = {}) => {
    try {
        const response = await api.patch(endpoint, data);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


const del = async (endpoint) => {
    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};


export { get, post, put, patch, del };