import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Users from "../User/Users";
import userApi from "../../api/user-api";
import ButtonToolbox from "../../component/ButtonToolbox";

function ApiRoleUsers({
  status,
  showTool,
  excludes,
  parentCallback,
  noDetailView,
  selectedItems,
}) {
  const navigate = useNavigate();
  const pageDisplayCount = 4;
  const postDisplayCount = 10;
  const { company, domain } = useAuth();
  const [users, setUsers] = useState([]);
  const [checkedItems, setCheckedItems] = useState(
    selectedItems ? selectedItems : []
  );

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);

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

  const getUsers = async () => {
    try {
      const condition =
        status === "active"
          ? ["status", "!=", "deleted"]
          : ["status", "==", status];
      const dom = await userApi.getWhere(company.id, domain.id, condition);
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
    } catch (error) {
      if (error.status === 401) navigate("/");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getUsers();
    setIsLoading(false);
  }, [excludes]);

  const delSvg = (
    <svg
      className="w-4 h-4 mr-2"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
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

  return (
    <div className="h-full col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-slate-100 dark:border-slate-700 relative inline-flex"></header>
      <div className="h-screen flex flex-col">
        {/* users */}
        <div className="flex-1">
          <Users
            users={currentPosts}
            parentCallback={handleCallback}
            loading={isLoading}
            noDetailView={noDetailView}
            selectedItems={checkedItems}
          />
        </div>
        <div className="pb-40">
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
    </div>
  );
}

export default ApiRoleUsers;
