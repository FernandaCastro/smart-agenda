import api from './api';

export const analyse = async (text: string) => {

    try {
        const res = await api.post('/ai/analyse', JSON.stringify({ "text": text }));
        return res.data;

    } catch (error: any) {
        console.log(error.response?.status);
        console.log(error.response?.statusText);
        console.log(error.response?.details);

        throw {
            statusCode: error.response?.status,
            message: error.response?.statusText,
            details: error.response?.data.details
        };
    };
}