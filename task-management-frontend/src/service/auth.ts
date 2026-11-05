import api from './api';

import { RegisterRequest, LoginRequest } from '../types/auth';

export const registerUser = async (formData: RegisterRequest) => {
    try {
        const response = await api.post('/auth/register', formData);
        return response.data;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
};

export const loginUser = async (formData: LoginRequest) => {
    try {
        const response = await api.post('/auth/login', formData);
        return response.data;
    } catch (error) {
        console.error('Error logging in user:', error);
        throw error;
    }
};