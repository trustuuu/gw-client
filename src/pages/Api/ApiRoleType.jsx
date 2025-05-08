import React from "react";
import { useEffect, useState } from "react";
import Pagination from "../../component/Pagination";
import ApiAppRoles from "./ApiAppRoles";
import apiApi from "../../api/api-api";
import { useAuth } from "../../component/AuthContext";

function ApiRoleType({ mode, api: apiState, parentCallback }) {
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const { api: apiAuth } = useAuth();
  const api = apiState ? apiState : apiAuth;

  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState({
    displayName: "",
    description: "",
    value: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    roles.length > 0 ? roles.slice(indexOfFirstPost, indexOfLastPost) : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const getApiroles = async () => {
    if (!api || !api.id) return;

    const items = await apiApi.getAppRoles(api.id);
    setRoles(items.data);
    setPageEnd(
      Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
        ? Math.ceil(items.data.length / postsPerPage)
        : pageDisplayCount
    );
  };

  const handleCallback = (role) => {
    parentCallback(role);
    setRole(role);
  };

  useEffect(() => {
    setIsLoading(true);
    getApiroles();
    setIsLoading(false);
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between"></header>
      <div className="h-screen flex flex-col">
        <div className="flex-1">
          {/* roles */}
          <ApiAppRoles
            roles={currentPosts}
            parentCallback={handleCallback}
            loading={isLoading}
            signleMode={true}
          />
        </div>
        <div className="pb-40">
          <Pagination
            postsPerPage={postsPerPage}
            totalPosts={roles.length}
            paginate={paginate}
            currentPage={currentPage}
            pageDisplayCount={
              Math.ceil(roles.length / postsPerPage) < pageDisplayCount
                ? Math.ceil(roles.length / postsPerPage)
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

export default ApiRoleType;
