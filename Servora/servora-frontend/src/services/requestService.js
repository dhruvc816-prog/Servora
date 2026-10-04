import api from "./api";

export const createRequest = (data) =>
    api.post('/api/requests', data);

export const getAllRequests = () =>
    api.get('/api/requests');

export const getRequestsById = (id) =>
    api.get(`/api/requests/${id}`);

export const assignTechnician = (id, technicianUserId) =>
    api.put(`/api/requests/${id}/assign`, { technicianUserId });

export const updateStatus = (id, status) =>
    api.put(`/api/requests/${id}/status`, { status });

export const cancelRequest = (id) =>
    api.put(`/api/requests/${id}/cancel`);

export const getSummary = (id) =>
    api.get(`/api/requests/${id}/summary`);

export const getMyJobs = () =>
    api.get('/api/requests/my');

export const getRequestById = (id) =>
    api.get(`/api/requests/${id}`);
