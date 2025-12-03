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

const getWhere = async (condition) => {
  return await httpClient.get(`${applicationsUrl()}`, {
    params: { condition: condition },
  });
};

const create = async (data) => {
  return await httpClient.post(`${applicationsUrl()}`, data);
};

const update = async (data) => {
  if (typeof data === "string")
    return await httpClient.put(`${applicationsUrl()}/${data.id}`, data);
  else return await httpClient.put(`${applicationsUrl()}`, data);
};

const remove = async (data) => {
  if (typeof data === "string") {
    return await httpClient.delete(`${applicationsUrl()}/${data}`);
  } else {
    return await httpClient.delete(`${applicationsUrl()}`, { data: data });
  }
};

const getPermissions = async (appId) => {
  return await getSubProps(appId, "PermissionScopes");
};
const createPermission = async (appId, data) => {
  return await createSubProps(appId, "PermissionScopes", data);
};
const updatePermission = async (appId, data) => {
  return await updateSubProps(appId, "PermissionScopes", data);
};
const removePermission = async (appId, data) => {
  return await removeSubProps(appId, "PermissionScopes", data);
};

const getTokenExchanges = async (appId) => {
  return await getSubProps(appId, "TokenExchanges");
};
const createTokenExchange = async (appId, data) => {
  return await createSubProps(appId, "TokenExchanges", data);
};
const updateTokenExchange = async (appId, data) => {
  return await updateSubProps(appId, "TokenExchanges", data);
};
const removeTokenExchange = async (appId, data) => {
  return await removeSubProps(appId, "TokenExchanges", data);
};

const getSubProps = async (appId, propName) => {
  return await httpClient.get(`${applicationsUrl()}/${appId}/${propName}`);
};

const createSubProps = async (appId, propName, data) => {
  return await httpClient.post(
    `${applicationsUrl()}/${appId}/${propName}`,
    data
  );
};
const updateSubProps = async (appId, propName, data) => {
  return await httpClient.put(
    `${applicationsUrl()}/${appId}/${propName}/${data.id}`,
    data
  );
};
const removeSubProps = async (appId, propName, data) => {
  try {
    if (typeof data === "string") {
      return await httpClient.delete(
        `${applicationsUrl()}/${appId}/${propName}/${encodeURIComponent(data)}`
      );
    } else
      return await httpClient.delete(
        `${applicationsUrl()}/${appId}/${propName}`,
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
  getTokenExchanges,
  createTokenExchange,
  updateTokenExchange,
  removeTokenExchange,
};
export default applicationApi;
