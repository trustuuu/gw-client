import { useEffect, useState } from "react";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import userApi from "../../api/user-api";
import Modal from "../../component/Modal";
import { useAuth } from "../../component/AuthContext";
import ExternalIdentityAccounts from "./ExternalIdentityAccounts";
import { useLocation, useNavigate } from "react-router-dom";

function ExternalIdentityAccountsPage() {
  const navigate = useNavigate();
  const pageDisplayCount = 10;
  const postDisplayCount = 15;
  const {
    user: userAuth,
    isLoading,
    setIsLoading,
    company: companyAuth,
    domain: domainAuth,
    path,
    setPath,
  } = useAuth();
  const location = useLocation();

  const {
    company: companyState,
    domain: domainState,
    user: userState,
  } = location.state || {};

  const user = userState ? userState : userAuth;
  const domain = domainState ? domainState : domainAuth;
  const company = companyState ? companyState : companyAuth;

  const [accounts, setAccounts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);
  const [postsPerPage] = useState(postDisplayCount);
  const [checkedItems, setCheckedItems] = useState([]);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts =
    accounts.length > 0
      ? accounts.slice(indexOfFirstPost, indexOfLastPost)
      : [];

  const paginate = (pageNumber, startPage, endPage) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const getIdentityAccounts = async () => {
    setIsLoading(true);
    const allData = await userApi.getExternalIdentityAccounts(
      company.id,
      domain.id,
      user.id
    );
    await setAccounts(allData.data);
    setIsLoading(false);
  };

  const handleCallback = (childCheckedItems) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickNew = function () {
    navigate("/users-external-account-new", {
      state: {
        company,
        domain,
        user,
        mode: "new",
      },
    });
  };
  const onClickView = (item) => {
    setPath({ ...path, subTitle: item.displayName });
    navigate("/users-external-account-view", {
      state: {
        company,
        domain,
        user,
        account: item,
        mode: "view",
      },
    });
  };

  const onClickEdit = (item) => {
    setPath({ ...path, subTitle: item.displayName });
    navigate("/users-external-account-edit", {
      state: {
        company,
        domain,
        user,
        account: item,
        mode: "edit",
      },
    });
  };
  const onClickDel = async function (item) {
    setIsLoading(true);
    await userApi.removeExternalIdentityAccounts(
      company.id,
      domain.id,
      user.id,
      item.id
    );
    await getIdentityAccounts();
    setIsLoading(false);
  };

  const onClickDelMulti = async function () {
    setIsLoading(true);
    await userApi.removeExternalIdentityAccounts(
      company.id,
      domain.id,
      user.id,
      checkedItems
    );
    await getIdentityAccounts();
    setIsLoading(false);
  };

  useEffect(() => {
    getIdentityAccounts();
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
        {/* accounts */}
        <ExternalIdentityAccounts
          accounts={currentPosts}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
          onClickDel={onClickDel}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={accounts.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            Math.ceil(accounts.length / postsPerPage) < pageDisplayCount
              ? Math.ceil(accounts.length / postsPerPage)
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

export default ExternalIdentityAccountsPage;
