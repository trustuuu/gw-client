import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import GroupPost from "./GroupPost";
import GroupMemberPage from "./GroupMemberPage";
import groupApi from "../../api/group-api";

function GroupView() {
  const location = useLocation();

  const { company, domain, group, mode } = location.state;
  const refreshGroup = async (id) => {
    const newGroup = await groupApi.get(company.id, domain.id, id);
    SetCurrentGroup(newGroup.data);
  };
  const [currentGroup, SetCurrentGroup] = useState(group);
  let data = [
    {
      title: "General",
      content: (
        <GroupPost
          mode={mode}
          company={company}
          domain={domain}
          group={currentGroup}
        />
      ),
    },
  ];

  if (mode != "new") {
    data = [
      ...data,
      {
        title: "Members",
        content: (
          <GroupMemberPage
            mode={mode}
            company={company}
            domain={domain}
            group={currentGroup}
            refreshGroup={refreshGroup}
          />
        ),
        closeButton: true,
      },
    ];
  }
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

export default GroupView;
