import { useEffect } from "react";
import axios from "axios";
import { encodeClientCredentials } from "../utils/Utils";

const client = {
  client_id: "ashurstsie8L2Vn9gViZmCCdRYuw72b4J93m5kI",
  redirect_uris: ["http://unidir.igoodworks.com/callback"],
  //redirect_uris: ["http://localhost:3000/callback"],
};

export default function ServiceAccountCreationPage() {
  const tokenEndpoint =
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/oauth/v1/tokenService";
  const apiEndpoint =
    "https://gw-oauth-server-hcf3ceajdpg2gcbg.canadacentral-01.azurewebsites.net/api/companys";

  const form_data = {
    grant_type: "authorization_code_service",
    //code: code,
    redirect_uri: client.redirect_uris[0],
  };

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " +
      encodeClientCredentials(client.client_id, client.client_secret),
  };

  useEffect(() => {
    (async function () {
      const tokenJson = await axios.post(tokenEndpoint, form_data, {
        headers: headers,
      });

      const apiHeaders = {
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${tokenJson.data.access_token}`,
      };
      const companys = await axios.get(apiEndpoint, { headers: apiHeaders });
    })();
  });

  return <div></div>;
}
