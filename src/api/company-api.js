import { httpClient } from "./httpClient";
import { uniDirServer } from "./igw-api";

const url = `${uniDirServer.Endpoint}/companys`;

const get = async (id) => {
  return await httpClient.get(`${url}/${id}`);
};

const create = async (data) => {
  return await httpClient.post(`${url}`, data);
};

const update = async (data) => {
  return await httpClient.put(`${url}/${data.id}`, data);
};

const remove = async (data) => {
  if (typeof data === "string")
    return await httpClient.delete(`${url}/${data}`);
  else return await httpClient.delete(`${url}`, { data: data });
};

async function getTenants(id) {
  return await httpClient.get(`${url}/${id}/childCompanys`);
}

const companyApi = {
  get,
  create,
  update,
  remove,
  getTenants,
};
export default companyApi;
