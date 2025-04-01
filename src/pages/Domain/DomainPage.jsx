import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Domains from "./Domains";
import domainApi from "../../api/domain-api";
import ButtonToolbox from "../../component/ButtonToolbox";

function DomainPage() {
  const history = useHistory();
  const pageDisplayCount = 4;
  const postDisplayCount = 3;
  const { accessToken, company, domain, saveDomain } = useAuth();
  const [domains, setDomains] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    domains && domain
      ? domains
          .filter((d) => d.id != domain.id)
          .slice(indexOfFirstPost, indexOfLastPost)
      : [];
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickNew = function (e) {
    history.push("/onboarding-domain-new", {
      company: company,
      mode: "new",
      domainCount: domain ? domains.length : 0,
    });
  };
  const onClickDel = async function (e) {
    await domainApi.remove(company.id, checkedItems);
    setCheckedItems([]);
    await getDomains();
  };

  const onClickView = (item) => {
    history.push("/onboarding-domain-new", {
      company: company,
      domain: item,
      mode: "view",
      domainCount: domain ? domains.length : 0,
    });
  };

  const onClickEdit = (item) => {
    history.push("/onboarding-domain-new", {
      company: company,
      domain: item,
      mode: "edit",
      domainCount: domain ? domains.length : 0,
    });
  };

  const onClickPrimary = async function (e) {
    await domainApi.setPrimary(company.id, checkedItems[0].id);
    saveDomain(checkedItems[0]);
  };

  const getDomains = async () => {
    if (accessToken) {
      const dom = await domainApi.get(company.id, null);
      setDomains(dom.data);
      setPageEnd(
        domain
          ? Math.ceil(
              dom.data.filter((d) => d.id != domain.id).length / postsPerPage
            ) < pageDisplayCount
            ? Math.ceil(
                dom.data.filter((d) => d.id != domain.id).length / postsPerPage
              )
            : pageDisplayCount
          : 0
      );
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getDomains();
    setIsLoading(false);
  }, []);

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
    " w-40 h-10 ml-4 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex">
        {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">Manage Domain</h2> */}
        <Toolbox
          onClickNew={onClickNew}
          onClickDel={onClickDel}
          disabledDel={checkedItems.length < 1}
        />
        <ButtonToolbox
          text="Set Primary"
          svg={primarySvg}
          clickHandle={onClickPrimary}
          disabled={checkedItems.length != 1}
          customClass={primaryButtonClass}
        />
      </header>
      <div className="p-3">
        {/* Current Company */}
        <div>
          <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            Current Domain
          </header>
          <ul className="my-1">
            {/* Item */}
            <li className="flex px-2 hover:bg-indigo-200 dark:hover:bg-indigo-400 hover:cursor-pointer">
              <div className="w-9 h-9 rounded-full shrink-0 bg-indigo-500 my-2 mr-3">
                <svg
                  className="w-9 h-9 fill-current text-indigo-50"
                  viewBox="0 0 36 36"
                >
                  <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
                </svg>
              </div>
              <div className="grow flex items-center border-b border-slate-100 dark:border-slate-700 text-sm py-2">
                <div className="grow flex">
                  <div className="self-center uppercase w-1/6 min-w-48">
                    {domain ? domain.name : ""}
                  </div>
                  <div className="text-left justify-self-start w-4/6">
                    {domain ? domain.description : ""}
                  </div>
                  <div className="shrink-0 self-end ml-2 w-1/6">
                    <a
                      className="font-medium text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                      href="#0"
                    >
                      View
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* "Yesterday" group */}
        <Domains
          domain={domain}
          domains={currentPosts.filter((d) => d.id != domain.id)}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={
            domain ? domains.filter((d) => d.id != domain.id).length : 0
          }
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            domain
              ? Math.ceil(
                  domains.filter((d) => d.id != domain.id).length / postsPerPage
                ) < pageDisplayCount
                ? Math.ceil(
                    domains.filter((d) => d.id != domain.id).length /
                      postsPerPage
                  )
                : pageDisplayCount
              : 0
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>
    </div>
  );
}

export default DomainPage;
