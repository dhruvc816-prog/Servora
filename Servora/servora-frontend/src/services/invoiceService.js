import api from "./api";

export const createInvoice = (requestId, amount) =>
    api.post(`/api/invoices/${requestId}`, { amount });

export const markPaid = (id) =>
    api.put(`/api/invoices/${id}/pay`);

export const markUnpaid = (id) =>
    api.put(`/api/invoices/${id}/unpaid`);

export const getAll = () =>
    api.get(`/api/invoices`);

export const getById = (id) =>
    api.get(`/api/invoices/${id}`);

export const getByRequestId = (requestId) =>
    api.get(`/api/invoices/request/${requestId}`);

export const getAllInvoices = () =>
    api.get(`/api/invoices`);