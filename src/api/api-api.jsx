import axios from "axios";
import { uniOAuthServer } from "./igw-api";
import { httpClient } from "./httpClient";

const url = `${uniOAuthServer.Endpoint}`;
const apisUrl = (companyId, domainId) =>
  domainId
    ? `${url}/${companyId}/${domainId}/api`
    : companyId
    ? `${url}/${companyId}/api`
    : `${url}/api`;

const get = async (companyId, domainId, id, condition) => {
  if (id) {
    return await httpClient.get(`${apisUrl()}/api/${id}`);
  } else if (domainId) {
    return await httpClient.get(`${apisUrl(companyId, domainId)}`, {
      params: { condition: condition ? condition : null },
    });
  } else if (companyId)
    return await httpClient.get(`${apisUrl(companyId, null)}`, {
      params: { condition: condition ? condition : null },
    });
  else
    return await httpClient.get(`${apisUrl()}`, {
      params: { condition: condition ? condition : null },
    });
};

const getPermissions = async (apiId) => {
  return await httpClient.get(`${apisUrl()}/${apiId}/PermissionScopes`);
};

const getWhere = async (condition) => {
  return await httpClient.get(`${apisUrl()}`, {
    params: { condition: condition },
  });
};

const create = async (data) => {
  return await httpClient.post(`${apisUrl()}`, data);
};

const createPermission = async (apiId, data) => {
  return await httpClient.post(`${apisUrl()}/${apiId}/PermissionScopes`, data);
};

const update = async (data) => {
  if (typeof data === "string")
    return await httpClient.put(`${apisUrl()}/${data.id}`, data);
  else return await httpClient.put(`${apisUrl()}`, data);
};

const updatePermission = async (apiId, data) => {
  return await httpClient.put(
    `${apisUrl()}/${apiId}/PermissionScopes/${data.id}`,
    data
  );
};

const remove = async (data) => {
  if (typeof data === "string") {
    return await httpClient.delete(`${apisUrl()}/${data}`);
  } else {
    return await httpClient.delete(`${apisUrl()}`, { data: data });
  }
};

const removePermission = async (apiId, permissionId) => {
  return await httpClient.delete(
    `${apisUrl()}/${apiId}/PermissionScopes/${permissionId}`
  );
};

const apiApi = {
  get,
  getWhere,
  create,
  update,
  remove,
  getPermissions,
  createPermission,
  updatePermission,
  removePermission,
};
export default apiApi;
