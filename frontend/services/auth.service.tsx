import { User } from '@/models/userMOdel';
import api from './api';


export const loginUser = async (user: User) => {
    try {

        const res = await api.post(`/auth/login`, JSON.stringify({ "user": user }) );
        return res.data;

    } catch (error: any) {
        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText,
            details: error.response?.data.details
        };
    };
};

export const signupUser = async (user: User) => {
    
    try {
        const res = await api.post(`/auth/signup`,  JSON.stringify({ "user": user }) );
        return res.data;
    
    } catch (error: any) {
        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText,
            details: error.response?.data.details
        };
    };
};
