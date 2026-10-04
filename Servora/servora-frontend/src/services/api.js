import axios from "axios";

//Axios Instance- base url set krne ke liye

const api = axios.create({
    baseURL: 'http://localhost:8080/',

});

//Interceptors- request bhejte time token attach krne ke liye
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;