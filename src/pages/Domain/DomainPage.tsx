import React, { useMemo } from "react";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import Domains from "./Domains";
import domainApi from "../../api/domain-api";
import ButtonToolbox from "../../component/ButtonToolbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Domain } from "../../types/Domain";

function DomainPage() {
  const navigate = useNavigate();
  const pageDisplayCount = 4;
  const postDisplayCount = 10;
  const { company, domain, saveDomain, setIsLoading } = useAuth();

  const [checkedItems, setCheckedItems] = useState<Domain[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);
  const [pageEnd, setPageEnd] = useState(pageDisplayCount);

  const [postsPerPage] = useState(postDisplayCount);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;

  const queryClient = useQueryClient();

  const {
    data: domains = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["domains", company.id],
    queryFn: async () => {
      try {
        const response = await domainApi.get(company.id, null);
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
    mutationFn: async (ids: Domain[]) => {
      try {
        await domainApi.remove(company.id, ids);
        setCheckedItems([]);
        queryClient.invalidateQueries({ queryKey: ["domains", company?.id] });
        //return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/");
        }
        throw error;
      }
    },
  });

  const setPrimaryMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await domainApi.setPrimary(
          company.id,
          checkedItems[0].id,
        );
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/");
        }
        throw error;
      }
    },
  });

  const switchDomain = useCallback(() => {
    saveDomain(checkedItems[0]);
    setCheckedItems([]);
  }, [checkedItems]);

  const currentPosts =
    domains && domain
      ? domains
          .filter((d: Domain) => d.id !== domain.id)
          .slice(indexOfFirstPost, indexOfLastPost)
      : [];

  const paginate = (pageNumber: number, startPage: number, endPage: number) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
    setPageEnd(endPage);
  };

  const handleCallback = (childCheckedItems: Domain[]) => {
    setCheckedItems(childCheckedItems);
  };

  const onClickNew = useCallback(
    function () {
      navigate("/onboarding-domain-new", {
        state: {
          company: company,
          mode: "new",
          domainCount: domain ? domains.length : 0,
        },
      });
    },
    [navigate, company, domain, domains],
  );
  const onClickDel = useCallback(
    async function () {
      if (window.confirm("Do you want to delete selected domains?")) {
        deleteMutation.mutate(checkedItems);
      }
    },
    [deleteMutation, checkedItems],
  );

  const onClickView = (item: Domain) => {
    navigate("/onboarding-domain-new", {
      state: {
        company: company,
        domain: item,
        mode: "view",
        domainCount: domain ? domains.length : 0,
      },
    });
  };

  const onClickEdit = (item: Domain) => {
    navigate("/onboarding-domain-new", {
      state: {
        company: company,
        domain: item,
        mode: "edit",
        domainCount: domain ? domains.length : 0,
      },
    });
  };

  const primarySvg = (
    <svg
      className="fill-current h-4 w-4 mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
  const primaryButtonClass =
    " w-40 h-10 ml-4 bg-gray-300 disabled:hover:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 enabled:transition enabled:transform enabled:hover:translate-x-1 enabled:hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center";

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex">
        {/* <h2 className="font-semibold text-slate-800 dark:text-slate-100">Manage Domain</h2> */}
        <Toolbox
          onClickNew={onClickNew}
          onClickDel={onClickDel}
          disabledDel={checkedItems.length < 1}
        />
        <ButtonToolbox
          text="Switch"
          clickHandle={() => switchDomain()}
          disabled={checkedItems.length !== 1}
        />
        <ButtonToolbox
          text="Set Primary"
          svg={primarySvg}
          clickHandle={() => setPrimaryMutation.mutate()}
          disabled={checkedItems.length !== 1}
          customClass={primaryButtonClass}
        />
      </header>
      <div className="p-3">
        {/* Current Company */}
        <div className="shadow-lg rounded-sm mb-10">
          <header className="text-xs uppercase dark:bg-opacity-50 rounded-sm font-semibold p-2">
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
              <div className="grow flex items-center text-sm py-2">
                <div className="grow flex">
                  <div
                    className="grow flex"
                    onClick={() => onClickView(domain)}
                  >
                    <div className="self-center uppercase w-1/6 min-w-48">
                      {domain ? domain.name : ""}
                    </div>
                    <div className="text-left justify-self-start w-4/6">
                      {domain ? domain.description : ""}
                    </div>
                  </div>
                  <div
                    className="shrink-0 self-end ml-2 w-1/6"
                    onClick={() => onClickEdit(domain)}
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
        {/* "Yesterday" group */}
        <Domains
          domains={currentPosts.filter((d: Domain) => d.id !== domain.id)}
          parentCallback={handleCallback}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          parentItems={checkedItems}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={
            domain
              ? domains.filter((d: Domain) => d.id !== domain.id).length
              : 0
          }
          paginate={paginate}
          currentPage={currentPage}
          pageDisplayCount={
            domain
              ? Math.ceil(
                  domains.filter((d: Domain) => d.id !== domain.id).length /
                    postsPerPage,
                ) < pageDisplayCount
                ? Math.ceil(
                    domains.filter((d: Domain) => d.id !== domain.id).length /
                      postsPerPage,
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
