import { httpClient } from "./httpClient";
import { authServer, uniDirServer } from "./igw-api";

const url = `${uniDirServer.Endpoint}/companys`;
const userUrl = (companyId, domainId) =>
  `${url}/${companyId}/domainNames/${domainId}/users`;

const get = async (companyId, domainId, id) => {
  if (id) {
    return await httpClient.get(`${userUrl(companyId, domainId)}/${id}`);
  } else return await httpClient.get(`${userUrl(companyId, domainId)}`);
};

const getWhere = async (companyId, domainId, condition) => {
  return await httpClient.get(`${userUrl(companyId, domainId)}`, {
    params: { condition: condition },
  });
};

const create = async (companyId, domainId, data) => {
  return await httpClient.post(`${userUrl(companyId, domainId)}`, data);
};

const update = async (companyId, domainId, data) => {
  if (Array.isArray(data))
    return await httpClient.put(`${userUrl(companyId, domainId)}`, data);
  else
    return await httpClient.put(
      `${userUrl(companyId, domainId)}/${data.id}`,
      data
    );
};

const resetPassword = async (companyId, domainId, data) => {
  return await httpClient.put(
    `${userUrl(companyId, domainId)}/${data.email}/resetPassword`,
    data
  );
};

const verifyUser = async (companyId, domainId, email, data) => {
  return await httpClient.post(
    `${userUrl(companyId, domainId)}/${email}`,
    data
  );
};

const remove = async (companyId, domainId, data) => {
  if (typeof data === "string") {
    return await httpClient.delete(`${userUrl(companyId, domainId)}/${data}`);
  } else {
    return await httpClient.delete(`${userUrl(companyId, domainId)}`, {
      data: data,
    });
  }
};

const getPermissionScopes = async (companyId, domainId, id) => {
  return await httpClient.get(
    `${userUrl(companyId, domainId)}/${id}/PermissionScopes`
  );
};

const addPermissionScopes = async (companyId, domainId, id, data) => {
  return await httpClient.post(
    `${userUrl(companyId, domainId)}/${id}/PermissionScopes`,
    data
  );
};

const removePermissionScopes = async (companyId, domainId, id, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${userUrl(companyId, domainId)}/${id}/PermissionScopes/${data}`
      );
    else
      return await httpClient.delete(
        `${userUrl(companyId, domainId)}/${id}/PermissionScopes`,
        {
          data: data,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

const getExternalIdentityAccounts = async (companyId, domainId, userId) => {
  return await httpClient.get(
    `${userUrl(companyId, domainId)}/${userId}/ExternalIdentityAccounts`
  );
};

const getExternalIdentityAccount = async (
  companyId,
  domainId,
  userId,
  accountId
) => {
  return await httpClient.get(
    `${userUrl(
      companyId,
      domainId
    )}/${userId}/ExternalIdentityAccounts/${accountId}`
  );
};

const addExternalIdentityAccount = async (
  companyId,
  domainId,
  userId,
  data
) => {
  return await httpClient.post(
    `${userUrl(companyId, domainId)}/${userId}/ExternalIdentityAccounts`,
    data
  );
};

const updateExternalIdentityAccount = async (
  companyId,
  domainId,
  userId,
  data
) => {
  return await httpClient.put(
    `${userUrl(companyId, domainId)}/${userId}/ExternalIdentityAccounts/${
      data.id
    }`,
    data
  );
};

const retrieveExternalIdentityAccountToken = async (
  companyId,
  domainId,
  userId,
  data
) => {
  return await httpClient.post(
    `${userUrl(companyId, domainId)}/${userId}/ExternalIdentityAccounts/${
      data.id
    }`,
    data
  );
};

const retrieveExternalIdentityAccountNewToken = async (data) => {
  return await httpClient.post(authServer.tokenEndpoint, data);
};

const removeExternalIdentityAccounts = async (
  companyId,
  domainId,
  userId,
  data
) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${userUrl(
          companyId,
          domainId
        )}/${userId}/ExternalIdentityAccounts/${data}`
      );
    else
      return await httpClient.delete(
        `${userUrl(companyId, domainId)}/${userId}/ExternalIdentityAccounts`,
        {
          data: data,
        }
      );
  } catch (error) {
    console.log(error);
  }
};

const userApi = {
  get,
  getWhere,
  create,
  update,
  remove,
  getPermissionScopes,
  addPermissionScopes,
  removePermissionScopes,
  getExternalIdentityAccounts,
  getExternalIdentityAccount,
  addExternalIdentityAccount,
  updateExternalIdentityAccount,
  retrieveExternalIdentityAccountToken,
  retrieveExternalIdentityAccountNewToken,
  removeExternalIdentityAccounts,
  verifyUser,
  resetPassword,
};
export default userApi;
