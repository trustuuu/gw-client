import { uniDirServer } from "./igw-api";
import { httpClient } from "./httpClient";

const url = `${uniDirServer.Endpoint}/companys`;
const groupUrl = (companyId, domainId) =>
  `${url}/${companyId}/domainNames/${domainId}/groups`;
const memberUrl = (companyId, domainId, groupId) =>
  `${url}/${companyId}/domainNames/${domainId}/groups/${groupId}/members`;

const get = async (companyId, domainId, id) => {
  try {
    if (id) {
      return await httpClient.get(`${groupUrl(companyId, domainId)}/${id}`);
    } else return await httpClient.get(`${groupUrl(companyId, domainId)}`);
  } catch (error) {
    window.location.replace("/login");
  }
};

const getMembers = async (companyId, domainId, groupId) => {
  try {
    return await httpClient.get(`${memberUrl(companyId, domainId, groupId)}`);
  } catch (error) {
    window.location.replace("/login");
  }
};

const getWhere = async (companyId, domainId, condition) => {
  try {
    return await httpClient.get(`${groupUrl(companyId, domainId)}`, {
      params: { condition: condition },
    });
  } catch (error) {
    window.location.replace("/login");
  }
};

const create = async (companyId, domainId, data) => {
  try {
    return await httpClient.post(`${groupUrl(companyId, domainId)}`, data);
  } catch (error) {
    window.location.replace("/login");
  }
};

const addMembers = async (companyId, domainId, groupId, data) => {
  try {
    return await httpClient.post(
      `${memberUrl(companyId, domainId, groupId)}`,
      data
    );
  } catch (error) {
    window.location.replace("/login");
  }
};

const update = async (companyId, domainId, data) => {
  try {
    if (Array.isArray(data))
      return await httpClient.put(`${groupUrl(companyId, domainId)}`, data);
    else
      return await httpClient.put(
        `${groupUrl(companyId, domainId)}/${data.id}`,
        data
      );
  } catch (error) {
    window.location.replace("/login");
  }
};

const remove = async (companyId, domainId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${groupUrl(companyId, domainId)}/${data}`
      );
    else
      return await httpClient.delete(`${groupUrl(companyId, domainId)}`, {
        data: data,
      });
  } catch (error) {
    window.location.replace("/login");
  }
};

const removeMembers = async (companyId, domainId, groupId, data) => {
  try {
    if (typeof data === "string")
      return await httpClient.delete(
        `${memberUrl(companyId, domainId, groupId)}/${data}`
      );
    else
      return await httpClient.delete(
        `${memberUrl(companyId, domainId, groupId)}`,
        { data: data }
      );
  } catch (error) {
    window.location.replace("/login");
  }
};

const groupApi = {
  get,
  getWhere,
  create,
  update,
  remove,
  getMembers,
  addMembers,
  removeMembers,
};
export default groupApi;
