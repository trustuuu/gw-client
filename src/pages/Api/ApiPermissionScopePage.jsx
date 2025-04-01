import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ItemField from "../../component/ItemField";
import { apiPermissionScopesFields } from "../../constants/formFields";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import ApiPermissions from "./ApiPermissions";
import apiApi from "../../api/api-api";
import ButtonToolbox from "../../component/ButtonToolbox";

const fields = apiPermissionScopesFields;

function ApiPermissionScopePage({ mode, api }) {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;

  const [scopes, setScopes] = useState([]);
  const [scope, setScope] = useState({ permission: "", description: "" });

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    scopes.length > 0 ? scopes.slice(indexOfFirstPost, indexOfLastPost) : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const onClickNew = async function (e) {
    await apiApi.createPermission(api.id, { ...scope, id: scope.permission });
    setScope({ permission: "", description: "" });
    await getApiScopes();
  };

  const onClickDel = async function (e) {
    //const api = await apiApi.get(company.id, domain.id, checkedItems);
    await apiApi.removePermission(api.id, e.id);
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

  useEffect(() => {
    setIsLoading(true);
    getApiScopes();
    setIsLoading(false);
  }, []);

  const delSvg = (
    <svg
      class="w-4 h-4 mr-2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {" "}
      <path stroke="none" d="M0 0h24v24H0z" />{" "}
      <line x1="4" y1="7" x2="20" y2="7" />{" "}
      <line x1="10" y1="11" x2="10" y2="17" />{" "}
      <line x1="14" y1="11" x2="14" y2="17" />{" "}
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />{" "}
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  );
  const purgeClass =
    "w-30 ml-8 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  const primarySvg = (
    <svg
      class="fill-current h-4 w-4 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
  const primaryButtonClass =
    " w-30 h-10 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between">
        {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">Manage Domain</h2> */}
        <div className="space-y-4">
          <label
            for="permission"
            className="text-pretty ms-2 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-48 max-w-48 "
          >
            Permission
          </label>
          <br />
          <input
            id="permission"
            value={scope.permission}
            className="text-gray-800"
            name="permission"
            required={true}
            placeholder="Permission"
            onChange={(evt) =>
              setScope({ ...scope, permission: evt.target.value })
            }
          />
        </div>
        <div className="space-y-4 ml-10">
          <label
            for="description"
            className="text-pretty ms-2 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-48 max-w-48 "
          >
            Description
          </label>
          <br />
          <input
            id="description"
            value={scope.description}
            className="text-gray-800"
            name="description"
            required={false}
            placeholder="description"
            onChange={(evt) =>
              setScope({ ...scope, description: evt.target.value })
            }
          />
        </div>
        <div className="space-y-4 ml-10">
          <label
            for="description"
            className="text-pretty ms-2 text-sm font-medium text-gray-900 dark:text-gray-100 min-w-48 max-w-48 "
          ></label>
          <br />
          <ButtonToolbox
            text="Add"
            svg={primarySvg}
            disabled={mode != "edit"}
            customClass={primaryButtonClass}
            clickHandle={onClickNew}
          />
        </div>
      </header>
      <div className="w-full p-3">
        {/* scopes */}
        <ApiPermissions
          scopes={currentPosts}
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
    </div>
  );
}

export default ApiPermissionScopePage;
