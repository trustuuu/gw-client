import axios from 'axios';

const url = 'api/register';

const api = {
    get,
    getByEvent,
    register,
    cancel,
    checkRegister,
    update
};
export default api;

function get(id){
    return axios.get(`${url}/${id}`);
}

function getByEvent(event){
    return axios.get(`${url}/event/${event}`);
}

function register(data){
    return axios.post(url, data);
}

function cancel(id){
    return axios.delete(id);
}

function checkRegister(data){
    return axios.post(`${url}/checkRegister`, data);
}

function update(data){
    return axios.put(url, data);
}