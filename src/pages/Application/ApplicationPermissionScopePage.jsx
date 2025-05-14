import React from "react";
import { useEffect, useState } from "react";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import applicationApi from "../../api/application-api";
import Modal from "../../component/Modal";
import { useAuth } from "../../component/AuthContext";
import ApplicationPermissions from "./ApplicationPermissions";
import apiApi from "../../api/api-api";
import Apis from "../Api/Apis";
import ApiPermissions from "../Api/ApiPermissions";

function ApplicationPermissionScopePage({ application: appState }) {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const {
    application: appAuth,
    isLoading,
    setIsLoading,
    company,
    domain,
  } = useAuth();
  const application = appState ? appState : appAuth;
  const [scopes, setScopes] = useState([]);
  const [excludeScopes, setExcludeScopes] = useState([]);

  const [apis, setApis] = useState([]);
  const [currentApi, setCurrentApi] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);
  const [checkedItems, setCheckedItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    scopes.length > 0 ? scopes.slice(indexOfFirstPost, indexOfLastPost) : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

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

    //setApiScopes(allScopes.data);
    setExcludeScopes(nonExistScopes);
    return allScopes.data;
  };

  const onClickAddScope = async function () {
    setModalOpen(true);
  };

  const onCloseScopeModal = async function () {
    setModalOpen(false);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickDel = async function (e) {
    setIsLoading(true);
    await applicationApi.removePermission(application.id, e.id);
    await getAppScopes();
    setIsLoading(false);
  };

  const onClickDelMulti = async function () {
    setIsLoading(true);
    await applicationApi.removePermission(application.id, checkedItems);
    await getAppScopes();
    setIsLoading(false);
  };

  const getAppScopes = async () => {
    if (!application || !application.id) return;

    const items = await applicationApi.getPermissions(application.id);
    setScopes(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
  };

  const onClickAdd = async function () {
    setIsLoading(true);
    await applicationApi.createPermission(
      application.id,
      checkedItems.map((item) => {
        return { ...item, id: `${currentApi.id}#${item.id}` };
      })
    );
    setCheckedItems([]);
    await getAppScopes();
    await getApiPermissions(currentApi);
    setIsLoading(false);
    setModalOpen(false);
  };

  useEffect(() => {
    setIsLoading(true);
    getAppScopes();
    getApis();
    setIsLoading(false);
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between">
        <div className="space-y-4 ml-10">
          <label
            htmlFor="description"
            className="text-pretty ms-2 text-sm font-medium min-w-48 max-w-48 "
          ></label>
          <br />
          <Toolbox
            NewButtonLabel="Add"
            onClickNew={onClickAddScope}
            onClickDel={onClickDelMulti}
            parentCallback={handleCallback}
            disabledDel={checkedItems.length < 1}
          />
        </div>
      </header>
      <div className="w-full p-3">
        {/* scopes */}
        <ApplicationPermissions
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
          customClassName="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm "
        >
          <div className="flex flex-wrap">
            <div className="flex-1 min-w-[300px] flex flex-col w-1/3 p-4">
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
            <div className="flex-1 min-w-[300px] flex flex-col w-2/3 p-4">
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

export default ApplicationPermissionScopePage;
