import { httpClient } from "./httpClient";
import { uniDirServer } from "./igw-api";

const url = `${uniDirServer.Endpoint}/companys`;

const get = async (companyId, id) => {
  if (id) {
    return await httpClient.get(`${url}/${companyId}/domainNames/${id}`);
  } else return await httpClient.get(`${url}/${companyId}/domainNames`);
};

const create = async (companyId, data) => {
  return await httpClient.post(`${url}/${companyId}/domainNames`, data);
};

const update = async (companyId, data) => {
  return await httpClient.put(
    `${url}/${companyId}/domainNames/${data.id}`,
    data
  );
};

const setPrimary = async (companyId, primaryId) => {
  const domains = await get(companyId, null);
  const newDomains = domains.data.map((domain) => {
    return { ...domain, primary: domain.id === primaryId ? true : false };
  });
  return await httpClient.put(`${url}/${companyId}/domainNames`, newDomains);
};

const remove = async (companyId, data) => {
  if (typeof data === "string")
    return await httpClient.delete(`${url}/${companyId}/domainNames/${data}`);
  else
    return await httpClient.delete(`${url}/${companyId}/domainNames`, {
      data: data,
    });
};

const getPrimary = async (companyId) => {
  return await httpClient.get(`${url}/${companyId}/domainNames/primary`);
};

const domainApi = {
  get,
  create,
  update,
  remove,
  setPrimary,
  getPrimary,
};
export default domainApi;
