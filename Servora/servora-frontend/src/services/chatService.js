import api from './api';

export const sendMessage = (requestId, question) =>
    api.post('/api/chat/status', { requestId, question });

export const getStatus = (requestId) =>
    api.get(`/api/chat/status/${requestId}`);

