import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Groups from "./Groups";
import groupApi from "../../api/group-api";
import ButtonToolbox from "../../component/ButtonToolbox";

const GroupPage = ({
  status,
  showTool,
  excludes,
  parentCallback,
  noDetailView,
}) => {
  const navigate = useNavigate();
  const pageDisplayCount = 4;
  const postDisplayCount = 10;
  const { company, domain, path, setPath, setIsLoading } = useAuth();
  const [groups, setGroups] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [delBtnLabel, setDelBtnLabel] = useState(
    status === "active" ? "Delete" : "Recover",
  );

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

  const onClickNew = function () {
    navigate("/groups-new", {
      state: {
        company: company,
        domain: domain,
        mode: "new",
      },
    });
  };

  const onClickDel = async function () {
    setIsLoading(true);
    await groupApi.update(
      company.id,
      domain.id,
      checkedItems.map((item) => {
        return {
          ...item,
          status: status === "active" ? "deleted" : "active",
        };
      }),
    );
    setCheckedItems([]);
    await getGroups();
    setIsLoading(false);
  };

  const onClickPurge = async function () {
    setIsLoading(true);
    await groupApi.remove(company.id, domain.id, checkedItems);
    setCheckedItems([]);
    await getGroups();
    setIsLoading(false);
  };

  const onClickView = (item) => {
    setPath({ ...path, subTitle: item.displayName ?? item.name });
    navigate("/groups-view", {
      state: {
        company: company,
        domain: domain,
        group: item,
        mode: "view",
      },
    });
  };

  const onClickEdit = (item) => {
    setPath({ ...path, subTitle: item.displayName ?? item.name });
    navigate("/groups-edit", {
      state: {
        company: company,
        domain: domain,
        group: item,
        mode: "edit",
      },
    });
  };

  const getGroups = async () => {
    try {
      setIsLoading(true);
      const condition =
        status === "active"
          ? ["status", "!=", "deleted"]
          : ["status", "==", status];
      const dom = await groupApi.getWhere(company.id, domain.id, condition);
      let data = dom.data;
      if (excludes) {
        data = data.filter(
          (item) => !excludes.map((e) => e.value).includes(item.id),
        );
      }
      setGroups(data);
      setPageEnd(
        Math.ceil(dom.data.length / postsPerPage) < pageDisplayCount
          ? Math.ceil(dom.data.length / postsPerPage)
          : pageDisplayCount,
      );
    } catch (error) {
      if (error.status === 401) navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    //setIsLoading(true);
    getGroups();
    setDelBtnLabel(status === "active" ? "Delete" : "Recover");
    //setIsLoading(false);
  }, [status, company.id, domain.id]);

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
  const purgeClass =
    "w-30 ml-8 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex">
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
        {/* groups */}
        <Groups
          groups={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          noDetailView={noDetailView}
        />
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
  );
};

GroupPage.displayName = "GroupPage";

export default GroupPage;
