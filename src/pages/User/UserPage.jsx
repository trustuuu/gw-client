import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Users from "./Users";
import userApi from "../../api/user-api";
import ButtonToolbox from "../../component/ButtonToolbox";

function UserPage({
  status,
  showTool,
  excludes,
  parentCallback,
  noDetailView,
}) {
  const history = useHistory();
  const pageDisplayCount = 4;
  const postDisplayCount = 3;
  const { accessToken, company, domain, header } = useAuth();
  const [users, setUsers] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [delBtnLabel, setDelBtnLabel] = useState(
    status === "active" ? "Delete" : "Recover"
  );

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = users.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
    if (parentCallback !== undefined) {
      parentCallback(childCheckedItems);
    }
  };

  const onClickNew = function (e) {
    history.push("/users-new", {
      company: company,
      domain: domain,
      mode: "new",
      header: header,
    });
  };

  const onClickDel = async function (e) {
    await userApi.update(
      company.id,
      domain.id,
      checkedItems.map((item) => {
        return { ...item, status: status === "active" ? "deleted" : "active" };
      }),
      header
    );
    setCheckedItems([]);
    await getUsers();
  };

  const onClickPurge = async function (e) {
    await userApi.remove(company.id, domain.id, checkedItems, header);
    setCheckedItems([]);
    await getUsers();
  };

  const onClickView = (item) => {
    history.push("/users-new", {
      company: company,
      domain: domain,
      user: item,
      mode: "view",
      header: header,
    });
  };

  const onClickEdit = (item) => {
    history.push("/users-new", {
      company: company,
      domain: domain,
      user: item,
      mode: "edit",
      header: header,
    });
  };

  const getUsers = async () => {
    if (accessToken) {
      const condition =
        status === "active"
          ? ["status", "!=", "deleted"]
          : ["status", "==", status];
      const dom = await userApi.getWhere(
        company.id,
        domain.id,
        condition,
        header
      );
      let data = dom.data;
      if (excludes) {
        data = data.filter(
          (item) => !excludes.map((e) => e.id).includes(item.id)
        );
      }
      setUsers(data);
      setPageEnd(
        Math.ceil(dom.data.length / postsPerPage) < pageDisplayCount
          ? Math.ceil(dom.data.length / postsPerPage)
          : pageDisplayCount
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUsers();
    setDelBtnLabel(status === "active" ? "Delete" : "Recover");
    setIsLoading(false);
  }, [excludes]);

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

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-slate-100 dark:border-slate-700 relative inline-flex">
        {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">Manage Domain</h2> */}
        {showTool && (
          <>
            <Toolbox
              onClickNew={onClickNew}
              onClickDel={onClickDel}
              DelButtonLabel={delBtnLabel}
              visibleNew={status === "active"}
              disabledDel={checkedItems.length < 1}
            />
            {status === "active" ? (
              <></>
            ) : (
              <ButtonToolbox
                text="Purge"
                svg={delSvg}
                clickHandle={onClickPurge}
                disabled={checkedItems.length < 1}
                customClass={purgeClass}
              />
            )}
          </>
        )}
      </header>
      <div className="p-3">
        {/* users */}
        <Users
          users={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
          noDetailView={noDetailView}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={users.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(users.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(users.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>
    </div>
  );
}

export default UserPage;
