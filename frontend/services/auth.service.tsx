import { PublicUser, User } from '@/models/userModel.js';
import api from './api';


export const loginUser = async (user: User) => {
    try {

        const res = await api.post(`/auth/login`, JSON.stringify({ "user": user }));
        return res.data;

    } catch (error: any) {
        console.error('Login error:', error);
        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText,
            details: error.response?.data.details
        };
    };
};

export const signupUser = async (user: User) : Promise<PublicUser> => {

    try {
        const res = await api.post(`/auth/signup`, JSON.stringify({ "user": user }));
        return res.data;

    } catch (error: any) {
        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText,
            details: error.response?.data.details
        };
    };
};

export async function getSession() : Promise<PublicUser> {
    const res = await api.get('/auth/session');
    return res.data.publicUser;
}

export async function logoutUser(user: User) {

    try {
        const response = await api.post(`/auth/logout`, JSON.stringify({"user": user}));
        console.log("User logged out successfully");
    
    } catch (error: any) {
        console.error("Logout error:", error);
        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText,
            details: error.response?.data.details
        }
    }

}
