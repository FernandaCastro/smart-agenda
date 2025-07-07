import api from './api';

export const translateTextToTask = async (text: string) => {
    try {
        const res = await api.post('/tasks/analyse', { text });
        return res.data;
    } catch (error: any) {
        console.log(error.response?.status);
        console.log(error.response?.statusText);

        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText
        };
    };
}