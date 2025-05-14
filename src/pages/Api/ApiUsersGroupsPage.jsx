import React from "react";
import { useEffect, useState } from "react";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Modal from "../../component/Modal";
import apiApi from "../../api/api-api";
import { useAuth } from "../../component/AuthContext";
import ApiUsersGroups from "./ApiUsersGroups";
import ApiRoleUsers from "./ApiRoleUsers";
import ApiRoleGroups from "./ApiRoleGroups";
import ApiRoleType from "./ApiRoleType";

function ApiUsersGroupsPage({ api: apiState }) {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const { company, domain, api: apiAuth, setIsLoading } = useAuth();
  const api = apiState ? apiState : apiAuth;

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);

  const [menuItems, setMenuItems] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [userCheckedItems, setUserCheckedItems] = useState([]);
  const [groupCheckedItems, setGroupCheckedItems] = useState([]);

  const [apiUsersGroups, setApiUsersGroups] = useState([]);

  const [selectedType, setSelectedType] = useState("Users");
  const [selectedRole, setSelectedRole] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    apiUsersGroups.length > 0
      ? apiUsersGroups.slice(indexOfFirstPost, indexOfLastPost)
      : [];

  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const onSelectType = (item) => {
    setSelectedType(item.key);
  };
  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const userHandleCallback = (CheckedItems) => {
    setUserCheckedItems(CheckedItems);
  };

  const groupHandleCallback = (CheckedItems) => {
    setGroupCheckedItems(CheckedItems);
  };

  const roleTypeHandleCallback = (role) => {
    setSelectedRole(role.value);
  };

  const onClickAddScope = async function () {
    setModalOpen(true);
  };
  const onClickDel = async function () {
    setIsLoading(true);
    await apiApi.removeUsersAndGroups(api.id, checkedItems);
    setCheckedItems([]);
    await getApiUsersAngGroups();
    setIsLoading(false);
  };
  const onClickAdd = async function () {
    setIsLoading(true);
    const totalItems = [
      ...userCheckedItems.map((item) => {
        return {
          role: selectedRole,
          id: item.id,
          displayName: item.displayName,
          objectType: "user",
          objectId: item.id,
          ref: `/companys/${company.id}/domainNames/${domain.id}/users/${item.id}`,
        };
      }),
      ...groupCheckedItems.map((item) => {
        return {
          role: selectedRole,
          id: item.id,
          displayName: item.displayName,
          objectType: "group",
          objectId: item.id,
          ref: `/companys/${company.id}/domainNames/${domain.id}/groups/${item.id}`,
        };
      }),
    ];

    await apiApi.createUsersAndGroups(
      api.id,
      totalItems.map((item) => {
        return {
          ...item,
          id: `${item.objectType}#${item.role}#${item.id}`,
        };
      })
    );
    setUserCheckedItems([]);
    setGroupCheckedItems([]);
    setCheckedItems([]);
    await getApiUsersAngGroups();
    setIsLoading(false);
    setModalOpen(false);
  };
  const onCloseScopeModal = async function () {
    setModalOpen(false);
  };
  const getApiUsersAngGroups = async () => {
    const items = await apiApi.getUsersAndGroups(api.id);
    setApiUsersGroups(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getApiUsersAngGroups();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setMenuItems([
      {
        key: "Users",
        display: "Users",
        content:
          userCheckedItems.length > 0
            ? userCheckedItems.map((item) => {
                return (
                  <div key={item.id}>
                    {`${userCheckedItems.length} users selected`}
                    <div>{item.displayName}</div>
                  </div>
                );
              })
            : "None Selected",
      },
      {
        key: "Groups",
        display: "Groups",
        content:
          groupCheckedItems.length > 0
            ? groupCheckedItems.map((item) => {
                return (
                  <div>
                    {`${groupCheckedItems.length} groups selected`}
                    <div>{item.displayName}</div>
                  </div>
                );
              })
            : "None Selected",
      },
      {
        key: "Roles",
        display: "Select a role",
        content: selectedRole ? selectedRole : "None Selected",
      },
    ]);
  }, [userCheckedItems, groupCheckedItems, selectedRole]);

  return (
    <>
      <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
        <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between">
          <div className="space-y-4 ml-10">
            <label
              htmlFor="description"
              className="text-pretty ms-2 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-48 max-w-48 "
            ></label>
            <br />
            <Toolbox
              NewButtonLabel="Add"
              onClickNew={onClickAddScope}
              onClickDel={onClickDel}
              //parentCallback={handleCallback}
              disabledDel={checkedItems.length < 1}
              visibleNew={api ? api.RBAC : false}
            />
          </div>
        </header>
        <div className="w-full p-3">
          {/* roleUsersGroups */}
          <ApiUsersGroups
            apiUsersAndGroups={currentPosts}
            parentCallback={handleCallback}
            onClickDel={onClickDel}
            initCheckedItems={checkedItems}
          />
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={apiUsersGroups.length}
            paginate={paginate}
            currentPage={currentPage}
            pageDisplayCount={
              Math.ceil(apiUsersGroups.length / postsPerPage) < pageDisplayCount
                ? Math.ceil(apiUsersGroups.length / postsPerPage)
                : pageDisplayCount
            }
            pageStart={pageStart}
            pageEnd={pageEnd}
          />
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <Modal
          hasCloseBtn={true}
          isOpen={modalOpen}
          onClose={onCloseScopeModal}
          optionBtnLabel="Add"
          onOptionBtnClick={onClickAdd}
          customClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm "
          fullWidth="w-full h-full flex-1 "
        >
          <div className="grid grid-cols-4 h-11/12">
            <div className="col-span-1 bg-blue-300 p-2">
              {menuItems.map((item) => (
                <div
                  key={item.key}
                  onClick={() => onSelectType(item)}
                  className={`p-2 text-black rounded cursor-pointer ${
                    selectedType === item.key
                      ? "bg-blue-500 font-semibold"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {item.display}
                  <div className="ml-2 font-light text-gray-800">
                    {item.content}
                  </div>
                </div>
              ))}
            </div>
            {selectedType === "Users" ? (
              <div className="col-span-3 p-2">
                <ApiRoleUsers
                  key="allUsers"
                  status="active"
                  //excludes={members.filter((m) => m.type === "user")}
                  parentCallback={userHandleCallback}
                  noDetailView={true}
                  selectedItems={userCheckedItems}
                />
              </div>
            ) : null}
            {selectedType === "Groups" ? (
              <div className="col-span-3 p-2">
                <ApiRoleGroups
                  key="allGroups"
                  status="active"
                  //excludes={members.filter((m) => m.type === "user")}
                  parentCallback={groupHandleCallback}
                  noDetailView={true}
                  selectedItems={groupCheckedItems}
                />
              </div>
            ) : null}
            {selectedType === "Roles" ? (
              <div className="col-span-3 p-2">
                {/* roles */}
                <ApiRoleType
                  mode={currentPosts}
                  parentCallback={roleTypeHandleCallback}
                  api={api}
                  showTool={false}
                />
              </div>
            ) : null}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default ApiUsersGroupsPage;
