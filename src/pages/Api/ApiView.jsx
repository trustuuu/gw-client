import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import DomainPage from "../Domain/DomainPage";
import ApiPost from "./ApiPost";
import ApiPermissionScopePage from "./ApiPermissionScopePage";
import ApiAppRolePage from "./ApiAppRolePage";
import { useAuth } from "../../component/AuthContext";

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
      content: `ReactJS is an open-source JavaScript library used to create 
                    user interfaces in a declarative and efficient way. 
                    It is a component-based front-end library responsible only
                    for the view layer of a Model View Controller(MVC) architecture. 
                    Before you start learning ReactJS, we assume that you have knowledge of 
                    HTML, CSS and JavaScript.`,
      closeButton: true,
    },
    {
      title: "Settings",
      content: <ApiPost mode="view" api={api} />,
    },
    {
      title: "Permission",
      content: <ApiPermissionScopePage mode="edit" api={api} />,
      closeButton: true,
    },
    {
      title: "App Roles",
      content: <ApiAppRolePage mode="edit" api={api} />,
      closeButton: true,
    },
    {
      title: "Domain",
      content: <DomainPage />,
      closeButton: true,
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
