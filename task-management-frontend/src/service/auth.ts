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

export const getEmployeeEmails = async (): Promise<string[]> => {
    try {
        const response = await api.get<string[]>('/auth/employees/emails');
        return response.data;
    } catch (error) {
        console.error('Error fetching employee emails:', error);
        throw error;
    }
};

export const getAllUsers = async () => {
    try {
        const response = await api.get('/auth/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};
