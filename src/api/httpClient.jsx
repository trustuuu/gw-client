import axios from 'axios';

const httpClient = axios.create();

const setHttpClient = (header) => {
    httpClient.defaults.headers = header;
}

export {httpClient, setHttpClient};