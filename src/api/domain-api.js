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

const getConnections = async (companyId, domainId) => {
  return await httpClient.get(
    `${url}/${companyId}/domainNames/${domainId}/Connections`
  );
};

const addConnection = async (companyId, domainId, data) => {
  return await httpClient.post(
    `${url}/${companyId}/domainNames/${domainId}/Connections`,
    data
  );
};

const updateConnection = async (companyId, domainId, data) => {
  return await httpClient.put(
    `${url}/${companyId}/domainNames/${domainId}/Connections/${data.id}`,
    data
  );
};

// const retrieveConnection = async (companyId, domainId, connectionId) => {
//   return await httpClient.get(
//     `${url}/${companyId}/domainNames/${domainId}/Connections/${connectionId}`
//   );
// };

const removeConnections = async (companyId, domainId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${url}/${companyId}/domainNames/${domainId}/Connections/${data}`
      );
    else
      return await httpClient.delete(
        `${url}/${companyId}/domainNames/${domainId}/Connections`,
        {
          data: data,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

const domainApi = {
  get,
  create,
  update,
  remove,
  setPrimary,
  getPrimary,
  getConnections,
  addConnection,
  updateConnection,
  //retrieveConnection,
  removeConnections,
};
export default domainApi;
