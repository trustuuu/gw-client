import { uniDirServer, uniOAuthServer } from "./igw-api";
import { httpClient } from "./httpClient";

const url = `${uniOAuthServer.Endpoint}`;
const applicationsUrl = (companyId, domainId) =>
  domainId
    ? `${url}/${companyId}/${domainId}/application`
    : companyId
    ? `${url}/${companyId}/application`
    : `${url}/application`;

const get = async (companyId, domainId, id, condition) => {
  if (id) {
    return await httpClient.get(`${applicationsUrl()}/application/${id}`);
  } else if (domainId) {
    return await httpClient.get(`${applicationsUrl(companyId, domainId)}`, {
      params: { condition: condition ? condition : null },
    });
  } else if (companyId)
    return await httpClient.get(`${applicationsUrl(companyId, null)}`, {
      params: { condition: condition ? condition : null },
    });
  else
    return await httpClient.get(`${applicationsUrl()}`, {
      params: { condition: condition ? condition : null },
    });
};

const getPermissions = async (appId) => {
  return await httpClient.get(`${applicationsUrl()}/${appId}/PermissionScopes`);
};

const getWhere = async (condition) => {
  return await httpClient.get(`${applicationsUrl()}`, {
    params: { condition: condition },
  });
};

const create = async (data) => {
  return await httpClient.post(`${applicationsUrl()}`, data);
};

const createPermission = async (appId, data) => {
  return await httpClient.post(
    `${applicationsUrl()}/${appId}/PermissionScopes`,
    data
  );
};

const update = async (data) => {
  if (typeof data === "string")
    return await httpClient.put(`${applicationsUrl()}/${data.id}`, data);
  else return await httpClient.put(`${applicationsUrl()}`, data);
};

const updatePermission = async (appId, data) => {
  return await httpClient.put(
    `${applicationsUrl()}/${appId}/PermissionScopes/${data.id}`,
    data
  );
};

const remove = async (data) => {
  if (typeof data === "string") {
    return await httpClient.delete(`${applicationsUrl()}/${data}`);
  } else {
    return await httpClient.delete(`${applicationsUrl()}`, { data: data });
  }
};

const removePermission = async (appId, data) => {
  try {
    if (typeof data === "string") {
      console.log(
        "data delete",
        data,
        `${applicationsUrl()}/${appId}/PermissionScopes/${encodeURIComponent(
          data
        )}`
      );
      return await httpClient.delete(
        `${applicationsUrl()}/${appId}/PermissionScopes/${encodeURIComponent(
          data
        )}`
      );
    } else
      return await httpClient.delete(
        `${applicationsUrl()}/${appId}/PermissionScopes`,
        {
          data: data,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

const purgeCors = async (companyId, domainId, id) => {
  const data = { client_id: id };
  return await httpClient.post(
    `${uniDirServer.Endpoint}/companys/${companyId}/domainNames/${domainId}/purge/cors`,
    data
  );
};

const applicationApi = {
  get,
  getWhere,
  create,
  update,
  remove,
  purgeCors,
  getPermissions,
  createPermission,
  updatePermission,
  removePermission,
};
export default applicationApi;
