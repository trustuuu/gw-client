import React from "react";
import { useEffect, useState } from "react";
import { apiPermissionScopesFields } from "../../constants/apiFields";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import ApiPermissions from "./ApiPermissions";
import apiApi from "../../api/api-api";
import ButtonToolbox from "../../component/ButtonToolbox";
import Modal from "../../component/Modal";
import ItemField from "../../component/ItemField";
import { generateString } from "../../utils/Utils";

const fields = apiPermissionScopesFields;
let fieldsState = {};

function ApiPermissionScopePage({ mode, api }) {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;

  const [scopeMode, setScopeMode] = useState(mode);
  const [scopes, setScopes] = useState([]);
  const [scope, setScope] = useState({ permission: "", description: "" });

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);
  const [checkedItems, setCheckedItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemState, setItemState] = useState(
    scopeMode === "new"
      ? {
          ...fieldsState,
          permission: "api:read",
        }
      : fieldsState
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    scopes.length > 0 ? scopes.slice(indexOfFirstPost, indexOfLastPost) : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const onClickAddScope = async function () {
    setScopeMode("new");
    setScope({ permission: "", description: "" });
    setItemState({ permission: "", description: "" });
    setModalOpen(true);
  };

  const onCloseScopeModal = async function () {
    setModalOpen(false);
  };

  const onClickNew = async function () {
    const surfix = generateString(5);
    await apiApi.createPermission(api.id, {
      ...itemState,
      id: `${itemState.permission}${surfix}`,
    });
    setScope({ permission: "", description: "" });
    setItemState({ permission: "", description: "" });
    await getApiScopes();
    setModalOpen(false);
  };

  const onClickEdit = async function (scope) {
    setScopeMode("edit");
    setScope(scope);
    setItemState(scope);
    setModalOpen(true);
  };

  const onClickApply = async function () {
    await apiApi.updatePermission(api.id, itemState);
    setScope({ permission: "", description: "" });
    setItemState({ permission: "", description: "" });
    await getApiScopes();
    setModalOpen(false);
  };

  const onClickDel = async function (e) {
    //const api = await apiApi.get(company.id, domain.id, checkedItems);
    await apiApi.removePermission(api.id, e.id);
    await getApiScopes();
  };

  const onClickDelMulti = async function (e) {
    await apiApi.removePermission(api.id, checkedItems);
    await getApiScopes();
  };

  const getApiScopes = async () => {
    const items = await apiApi.getPermissions(api.id);
    setScopes(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
  };

  const handleChange = (e) => {
    const currentItem = fields.filter((f) => f.id === e.target.id)[0];
    const itemValue =
      e.target.value === "true" || e.target.value === "false"
        ? e.target.checked
        : currentItem.valueType !== undefined &&
          currentItem.valueType === "array"
        ? e.target.value.split(/\r\n|\n|\r/)
        : e.target.value;

    setItemState({ ...itemState, [e.target.id]: itemValue });
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  useEffect(() => {
    setIsLoading(true);
    getApiScopes();
    setIsLoading(false);
  }, []);

  // const delSvg = (
  //   <svg
  //     className="w-4 h-4 mr-2"
  //     width="24"
  //     height="24"
  //     viewBox="0 0 24 24"
  //     strokeWidth="2"
  //     stroke="currentColor"
  //     fill="none"
  //     strokeLinecap="round"
  //     strokeLinejoin="round"
  //   >
  //     {" "}
  //     <path stroke="none" d="M0 0h24v24H0z" />{" "}
  //     <line x1="4" y1="7" x2="20" y2="7" />{" "}
  //     <line x1="10" y1="11" x2="10" y2="17" />{" "}
  //     <line x1="14" y1="11" x2="14" y2="17" />{" "}
  //     <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
  //     <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
  //   </svg>
  // );
  // const purgeClass =
  //   "w-30 ml-8 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  const primarySvg = (
    <svg
      className="fill-current h-4 w-4 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
  const primaryButtonClass =
    " w-30 h-10 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

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
            onClickDel={onClickDelMulti}
            parentCallback={handleCallback}
            disabledDel={checkedItems.length < 1}
          />
        </div>
      </header>
      <div className="w-full p-3">
        {/* scopes */}
        <ApiPermissions
          scopes={currentPosts}
          parentCallback={handleCallback}
          loading={isLoading}
          onClickDel={onClickDel}
          onClickEdit={onClickEdit}
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

      <div className="flex items-center justify-center">
        <Modal
          hasCloseBtn={true}
          isOpen={modalOpen}
          onClose={onCloseScopeModal}
          optionBtnLabel={scopeMode === "new" ? "Add" : "Apply"}
          onOptionBtnClick={scopeMode === "new" ? onClickNew : onClickApply}
        >
          <div className="space-y-4">
            {fields.map((field) =>
              (field.hiddenUpdate || field.hiddenUpdate !== undefined) &&
              scopeMode === "edit" ? (
                <></>
              ) : (
                <ItemField
                  key={field.name}
                  item={scope}
                  handleChange={handleChange}
                  value={
                    field.valueType === "array" && itemState[field.id]
                      ? itemState[field.id].join("\r\n")
                      : itemState[field.id]
                  }
                  field={field}
                  mode={scopeMode}
                />
              )
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
}

export default ApiPermissionScopePage;
