import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import DomainPage from "../Domain/DomainPage";
import ApiPost from "./ApiPost";
import ApiPermissionScopePage from "./ApiPermissionScopePage";
import ApiAppRolePage from "./ApiAppRolePage";
import { useAuth } from "../../component/AuthContext";
import ApiOverview from "./ApiOverview";
import ApiUsersGroupsPage from "./ApiUsersGroupsPage";

function ApiView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { api: apiState } = location.state ? location.state : {};
  const { api: apiAuth } = useAuth();
  const api = apiState ? apiState : apiAuth;
  if (!api) navigate("/apis");

  const data = [
    {
      title: "Quick Start",
      content: <ApiOverview mode="view" api={api} />,
      closeButton: false,
    },
    {
      title: "Settings",
      content: <ApiPost mode="overview" api={api} />,
    },
    {
      title: "Permission",
      content: <ApiPermissionScopePage mode="overview" api={api} />,
      closeButton: false,
    },
    {
      title: "App Roles",
      content: <ApiAppRolePage mode="overview" api={api} />,
      closeButton: false,
    },
    {
      title: "Users and Group",

      content: <ApiUsersGroupsPage key="apiAppUsersGroups" mode="overview" />,
      closeButton: false,
    },
  ];

  const [visibleTab, setVisibleTab] = useState(0);

  return (
    <div className="w-full">
      <TabHeader
        data={data}
        visibleTab={visibleTab}
        setVisibleTab={setVisibleTab}
      />
      <TabBody data={data} visibleTab={visibleTab} />
    </div>
  );
}

export default ApiView;
