import React from "react";
import { useEffect, useState } from "react";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import applicationApi from "../../api/application-api";
import Modal from "../../component/Modal";
import { useAuth } from "../../component/AuthContext";
import ApplicationTokenExchanges from "./ApplicationTokenExchanges";
import { useNavigate } from "react-router-dom";

function ApplicationTokenExchangePage({ application: appState }) {
  const navigate = useNavigate();
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const {
    application: appAuth,
    isLoading,
    setIsLoading,
    company,
    domain,
    path,
    setPath,
  } = useAuth();
  const application = appState ? appState : appAuth;
  const [policies, setPolicies] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);
  const [checkedItems, setCheckedItems] = useState([]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    policies.length > 0
      ? policies.slice(indexOfFirstPost, indexOfLastPost)
      : [];

  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const getTokenExchanges = async () => {
    setIsLoading(true);
    const allPolicy = await applicationApi.getTokenExchanges(application.id);
    await setPolicies(allPolicy.data);
    setIsLoading(false);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickNew = function () {
    navigate("/applications-token-exchange-new", {
      state: {
        company,
        domain,
        mode: "new",
      },
    });
  };
  const onClickView = (item) => {
    setPath({ ...path, subTitle: item.displayName });
    navigate("/applications-token-exchange-view", {
      state: {
        company,
        domain,
        application,
        policy: item,
        mode: "view",
      },
    });
  };

  const onClickEdit = (item) => {
    setPath({ ...path, subTitle: item.displayName });
    navigate("/applications-token-exchange-edit", {
      state: {
        company,
        domain,
        application,
        policy: item,
        mode: "edit",
      },
    });
  };
  const onClickDel = async function (item) {
    setIsLoading(true);
    await applicationApi.removeTokenExchange(application.id, item.id);
    await getTokenExchanges();
    setIsLoading(false);
  };

  const onClickDelMulti = async function () {
    setIsLoading(true);
    await applicationApi.removeTokenExchange(application.id, checkedItems);
    await getTokenExchanges();
    setIsLoading(false);
  };

  useEffect(() => {
    getTokenExchanges();
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex items-center justify-between">
        <div className="space-y-4 ml-10">
          <label
            htmlFor="description"
            className="text-pretty ms-2 text-sm font-medium min-w-48 max-w-48 "
          ></label>
          <br />
          <Toolbox
            NewButtonLabel="Add"
            onClickNew={onClickNew}
            onClickDel={onClickDelMulti}
            parentCallback={handleCallback}
            disabledDel={checkedItems.length < 1}
          />
        </div>
      </header>
      <div className="w-full p-3">
        {/* policies */}
        <ApplicationTokenExchanges
          policies={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
          onClickDel={onClickDel}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={policies.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(policies.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(policies.length / postsPerPage)
              : pageDisplayCount
          }
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>

      <div className="w-full flex items-center justify-center"></div>
    </div>
  );
}

export default ApplicationTokenExchangePage;
