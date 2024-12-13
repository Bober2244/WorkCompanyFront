import axios from 'axios';

axios.interceptors.request.use(config => {
    // Извлекаем токен из localStorage
    const token = localStorage.getItem('jwt');

    // Если токен найден, добавляем его в заголовок Authorization
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default axios;
