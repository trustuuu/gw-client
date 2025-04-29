import { useState } from "react";
import { useLocation } from "react-router-dom";

import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import UserPost from "./UserPost";
import UserPermissionScopePage from "./UserPermissionScopePage";

function UserView() {
  const location = useLocation();

  const { company, domain, user, mode } = location.state;

  const data = [
    {
      title: "General",
      content: (
        <UserPost mode={mode} company={company} domain={domain} user={user} />
      ),
    },
    {
      title: "Permission Scope",
      content: (
        <UserPermissionScopePage
          mode={mode}
          company={company}
          domain={domain}
          user={user}
        />
      ),
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

export default UserView;
