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

const getAppRoles = async (apiId) => {
  return await httpClient.get(`${apisUrl()}/${apiId}/AppRoles`);
};

const getUsersAndGroups = async (apiId) => {
  return await httpClient.get(`${apisUrl()}/${apiId}/UsersAndGroups`);
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

const createAppRole = async (apiId, data) => {
  return await httpClient.post(`${apisUrl()}/${apiId}/AppRoles`, data);
};

const createUsersAndGroups = async (apiId, data) => {
  return await httpClient.post(`${apisUrl()}/${apiId}/UsersAndGroups`, data);
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

const updateAppRole = async (apiId, data) => {
  return await httpClient.put(
    `${apisUrl()}/${apiId}/AppRoles/${data.id}`,
    data
  );
};

const updateUsersAndGroups = async (apiId, data) => {
  return await httpClient.put(
    `${apisUrl()}/${apiId}/UsersAndGroups/${data.id}`,
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

const removePermission = async (apiId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${apisUrl()}/${apiId}/PermissionScopes/${data}`
      );
    else
      return await httpClient.delete(`${apisUrl()}/${apiId}/PermissionScopes`, {
        data: data,
      });
  } catch (error) {
    console.log(error);
  }
};

const removeAppRole = async (apiId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(`${apisUrl()}/${apiId}/AppRoles/${data}`);
    else
      return await httpClient.delete(`${apisUrl()}/${apiId}/AppRoles`, {
        data: data,
      });
  } catch (error) {
    console.log(error);
  }
};

const removeUsersAndGroups = async (apiId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${apisUrl()}/${apiId}/UsersAndGroups/${data}`
      );
    else
      return await httpClient.delete(`${apisUrl()}/${apiId}/UsersAndGroups`, {
        data: data,
      });
  } catch (error) {
    console.log(error);
  }
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
  getAppRoles,
  createAppRole,
  updateAppRole,
  removeAppRole,
  getUsersAndGroups,
  createUsersAndGroups,
  updateUsersAndGroups,
  removeUsersAndGroups,
};
export default apiApi;
