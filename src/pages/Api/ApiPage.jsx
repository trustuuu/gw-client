import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Dropdown from "../../component/Dropdown";
import Pagination from "../../component/Pagination";
import Apis from "./Apis";
import apiApi from "../../api/api-api";
import domainApi from "../../api/domain-api";

function ApiPage({ status }) {
  const history = useHistory();
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const { accessToken, company, domain } = useAuth();
  const [apis, setApis] = useState([]);
  const [domainId, setDomainId] = useState(domain.id);
  const [checkedItems, setCheckedItems] = useState([]);
  const [domains, setDomains] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [delBtnLabel, setDelBtnLabel] = useState(
    status == "active" ? "Delete" : "Recover"
  );

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = apis.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickNew = function (e) {
    history.push("/apis-new", {
      company: company,
      domain: domain,
      mode: "new",
    });
  };

  const onClickDel = async function (e) {
    //const api = await apiApi.get(company.id, domain.id, checkedItems);
    await apiApi.remove(checkedItems);
    setCheckedItems([]);
    await getApis();
  };

  const onClickView = (item) => {
    history.push("/apis-view", {
      company: company,
      domain: domain,
      api: item,
      mode: "view",
    });
  };

  const onClickEdit = (item) => {
    history.push("/apis-new", {
      company: company,
      domain: domain,
      api: item,
      mode: "edit",
    });
  };

  const onChangeDomain = (item) => {
    if (domainId != item) getApis(item);
  };

  const getApis = async (domId) => {
    if (accessToken) {
      const condition = ["companyId", "==", company.id];
      const items = await apiApi.get(company.id, domId, null, null);
      setApis(items.data);
      setPageEnd(
        Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
          ? Math.ceil(items.data.length / postsPerPage)
          : pageDisplayCount
      );

      if (domains.length < 1) {
        const doms = await domainApi.get(company.id, null);
        setDomains(doms.data);
      }
      setDomainId(domId);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getApis(domainId);
    setDelBtnLabel(status == "active" ? "Delete" : "Recover");
    setIsLoading(false);
  }, [domains]);

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
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex">
        {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">Manage Domain</h2> */}
        <Toolbox
          onClickNew={onClickNew}
          onClickDel={onClickDel}
          DelButtonLabel={delBtnLabel}
          visibleNew={status == "active"}
          disabledDel={checkedItems.length < 1}
        />
        <div className="w-full grid justify-items-end">
          {domains.length > 0 ? (
            <Dropdown
              label="Domains"
              changeHandler={onChangeDomain}
              data={domains.map((d) => {
                return { key: d.id, value: d.name };
              })}
            />
          ) : (
            <></>
          )}
        </div>
      </header>
      <div className="w-full p-3">
        {/* apis */}
        <Apis
          apis={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={apis.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(apis.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(apis.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>
    </div>
  );
}

export default ApiPage;
