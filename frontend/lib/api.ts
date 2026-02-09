import axios from 'axios';
import { getSession } from 'next-auth/react';

const createApiClient = (baseURL: string) => {
    const api = axios.create({ baseURL });

    api.interceptors.request.use(async (config) => {
        const session = await getSession();
        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }
        return config;
    });

    return api;
};

export const bookService = createApiClient('http://localhost:8082');
export const orderService = createApiClient('http://localhost:8083');
export const userService = createApiClient('http://localhost:8081');
export const productService = createApiClient('http://localhost:8085');

