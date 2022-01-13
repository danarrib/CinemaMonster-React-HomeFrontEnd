import axios from 'axios';

const HomeAPI = axios.create({
    baseURL: process.env.REACT_APP_HOME_BACKEND_URL,
    timeout: 5000,
});

export default HomeAPI;