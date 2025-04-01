import { httpClient } from './httpClient';
import {uniDirServer} from './igw-api';

const url = `${uniDirServer.Endpoint}/companys`;
const userUrl = (companyId, domainId) => `${url}/${companyId}/domainNames/${domainId}/users`;

const get = async (companyId, domainId, id) => {
    
    if (id){
        return await httpClient.get(`${userUrl(companyId, domainId)}/${id}`);
    }
    else
        return await httpClient.get(`${userUrl(companyId, domainId)}`);
}

const getWhere = async (companyId, domainId, condition) => {
    return await httpClient.get(`${userUrl(companyId, domainId)}`, {params: {condition:condition}});
}

const create = async (companyId, domainId, data) => {
    return await httpClient.post(`${userUrl(companyId, domainId)}`, data);
}

const update = async (companyId, domainId, data) => {

    if (Array.isArray(data))
        return await httpClient.put(`${userUrl(companyId, domainId)}`, data);
    else
        return await httpClient.put(`${userUrl(companyId, domainId)}/${data.id}`, data);
}

const remove = async (companyId, domainId, data) => {
    if (typeof data === 'string'){
        return await httpClient.delete(`${userUrl(companyId, domainId)}/${data}`);
    }
    else{
        return await httpClient.delete(`${userUrl(companyId, domainId)}`, {data: data});
    }
}

const userApi = {
    get,
    getWhere,
    create,
    update,
    remove,
};
export default userApi;
