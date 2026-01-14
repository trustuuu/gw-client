import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Companies from "./Companies";
import companyApi from "../../api/company-api";
import ButtonToolbox from "../../component/ButtonToolbox";
import domainApi from "../../api/domain-api";
import { Company } from "types/Company";

function CompanyPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, company, rootCompany, saveCompany, saveDomain } = useAuth();
  const [_, setIsLoading] = useState(false);
  const pageDisplayCount = 4;
  const postDisplayCount = 10;
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ["companies", company?.id],
    queryFn: async () => {
    try {
      const response = await companyApi.getTenants(company.id);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        navigate("/");
      }
      throw error;
    }
  },
    refetchOnMount: true, 
    enabled: !!company?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (ids:string[]) => companyApi.remove(ids),
    onSuccess: () => {
      console.log("delete success");
      queryClient.invalidateQueries({queryKey:["companies", company?.id]}); 
      setCheckedItems([]);
    },
    onError: (err) => {
    console.error("failed to delete:", err);
  }
  });

  const postsPerPage = postDisplayCount;
  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return companies.slice(indexOfFirstPost, indexOfLastPost);
  }, [companies, currentPage, postsPerPage]);

  const pageEnd = useMemo(() => {
    const totalPages = Math.ceil(companies.length / postsPerPage);
    return totalPages < pageDisplayCount ? totalPages : pageDisplayCount;
  }, [companies.length, postsPerPage, pageDisplayCount]);

  const paginate = useCallback((pageNumber:number, startPage:number) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
  }, []);

  const onClickDel = useCallback(() => {
  if (window.confirm("Do you want to delete selected companies?")) {
    deleteMutation.mutate(checkedItems);
  }
}, [deleteMutation, checkedItems]);

  const switchCompany = async (companyId:string) => {
    try {
      const coms = await companyApi.get(companyId);
      const companySession = {
        id: coms.data.id,
        name: coms.data.name,
        displayName: coms.data.displayName,
        parent: coms.data.parent,
        type: coms.data.type || "customer",
      };
      saveCompany(companySession);

      const dom = await domainApi.getPrimary(companyId);
      if (dom.data.length === 1) {
        saveDomain({
          id: dom.data[0].id,
          name: dom.data[0].name,
          description: dom.data[0].description,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onClickNew = useCallback(() => navigate("/onboarding-company-new", { state: { mode: "new", company, parent: company } }), [navigate, company]);
  const onClickView = useCallback((item:Company) => navigate("/onboarding-company-new", { state: { company: item, mode: "view", parent: company } }), [navigate, company]);
  const onClickEdit = useCallback((item:Company) => navigate("/onboarding-company-new", { state: { company: item, mode: "edit", parent: company } }), [navigate, company]);
  // const onClickSwithToManage = async function () {
  //   setIsLoading(true);
  //   await switchCompany(checkedItems[0]);
  //   setIsLoading(false);
  // };

  const onClickParentCompany = useCallback(async function () {
    setIsLoading(true);
    await switchCompany(company.parent);
    setIsLoading(false);
  }, [company]);
  
  const isGlobalLoading = isLoading || deleteMutation.isPending;
const switchCompanySvg = (
    <svg
      className="h-4 w-4 mr-2"
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
      <line x1="9" y1="12" x2="15" y2="12" />{" "}
      <line x1="12" y1="9" x2="12" y2="15" />{" "}
      <path d="M4 6v-1a1 1 0 0 1 1 -1h1m5 0h2m5 0h1a1 1 0 0 1 1 1v1m0 5v2m0 5v1a1 1 0 0 1 -1 1h-1m-5 0h-2m-5 0h-1a1 1 0 0 1 -1 -1v-1m0 -5v-2m0 -5" />
    </svg>
  );
    const switchCompanyClass =
    "w-30 ml-4 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";
  const switchParentClass = switchCompanyClass + "w-30 ml-12";

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex">
        {user && (user.type === "reseller" || user.type === "root") && (
          <>
            <Toolbox
              onClickNew={onClickNew}
              onClickDel={onClickDel}
              //parentCallback={setCheckedItems}
              disabledDel={checkedItems.length < 1 || deleteMutation.isPending}
            />
            <ButtonToolbox
              text="Switch"
              clickHandle={() => switchCompany(checkedItems[0])}
              disabled={checkedItems.length !== 1}
            />
            {company.parent ? (
              <ButtonToolbox
                text="Parent"
                svg={switchCompanySvg}
                clickHandle={onClickParentCompany}
                disabled={
                  company.id == rootCompany.id || company.type == "root"
                }
                customClass={switchParentClass}
              />
            ) : null}
          </>
        )}
      </header>
      
      <div className="p-3">
                {/* Current Company */}
        <div className="shadow-lg rounded-sm mb-10">
          <header className="text-xs uppercase dark:bg-opacity-50 rounded-sm font-semibold p-2">
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
              <div className="grow flex items-center text-sm py-2">
                <div className="grow flex">
                  <div
                    className="grow flex"
                    onClick={() => onClickView(company)}
                  >
                    <div className="self-center uppercase w-1/6 min-w-48">
                      {company ? company.name : ""}
                    </div>
                    <div className="text-left justify-self-start w-4/6">
                      {company ? company.description : ""}
                    </div>
                  </div>
                  <div
                    className="shrink-0 self-end ml-2 w-1/6"
                    onClick={() => onClickEdit(company)}
                  >
                    <a className="font-medium text-indigo-500 hover:text-yellow-600 hover:cursor-pointer dark:hover:text-yellow-400">
                      Edit
                    </a>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <Companies
          companies={currentPosts}
          parentCallback={setCheckedItems}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={companies.length}
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={pageEnd}
          pageStart={pageStart}
          pageEnd={pageEnd}
        />
      </div>
    </div>
  );
}

export default CompanyPage;