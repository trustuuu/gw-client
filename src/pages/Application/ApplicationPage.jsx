import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Dropdown from "../../component/Dropdown";
import Pagination from "../../component/Pagination";
import Applications from "./Applications";
import applicationApi from "../../api/application-api";
import domainApi from "../../api/domain-api";

function ApplicationPage({ status }) {
  const navigate = useNavigate();
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const { company, domain, path, setPath, setIsLoading, setApplication } =
    useAuth();
  const [applications, setApplications] = useState([]);
  const [domainId, setDomainId] = useState(domain.id);
  const [checkedItems, setCheckedItems] = useState([]);
  const [domains, setDomains] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [delBtnLabel, setDelBtnLabel] = useState(
    status == "active" ? "Delete" : "Recover"
  );

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = applications.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickNew = function () {
    navigate("/applications-new", {
      state: {
        company: company,
        domain: domain,
        mode: "new",
      },
    });
  };

  const onClickDel = async function () {
    setIsLoading(true);
    await applicationApi.remove(checkedItems);
    setCheckedItems([]);
    await getApplications();
    setIsLoading(false);
  };

  const onClickView = (item) => {
    setApplication(item);
    setPath({ ...path, subTitle: item.client_name });
    navigate("/applications-brief", {
      state: {
        company: company,
        domain: domain,
        application: item,
        mode: "view",
      },
    });
  };

  const onClickEdit = (item) => {
    navigate("/applications-new", {
      state: {
        company: company,
        domain: domain,
        application: item,
        mode: "edit",
      },
    });
  };

  const onChangeDomain = (item) => {
    setIsLoading(true);
    if (domainId != item) getApplications(item);
    setIsLoading(false);
  };

  const getApplications = async (domId) => {
    try {
      const items = await applicationApi.get(company.id, domId, null, null);
      setApplications(items.data);
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
    } catch (error) {
      if (error.status === 401) navigate("/");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getApplications(domainId);
    setDelBtnLabel(status == "active" ? "Delete" : "Recover");
    setIsLoading(false);
  }, [domains]);

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
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
        {/* applications */}
        <Applications
          applications={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={applications.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(applications.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(applications.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>
    </div>
  );
}

export default ApplicationPage;
