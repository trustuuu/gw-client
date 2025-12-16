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

/*
  [downstream google-calendar-api]
  curl -X POST "http://172.30.48.1/oauth/v1/token" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InZPbGxpMUhaV2dfaHh2cGwwVnlKeiJ9.eyJpc3MiOiJodHRwOi8vb2F1dGgudW5pZGlyLmlnb29kd29ya3MuY29tLyIsInN1YiI6ImphbWVzLmNoYW5nIiwiYXVkIjoiaHR0cDovL3VuaWRpci5hcGkuaWdvb2R3b3Jrcy5jb20vIiwiaWF0IjoxNzY1MzE3Nzg0LCJleHAiOjE3NjU0MDQxODQsImp0aSI6ImNHV29sTEVsIiwicGVybWlzc2lvbnMiOlsiY29tcGFueTphZG1pbiIsImNvbXBhbnk6ZGVsZXRlIiwiY29tcGFueTpyZWFkIiwiY29tcGFueTp3cml0ZSIsImVtYWlsIiwiZW1haWxfdmVyaWZpZWQiLCJncm91cDpyZWFkIiwib3BlbklkIiwicHJvZmlsZSIsInVzZXI6YWRtaW4iLCJ1c2VyOnJlYWQiLCJ1c2VybmFtZSJdLCJyb2xlcyI6WyJPcHM6QWRtaW4iLCJPcHM6U3VwcG9ydCJdLCJ0ZW5hbnRfaWQiOiJpZ29vZHdvcmtzIiwiY2xpZW50X2lkIjoic2llOEwyVm45Z1ZpWm1DQ2RSWXV3NzJiNEo5M201a0kiLCJjb21wYW55SWQiOiJpZ29vZHdvcmtzIiwiZG9tYWluSWQiOiJpZ29vZHdvcmtzLmNvbSIsInRva2VuX3VzZSI6ImFjY2VzcyJ9.L1_aBG18q1oSVXAectMHv6Di5iA5uvswECL-EyR7uBfx22NxiRa-nuAxzqcPItcnsK8MrDkTQvK1F_c3VhojEKKoAl6RSkzeRm-08JCY4qimMLaTxvalSEtZ7jSkhUvjUKgwwIKyltcIpeXNOBoP-PdTzycVrhJ1fYvrpdY0lRZJ7DrU2Tpf3mxie_TyGSa_5wE6GuzcP5Jk4TnEez5eki5E-qgud6aIK9A0gaNbtRjrfCo98MbbgNEhwloLsQKPKHmc73Pt7npy3VRyqBlptvDLmovndwpgkZrOMNlRWCWNKcqKwF61lN65ykT5JhtUXNxT2YdsfrB88tSFcoHWLA" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "audience=https://www.googleapis.com/calendar/v3" \
  -d "scope=https://www.googleapis.com/auth/calendar.readonly" \
  -d "subject_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InZPbGxpMUhaV2dfaHh2cGwwVnlKeiJ9.eyJpc3MiOiJodHRwOi8vb2F1dGgudW5pZGlyLmlnb29kd29ya3MuY29tLyIsInN1YiI6ImphbWVzLmNoYW5nIiwiYXVkIjoiaHR0cDovL3VuaWRpci5hcGkuaWdvb2R3b3Jrcy5jb20vIiwiaWF0IjoxNzY1MzE3Nzg0LCJleHAiOjE3NjU0MDQxODQsImp0aSI6ImNHV29sTEVsIiwicGVybWlzc2lvbnMiOlsiY29tcGFueTphZG1pbiIsImNvbXBhbnk6ZGVsZXRlIiwiY29tcGFueTpyZWFkIiwiY29tcGFueTp3cml0ZSIsImVtYWlsIiwiZW1haWxfdmVyaWZpZWQiLCJncm91cDpyZWFkIiwib3BlbklkIiwicHJvZmlsZSIsInVzZXI6YWRtaW4iLCJ1c2VyOnJlYWQiLCJ1c2VybmFtZSJdLCJyb2xlcyI6WyJPcHM6QWRtaW4iLCJPcHM6U3VwcG9ydCJdLCJ0ZW5hbnRfaWQiOiJpZ29vZHdvcmtzIiwiY2xpZW50X2lkIjoic2llOEwyVm45Z1ZpWm1DQ2RSWXV3NzJiNEo5M201a0kiLCJjb21wYW55SWQiOiJpZ29vZHdvcmtzIiwiZG9tYWluSWQiOiJpZ29vZHdvcmtzLmNvbSIsInRva2VuX3VzZSI6ImFjY2VzcyJ9.L1_aBG18q1oSVXAectMHv6Di5iA5uvswECL-EyR7uBfx22NxiRa-nuAxzqcPItcnsK8MrDkTQvK1F_c3VhojEKKoAl6RSkzeRm-08JCY4qimMLaTxvalSEtZ7jSkhUvjUKgwwIKyltcIpeXNOBoP-PdTzycVrhJ1fYvrpdY0lRZJ7DrU2Tpf3mxie_TyGSa_5wE6GuzcP5Jk4TnEez5eki5E-qgud6aIK9A0gaNbtRjrfCo98MbbgNEhwloLsQKPKHmc73Pt7npy3VRyqBlptvDLmovndwpgkZrOMNlRWCWNKcqKwF61lN65ykT5JhtUXNxT2YdsfrB88tSFcoHWLA" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:access_token" \

  [google-native-token]
  curl -X POST "http://172.30.48.1/oauth/v1/token" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InZPbGxpMUhaV2dfaHh2cGwwVnlKeiJ9.eyJpc3MiOiJodHRwOi8vb2F1dGgudW5pZGlyLmlnb29kd29ya3MuY29tLyIsInN1YiI6ImphbWVzLmNoYW5nIiwiYXVkIjoiaHR0cDovL3VuaWRpci5hcGkuaWdvb2R3b3Jrcy5jb20vIiwiaWF0IjoxNzY1NTczNzU5LCJleHAiOjE3NjU2NjAxNTksImp0aSI6ImdiUHF2U1RzIiwicGVybWlzc2lvbnMiOlsiY29tcGFueTphZG1pbiIsImNvbXBhbnk6ZGVsZXRlIiwiY29tcGFueTpyZWFkIiwiY29tcGFueTp3cml0ZSIsImVtYWlsIiwiZW1haWxfdmVyaWZpZWQiLCJncm91cDpyZWFkIiwib3BlbklkIiwicHJvZmlsZSIsInVzZXI6YWRtaW4iLCJ1c2VyOnJlYWQiLCJ1c2VybmFtZSJdLCJyb2xlcyI6WyJPcHM6QWRtaW4iLCJPcHM6U3VwcG9ydCJdLCJ0ZW5hbnRfaWQiOiJpZ29vZHdvcmtzIiwiY2xpZW50X2lkIjoic2llOEwyVm45Z1ZpWm1DQ2RSWXV3NzJiNEo5M201a0kiLCJjb21wYW55SWQiOiJpZ29vZHdvcmtzIiwiZG9tYWluSWQiOiJpZ29vZHdvcmtzLmNvbSIsInRva2VuX3VzZSI6ImFjY2VzcyJ9.OMdtwrODodw5E1OM83xJwB-ODj5PSaJq-UALxHyR3uMe4Vpxq1ThhdYURJsUanKenJTu2ZF5K7wwbO_uMVwwzq1IvF93cK407WGRcYHQVp53JPumwR1OekQUWL9HSITn3Ig2pP_1k7i-dIrjaUlDv3LHMTzILzO88ICsz65X3DlsHqUMFjlP4XtyIHzJvF_J0kg6LNipCCLPHfGFnfod5_1ceSUz0DIPOaNnxQHEfu_CrBZtgUTDDdBGYUxtLLmSP80Glpi48EeWKNpBWIpm3DqpQ6gAJqYwaoFAZE_ejnZQWcthe0fv0ZQIJy1m8RIcDTqspKiXuehVzB6lHdzFbQ" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=urn:ietf:params:oauth:grant-type:token-exchange" \
  -d "subject_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6InZPbGxpMUhaV2dfaHh2cGwwVnlKeiJ9.eyJpc3MiOiJodHRwOi8vb2F1dGgudW5pZGlyLmlnb29kd29ya3MuY29tLyIsInN1YiI6ImphbWVzLmNoYW5nIiwiYXVkIjoiaHR0cDovL3VuaWRpci5hcGkuaWdvb2R3b3Jrcy5jb20vIiwiaWF0IjoxNzY1NTczNzU5LCJleHAiOjE3NjU2NjAxNTksImp0aSI6ImdiUHF2U1RzIiwicGVybWlzc2lvbnMiOlsiY29tcGFueTphZG1pbiIsImNvbXBhbnk6ZGVsZXRlIiwiY29tcGFueTpyZWFkIiwiY29tcGFueTp3cml0ZSIsImVtYWlsIiwiZW1haWxfdmVyaWZpZWQiLCJncm91cDpyZWFkIiwib3BlbklkIiwicHJvZmlsZSIsInVzZXI6YWRtaW4iLCJ1c2VyOnJlYWQiLCJ1c2VybmFtZSJdLCJyb2xlcyI6WyJPcHM6QWRtaW4iLCJPcHM6U3VwcG9ydCJdLCJ0ZW5hbnRfaWQiOiJpZ29vZHdvcmtzIiwiY2xpZW50X2lkIjoic2llOEwyVm45Z1ZpWm1DQ2RSWXV3NzJiNEo5M201a0kiLCJjb21wYW55SWQiOiJpZ29vZHdvcmtzIiwiZG9tYWluSWQiOiJpZ29vZHdvcmtzLmNvbSIsInRva2VuX3VzZSI6ImFjY2VzcyJ9.OMdtwrODodw5E1OM83xJwB-ODj5PSaJq-UALxHyR3uMe4Vpxq1ThhdYURJsUanKenJTu2ZF5K7wwbO_uMVwwzq1IvF93cK407WGRcYHQVp53JPumwR1OekQUWL9HSITn3Ig2pP_1k7i-dIrjaUlDv3LHMTzILzO88ICsz65X3DlsHqUMFjlP4XtyIHzJvF_J0kg6LNipCCLPHfGFnfod5_1ceSUz0DIPOaNnxQHEfu_CrBZtgUTDDdBGYUxtLLmSP80Glpi48EeWKNpBWIpm3DqpQ6gAJqYwaoFAZE_ejnZQWcthe0fv0ZQIJy1m8RIcDTqspKiXuehVzB6lHdzFbQ" \
  -d "subject_token_type=urn:ietf:params:oauth:token-type:access_token" \
  -d "audience=google-native-token" \
  -d "scope=https://www.googleapis.com/auth/calendar.readonly"

  downstream audience
    audience=calendar-api
    audience=profile-api
    audience=billing-api 

*/
