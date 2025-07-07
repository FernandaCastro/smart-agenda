import api from './api';

export const translateTextToTask = async (text: string) => {
    const res = await api.post('/tasks/analyse', { text });
    return res.data;
};