import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Pagination from "../../component/Pagination";
import Groups from "../Group/Groups";
import groupApi from "../../api/group-api";

function ApiRoleGroups({
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
  const [groups, setGroups] = useState([]);
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
  const currentPosts = groups.slice(indexOfFirstPost, indexOfLastPost);
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

  const getGroups = async () => {
    try {
      const condition =
        status === "active"
          ? ["status", "!=", "deleted"]
          : ["status", "==", status];
      const dom = await groupApi.getWhere(company.id, domain.id, condition);
      let data = dom.data;
      if (excludes) {
        data = data.filter(
          (item) => !excludes.map((e) => e.id).includes(item.id)
        );
      }
      setGroups(data);
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
    getGroups();
    setIsLoading(false);
  }, [excludes]);

  return (
    <div className="h-full col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-slate-100 dark:border-slate-700 relative inline-flex"></header>
      <div className="h-screen flex flex-col">
        {/* groups */}
        <div className="flex-1">
          <Groups
            groups={currentPosts}
            parentCallback={handleCallback}
            loading={isLoading}
            noDetailView={noDetailView}
            selectedItems={checkedItems}
          />
        </div>
        <div className="pb-40">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={groups.length}
            paginate={paginate}
            currentPage={currentPage}
            pageDisplayCount={
              Math.ceil(groups.length / postsPerPage) < pageDisplayCount
                ? Math.ceil(groups.length / postsPerPage)
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

export default ApiRoleGroups;
