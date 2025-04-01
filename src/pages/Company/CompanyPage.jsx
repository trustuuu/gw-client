import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Companies from "./Companies";
import companyApi from "../../api/company-api";
import ButtonToolbox from "../../component/ButtonToolbox";
import domainApi from "../../api/domain-api";

function CompanyPage() {
  const history = useHistory();
  const pageDisplayCount = 3;
  const postDisplayCount = 3;
  const { accessToken, company, rootCompany, saveCompany, saveDomain } =
    useAuth();
  const [companies, setCompanies] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = companies
    ? companies.slice(indexOfFirstPost, indexOfLastPost)
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
    history.push("/onboarding-company-new", {
      mode: "new",
      company: company,
      parent: company,
    });
  };

  const onClickDel = async function (e) {
    await companyApi.remove(checkedItems);
    setCheckedItems([]);
    await getCompanies();
  };

  const onClickView = (item) => {
    history.push("/onboarding-company-new", {
      company: item,
      mode: "view",
      parent: company,
    });
  };

  const onClickEdit = (item) => {
    history.push("/onboarding-company-new", {
      company: item,
      mode: "edit",
      parent: company,
    });
  };

  const onClickSwithToManage = async function (e) {
    await switchCompany(checkedItems[0]);
  };

  const onClickParentCompany = async function (e) {
    await switchCompany(company.parent);
  };

  const switchCompany = async (companyId) => {
    const coms = await companyApi.get(companyId);
    saveCompany(coms.data);

    const dom = await domainApi.getPrimary(companyId);
    if ((dom.data.length = 1)) saveDomain(dom.data[0]);
  };

  const getCompanies = async () => {
    if (accessToken) {
      const coms = await companyApi.getTenants(company.id);
      setCompanies(coms.data);
      setPageEnd(
        Math.ceil(coms.data.length / postsPerPage) < pageDisplayCount
          ? Math.ceil(coms.data.length / postsPerPage)
          : pageDisplayCount
      );
    }
  };

  useEffect(() => {
    // (async function() {
    setIsLoading(true);
    getCompanies();
    setIsLoading(false);
    // })();
  }, [company]);

  const switchCompanySvg = (
    <svg
      class="h-4 w-4 mr-2"
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
      <line x1="9" y1="12" x2="15" y2="12" />{" "}
      <line x1="12" y1="9" x2="12" y2="15" />{" "}
      <path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" />
    </svg>
  );
  const switchCompanyClass =
    "w-30 ml-4 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";
  const switchParentClass = switchCompanyClass + "w-30 ml-8";

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 inline-flex items-center justify-start">
        {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">Manage Company</h2> */}
        <Toolbox
          onClickNew={onClickNew}
          onClickDel={onClickDel}
          parentCallback={handleCallback}
          disabledDel={checkedItems.length < 1}
        />
        <ButtonToolbox
          text="Switch"
          svg={switchCompanySvg}
          clickHandle={onClickSwithToManage}
          disabled={checkedItems.length != 1}
          customClass={switchCompanyClass}
        />
        <ButtonToolbox
          text="Parent"
          svg={switchCompanySvg}
          clickHandle={onClickParentCompany}
          disabled={company.id == rootCompany.id || company.type == "root"}
          customClass={switchParentClass}
        />
      </header>
      <div className="p-3">
        {/* Current Company */}
        <div>
          <header className="text-xs uppercase text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-700 dark:bg-opacity-50 rounded-sm font-semibold p-2">
            Current Company
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
                    {company ? company.name : ""}
                  </div>
                  <div className="text-left justify-self-start w-4/6">
                    {company ? company.description : ""}
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
        <Companies
          companies={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={companies.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(companies.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(companies.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>
    </div>
  );
}

export default CompanyPage;
