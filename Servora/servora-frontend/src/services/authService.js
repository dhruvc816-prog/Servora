import api from "./api";

//Login

export const login = async (email, password) => {
    const response = await api.post('api/auth/login', { email, password });
    return response;
}

//Register

export const register = (data) =>
    api.post('/api/auth/register', data);
