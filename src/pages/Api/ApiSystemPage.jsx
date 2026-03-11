import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Dropdown from "../../component/Dropdown";
import Pagination from "../../component/Pagination";
import Apis from "./Apis";
import systemApi from "../../api/system-api";
import domainApi from "../../api/domain-api";
import ApisSystem from "./ApisSystem";

function ApiSystemPage({ status }) {
  const navigate = useNavigate();
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const { company, domain, setApi, path, setPath, setIsLoading } = useAuth();
  const [apis, setApis] = useState([]);
  const [domainId, setDomainId] = useState(domain.id);
  const [checkedItems, setCheckedItems] = useState([]);
  const [domains, setDomains] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [delBtnLabel, setDelBtnLabel] = useState(
    status == "active" ? "Delete" : "Recover",
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

  const onClickView = (item) => {
    setApi(item);
    setPath({ ...path, subTitle: item.name });
    navigate("/settings-apis-brief", {
      state: {
        company: company,
        domain: domain,
        api: item,
        mode: "overview",
      },
    });
  };

  const onClickEdit = (item) => {
    navigate("/apisnew", {
      state: {
        company: company,
        domain: domain,
        api: item,
        mode: "edit",
      },
    });
  };

  const getApis = async (domId) => {
    try {
      setIsLoading(true);
      const items = await systemApi.getSystemApis();
      console.log(items.data.map((d) => d.data));

      setApis(items.data.map((d) => d.data));
      setPageEnd(
        Math.ceil(items.data.length / postsPerPage) < pageDisplayCount
          ? Math.ceil(items.data.length / postsPerPage)
          : pageDisplayCount,
      );

      if (domains.length < 1) {
        const doms = await domainApi.get(company.id, null);
        setDomains(doms.data);
      }
      setDomainId(domId);
    } catch (error) {
      if (error.status === 401 || error.status === 404) navigate("/");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    //setIsLoading(true);
    getApis(domainId);
    setDelBtnLabel(status == "active" ? "Delete" : "Recover");
    //setIsLoading(false);
  }, [domainId]);

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      {company.id !== "igoodworks" ? (
        <></>
      ) : (
        <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex"></header>
      )}
      <div className="w-full p-3">
        {/* apis */}
        <ApisSystem
          apis={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
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

export default ApiSystemPage;
