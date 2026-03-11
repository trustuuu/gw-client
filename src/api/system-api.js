import { uniOAuthServer } from "./igw-api";
import { httpClient } from "./httpClient";

const url = `${uniOAuthServer.Endpoint}`;
const systemUrl = `${uniOAuthServer.Endpoint}/systems`;
const apisUrl = (companyId, domainId) =>
  domainId
    ? `${url}/${companyId}/${domainId}/systems`
    : companyId
      ? `${url}/${companyId}/systems`
      : `${url}/systems`;

const getSystemApis = async () => {
  return await httpClient.get(`${systemUrl}?filter=type eq "api"`);
};

const getUsersAndGroups = async (companyId, domainId, apiId) => {
  return await httpClient.get(
    `${apisUrl(companyId, domainId)}/${apiId}/UsersAndGroups`,
  );
};

const createUsersAndGroups = async (companyId, domainId, apiId, data) => {
  return await httpClient.post(
    `${apisUrl(companyId, domainId)}/${apiId}/UsersAndGroups`,
    data,
  );
};

const updateUsersAndGroups = async (companyId, domainId, apiId, data) => {
  return await httpClient.put(
    `${apisUrl(companyId, domainId)}/${apiId}/UsersAndGroups/${data.id}`,
    data,
  );
};

const removeUsersAndGroups = async (companyId, domainId, apiId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${apisUrl(companyId, domainId)}/${apiId}/UsersAndGroups/${data}`,
      );
    else
      return await httpClient.delete(
        `${apisUrl(companyId, domainId)}/${apiId}/UsersAndGroups`,
        {
          data: data,
        },
      );
  } catch (error) {
    console.log(error);
  }
};

const systemApi = {
  getSystemApis,
  getUsersAndGroups,
  createUsersAndGroups,
  updateUsersAndGroups,
  removeUsersAndGroups,
};
export default systemApi;
