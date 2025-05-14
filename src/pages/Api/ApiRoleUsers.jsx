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
  excludes,
  parentCallback,
  noDetailView,
  selectedItems,
}) {
  const navigate = useNavigate();
  const pageDisplayCount = 4;
  const postDisplayCount = 10;
  const { company, domain, setIsLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [checkedItems, setCheckedItems] = useState(
    selectedItems ? selectedItems : []
  );

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

  return (
    <div className="h-full col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="px-5 py-4 brelative inline-flex"></header>
      <div className="h-screen flex flex-col">
        {/* users */}
        <div className="flex-1">
          <Users
            users={currentPosts}
            parentCallback={handleCallback}
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
