import React from "react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import UserPermissionScopes from "./UserPermissionScopes";
import userApi from "../../api/user-api";
import Modal from "../../component/Modal";
import apiApi from "../../api/api-api";
import ApiPermissions from "../Api/ApiPermissions";
import Apis from "../Api/Apis";

function UserPermissionScopePage() {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);

  const location = useLocation();

  const { company, domain, user } = location.state;

  const [scopes, setScopes] = useState([]);

  const [apiScopes, setApiScopes] = useState([]);
  const [excludeScopes, setExcludeScopes] = useState([]);
  const [apis, setApis] = useState([]);
  const [currentApi, setCurrentApi] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    scopes.length > 0 ? scopes.slice(indexOfFirstPost, indexOfLastPost) : [];

  const getApis = async () => {
    const allApis = await apiApi.get(company.id, domain.id, null, null);
    setApis(allApis.data);
  };
  const getApiPermissions = async (api) => {
    setCurrentApi(api);
    const allScopes = await apiApi.getPermissions(api.id);
    const nonExistScopes = allScopes.data.filter(
      (item) => !scopes.map((e) => e.id).includes(`${api.id}#${item.id}`)
    );

    setApiScopes(allScopes.data);
    setExcludeScopes(nonExistScopes);
    return allScopes.data;
  };

  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };
  const onClickAddScope = async function () {
    setModalOpen(true);
  };
  const onClickDel = async function () {
    await userApi.removePermissionScopes(
      company.id,
      domain.id,
      user.id,
      checkedItems
    );
    setCheckedItems([]);
    await getUserScopes();
  };
  const onClickAdd = async function () {
    await userApi.addPermissionScopes(
      company.id,
      domain.id,
      user.id,
      checkedItems.map((item) => {
        return { ...item, id: `${currentApi.id}#${item.id}` };
      })
    );
    setCheckedItems([]);
    await getUserScopes();
    await getApiPermissions(currentApi);
    setModalOpen(false);
  };
  const onCloseScopeModal = async function () {
    setModalOpen(false);
  };
  const getUserScopes = async () => {
    const items = await userApi.getPermissionScopes(
      company.id,
      domain.id,
      user.id
    );
    setScopes(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getUserScopes();
    getApis();
    setIsLoading(false);
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
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
            parentCallback={handleCallback}
            disabledDel={checkedItems.length < 1}
          />
        </div>
      </header>
      <div className="w-full p-3">
        {/* scopes */}
        <UserPermissionScopes
          scopes={currentPosts}
          parentCallback={handleCallback}
          loading={isLoading}
          onClickDel={onClickDel}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={scopes.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(scopes.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(scopes.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <Modal
          hasCloseBtn={true}
          isOpen={modalOpen}
          onClose={onCloseScopeModal}
          optionBtnLabel="Add"
          onOptionBtnClick={onClickAdd}
          customClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm "
        >
          <div className="flex flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col w-1/3  bg-blue-800 p-4">
              <div>
                <Apis
                  apis={apis}
                  loading={isLoading}
                  onClickView={getApiPermissions}
                  customClass={"my-1 h-[200px] overflow-y-auto"}
                />
              </div>
              <div className="mt-auto">
                <Pagination
                  postsPerPage={postsPerPage}
                  totalPosts={scopes.length}
                  paginate={paginate}
                  currentPage={currentPage}
                  pageDisplayCount={
                    Math.ceil(scopes.length / postsPerPage) < pageDisplayCount
                      ? Math.ceil(scopes.length / postsPerPage)
                      : pageDisplayCount
                  }
                  pageStart={pageStart}
                  pageEnd={pageEnd}
                />
              </div>
            </div>
            <div className="flex-1 min-w-[300px] flex flex-col w-2/3 bg-green-800 p-4">
              <div>
                <ApiPermissions
                  scopes={excludeScopes}
                  parentCallback={handleCallback}
                  loading={isLoading}
                  //   onClickDel={onClickDel}
                  customClass={"my-1 h-[200px] overflow-y-auto"}
                />
              </div>
              <div className="mt-auto">
                <Pagination
                  postsPerPage={postsPerPage}
                  totalPosts={scopes.length}
                  paginate={paginate}
                  currentPage={currentPage}
                  pageDisplayCount={
                    Math.ceil(scopes.length / postsPerPage) < pageDisplayCount
                      ? Math.ceil(scopes.length / postsPerPage)
                      : pageDisplayCount
                  }
                  pageStart={pageStart}
                  pageEnd={pageEnd}
                />
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default UserPermissionScopePage;
