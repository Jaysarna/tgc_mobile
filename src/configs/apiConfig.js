// const axios = require('axios');
// const env = require('src/configs/api');
import { getAuthHeader } from '@/helpers/Header';
import axios from 'axios';
// import env from 'src/config/api'

// const baseURL = env.baseUrl;


const baseURL = 'https://tgc67.online/api/method'
const authHeader = getAuthHeader();
export const api = axios.create({
    baseURL,
    timeout: 10000,
    authHeader,
});


