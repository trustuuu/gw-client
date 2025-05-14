import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import ApplicationPost from "./ApplicationPost";
import { useAuth } from "../../component/AuthContext";

function ApplicationView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { application: applicationState } = location.state
    ? location.state
    : {};
  const { application: applicationAuth } = useAuth();
  const application = applicationState ? applicationState : applicationAuth;

  if (!application) navigate("/application");
  const data = [
    {
      title: "Quick Start",
      content: `ReactJS is an open-source JavaScript library used to create 
                    user interfaces in a declarative and efficient way. 
                    It is a component-based front-end library responsible only
                    for the view layer of a Model View Controller(MVC) architecture. 
                    Before you start learning ReactJS, we assume that you have knowledge of 
                    HTML, CSS and JavaScript.`,
    },
    {
      title: "Settings",
      content: <ApplicationPost mode="view" application={application} />,
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

export default ApplicationView;
