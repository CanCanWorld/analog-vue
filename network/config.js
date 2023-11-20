// http method
import axios from "axios";

export const METHOD = {
    GET: 'get',
    POST: 'post'
}

export const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 20000
})
