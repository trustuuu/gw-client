import { httpClient } from "./httpClient";
import { authServer, uniDirServer } from "./igw-api";

const url = `${uniDirServer.Endpoint}/companys`;
const scimUrl = (companyId, domainId) =>
  `${url}/${companyId}/domainNames/${domainId}/scims`;

const get = async (companyId, domainId, id) => {
  if (id) {
    return await httpClient.get(`${scimUrl(companyId, domainId)}/${id}`);
  } else return await httpClient.get(`${scimUrl(companyId, domainId)}`);
};

const getWhere = async (companyId, domainId, condition) => {
  return await httpClient.get(`${scimUrl(companyId, domainId)}`, {
    params: { condition: condition },
  });
};

const create = async (companyId, domainId, data) => {
  return await httpClient.post(`${scimUrl(companyId, domainId)}`, data);
};

const update = async (companyId, domainId, data) => {
  if (Array.isArray(data))
    return await httpClient.put(`${scimUrl(companyId, domainId)}`, data);
  else
    return await httpClient.put(
      `${scimUrl(companyId, domainId)}/${data.id}`,
      data
    );
};

const remove = async (companyId, domainId, data) => {
  if (typeof data === "string") {
    return await httpClient.delete(`${scimUrl(companyId, domainId)}/${data}`);
  } else {
    return await httpClient.delete(`${scimUrl(companyId, domainId)}`, {
      data: data,
    });
  }
};

const scimApi = {
  get,
  getWhere,
  create,
  update,
  remove,
};
export default scimApi;
