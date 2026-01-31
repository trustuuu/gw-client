import React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import GroupMember from "./GroupMember";
import groupApi from "../../api/group-api";
import UserPage from "../User/UserPage";
import GroupPage from "./GroupPage";
import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import Modal from "../../component/Modal";
import { useAuth } from "../../component/AuthContext";

const GroupMemberPage = React.memo(
  ({ company, domain, group, refreshGroup }) => {
    //const location = useLocation();
    const { setIsLoading } = useAuth();
    //const { company, domain, group } = location.state;

    const pageDisplayCount = 10;
    const postDisplayCount = 15;

    const [members, setMembers] = useState([]);
    const [checkedItems, setCheckedItems] = useState([]);
    const [userCheckedItems, setUserCheckedItems] = useState([]);
    const [groupCheckedItems, setGroupCheckedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageStart, setPageStart] = useState(1);
    const [pageEnd, setPageEnd] = useState(pageDisplayCount);
    const [postsPerPage] = useState(postDisplayCount);

    const [modalOpen, setModalOpen] = useState(false);
    const [visibleTab, setVisibleTab] = useState(0);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;

    const currentPosts = useMemo(
      () =>
        members.length > 0
          ? members.slice(indexOfFirstPost, indexOfLastPost)
          : [],
      [members],
    );
    const paginate = (pageNumber, startPage, endPage) => {
      setCurrentPage(pageNumber);
      setPageStart(startPage);
      setPageEnd(endPage);
    };
    //const focusInputRef = useRef(null);
    useEffect(() => {
      setMembers(group.members ?? []);
    }, [group]);
    const handleCallback = useCallback((childCheckedItems) => {
      setCheckedItems(childCheckedItems);
    }, []);

    const userHandleCallback = useCallback((userCheckedItems) => {
      setUserCheckedItems(userCheckedItems);
    }, []);

    const groupHandleCallback = useCallback((groupCheckedItems) => {
      setGroupCheckedItems(groupCheckedItems);
    }, []);

    const onClickAdd = useCallback(async function () {
      setModalOpen(true);
      // await groupApi.addMembers(company.id, domain.id, group.id, {...member, id:member.permission});
      // setMember({permission:'', description:''});
      // await getGroupMembers();
    }, []);

    const onCloseMemberModal = useCallback(async function () {
      setModalOpen(false);
    }, []);

    const onAddMemberClick = useCallback(
      async function () {
        setIsLoading(true);
        let newMembers = userCheckedItems.map((u) => {
          return { id: u.id, displayName: u.displayName, type: "user" };
        });
        newMembers = [
          ...members,
          ...newMembers,
          ...groupCheckedItems.map((g) => {
            return { id: g.id, displayName: g.displayName, type: "group" };
          }),
        ];

        await groupApi.addMembers(company.id, domain.id, group.id, newMembers);
        //setMembers(addedMembers.data.members);
        await getGroupMembers();
        setIsLoading(false);
        setModalOpen(false);
      },
      [userCheckedItems, groupCheckedItems],
    );

    const onClickDel = useCallback(
      async function () {
        setIsLoading(true);
        await groupApi.removeMembers(
          company.id,
          domain.id,
          group.id,
          checkedItems,
        );
        await getGroupMembers();
        setIsLoading(false);
      },
      [checkedItems],
    );

    // const getGroupMembers = async () => {
    //   setMembers(group.members);
    //   setPageEnd(
    //     Math.ceil(group.members.length / postsPerPage) < pageDisplayCount
    //       ? Math.ceil(group.members.length / postsPerPage)
    //       : pageDisplayCount
    //   );
    // };

    const getGroupMembers = async () => {
      refreshGroup(group.id);
    };

    useEffect(() => {
      setIsLoading(true);
      getGroupMembers();
      setIsLoading(false);
    }, []);

    const data = [
      {
        title: "Users",
        content: (
          <UserPage
            key="allUsers"
            status="active"
            excludes={members.filter((m) => m.type === "user")}
            parentCallback={userHandleCallback}
            noDetailView={true}
          />
        ),
      },
      {
        title: "Groups",
        content: (
          <GroupPage
            key="allGroups"
            status="active"
            excludes={[
              ...members.filter((m) => m.type === "group"),
              {
                value: group.id,
                $ref: `${company.id}/domains/${domain.id}/groups/${group.id}`,
                type: "group",
              },
            ]}
            parentCallback={groupHandleCallback}
            noDetailView={true}
          />
        ),
        closeButton: false,
      },
    ];

    return (
      <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm border border-slate-200 ">
        <header className="w-full px-5 py-4 border-b border-slate-100 relative inline-flex items-center justify-between">
          <Toolbox
            NewButtonLabel="Add"
            onClickNew={onClickAdd}
            onClickDel={onClickDel}
            parentCallback={handleCallback}
            disabledDel={checkedItems.length < 1}
          />
        </header>
        <div className="w-full p-3 ">
          {/* members */}
          <GroupMember
            members={currentPosts}
            parentCallback={handleCallback}
            onClickDel={onClickDel}
          />
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={members.length}
            paginate={paginate}
            currentPage={currentPage}
            pageDisplayCount={
              Math.ceil(members.length / postsPerPage) < pageDisplayCount
                ? Math.ceil(members.length / postsPerPage)
                : pageDisplayCount
            }
            pageStart={pageStart}
            pageEnd={pageEnd}
          />
        </div>
        <div className="flex items-center justify-center">
          <Modal
            hasCloseBtn={true}
            isOpen={modalOpen}
            onClose={onCloseMemberModal}
            optionBtnLabel="Add"
            onOptionBtnClick={onAddMemberClick}
          >
            <div className="mx-auto">
              <TabHeader
                data={data}
                buttonclassName="rounded-full"
                buttonPosision="justify-center"
                visibleTab={visibleTab}
                setVisibleTab={setVisibleTab}
              />
              <TabBody data={data} visibleTab={visibleTab} />
            </div>
          </Modal>
        </div>
      </div>
    );
  },
);

export default GroupMemberPage;
