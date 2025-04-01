import axios from 'axios';

const url = 'api/account';

const api = {
    get,
};
export default api;

function get(email){
    return axios.get(`${url}/${email}`);
}
