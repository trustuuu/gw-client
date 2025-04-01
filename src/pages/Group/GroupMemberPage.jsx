import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import GroupMember from "./GroupMember";
import groupApi from "../../api/group-api";
import UserPage from "../User/UserPage";
import GroupPage from "./GroupPage";
import TabHeader from "../../component/tabs/TabHeader";
import TabBody from "../../component/tabs/TabBody";
import Modal from "../../component/Modal";

function GroupMemberPage() {
  const location = useLocation();

  const { company, domain, group } = location.state;
  const pageDisplayCount = 10;
  const postDisplayCount = 15;

  const [members, setMembers] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [userCheckedItems, setUserCheckedItems] = useState([]);
  const [groupCheckedItems, setGroupCheckedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);

  const [modalOpen, setModalOpen] = useState(false);
  const [visibleTab, setVisibleTab] = useState(0);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    members.length > 0 ? members.slice(indexOfFirstPost, indexOfLastPost) : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };
  //const focusInputRef = useRef(null);

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const userHandleCallback = (userCheckedItems) => {
    setUserCheckedItems(userCheckedItems);
  };

  const groupHandleCallback = (groupCheckedItems) => {
    setGroupCheckedItems(groupCheckedItems);
  };

  const onClickAdd = async function (e) {
    setModalOpen(true);
    // await groupApi.addMembers(company.id, domain.id, group.id, {...member, id:member.permission});
    // setMember({permission:'', description:''});
    // await getGroupMembers();
  };

  const onCloseMemberModal = async function (e) {
    setModalOpen(false);
  };

  const onAddMemberClick = async function (e) {
    let newMembers = userCheckedItems.map((u) => {
      return { id: u.id, displayName: u.displayName, type: "user" };
    });
    newMembers = [
      ...newMembers,
      ...groupCheckedItems.map((g) => {
        return { id: g.id, displayName: g.displayName, type: "group" };
      }),
    ];

    await groupApi.addMembers(company.id, domain.id, group.id, newMembers);
    await getGroupMembers();
    setModalOpen(false);
  };

  const onClickDel = async function (e) {
    //const member = await apiApi.get(company.id, domain.id, checkedItems);
    await groupApi.removeMembers(company.id, domain.id, group.id, checkedItems);
    await getGroupMembers();
  };

  const getGroupMembers = async () => {
    const items = await groupApi.getMembers(company.id, domain.id, group.id);
    setMembers(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
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
            { id: group.id, displayName: group.displayName, type: "group" },
          ]}
          parentCallback={groupHandleCallback}
          noDetailView={true}
        />
      ),
      closeButton: false,
    },
  ];

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between">
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
          loading={isLoading}
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
      <>
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
              buttonClass="rounded-full"
              buttonPosision="justify-center"
              visibleTab={visibleTab}
              setVisibleTab={setVisibleTab}
            />
            <TabBody data={data} visibleTab={visibleTab} />
          </div>
        </Modal>
      </>
    </div>
  );
}

export default GroupMemberPage;
