import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../component/AuthContext";
import Toolbox from "../../component/Toolbox";
import Pagination from "../../component/Pagination";
import SCIMList from "./SCIMList";
import scimApi from "../../api/scim-api";
import { SCIM } from "../../types/SCIM";

function SCIMPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, company, domain, setScim, path, setPath } = useAuth();
  const pageDisplayCount = 4;
  const postDisplayCount = 10;
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageStart, setPageStart] = useState(1);

  const { data: scims = [], isLoading } = useQuery({
    queryKey: ["scims", company?.id, domain?.id],
    queryFn: async () => {
      try {
        const response = await scimApi.get(company.id, domain.id);
        return response.data;
      } catch (error: any) {
        if (error.response?.status === 401) {
          navigate("/");
        }
        throw error;
      }
    },
    refetchOnMount: true,
    enabled: !!company?.id && !!domain?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: string[]) => scimApi.remove(company.id, domain.id, ids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["scims", company?.id, domain?.id],
      });
      setCheckedItems([]);
    },
    onError: (err) => {
      console.error("failed to delete:", err);
    },
  });

  const postsPerPage = postDisplayCount;
  const currentPosts = useMemo(() => {
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    return scims.slice(indexOfFirstPost, indexOfLastPost);
  }, [scims, currentPage, postsPerPage]);

  const pageEnd = useMemo(() => {
    const totalPages = Math.ceil(scims.length / postsPerPage);
    return totalPages < pageDisplayCount ? totalPages : pageDisplayCount;
  }, [scims.length, postsPerPage, pageDisplayCount]);

  const paginate = useCallback((pageNumber: number, startPage: number) => {
    setCurrentPage(pageNumber);
    setPageStart(startPage);
  }, []);

  const onClickDel = useCallback(() => {
    if (window.confirm("Do you want to delete selected SCIMs?")) {
      deleteMutation.mutate(checkedItems);
    }
  }, [deleteMutation, checkedItems]);

  const onClickNew = useCallback(() => {
    setScim({ name: "" });
    navigate("/onboarding-scims-new", {
      state: { mode: "new", company, domain },
    });
  }, [navigate, company, domain]);
  const onClickView = useCallback(
    (item: SCIM) => {
      setScim(item);
      setPath({ ...path, subTitle: item.name });
      navigate("/onboarding-scims-brief", {
        state: { scim: item, mode: "overview", company, domain },
      });
    },
    [navigate, company, domain],
  );
  const onClickEdit = useCallback(
    (item: SCIM) => {
      setScim(item);
      navigate("/onboarding-scims-new", {
        state: { scim: item, mode: "edit", company, domain },
      });
    },
    [navigate, company, domain],
  );

  return (
    <div className="col-span-full xl:col-span-6 shadow-lg rounded-sm">
      <header className="w-full px-5 py-4 border-b border-slate-100 dark:border-slate-700 relative inline-flex">
        <Toolbox
          onClickNew={onClickNew}
          onClickDel={onClickDel}
          disabledDel={checkedItems.length < 1 || deleteMutation.isPending}
        />
      </header>
      <div className="p-3">
        {/* Current Domain */}
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
                    // onClick={onClickView.bind(this, domain)}
                  >
                    <div className="self-center uppercase w-1/6 min-w-48">
                      {domain ? domain.name : ""}
                    </div>
                    <div className="text-left justify-self-start w-4/6">
                      {domain ? domain.description : ""}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <SCIMList
          scims={currentPosts}
          parentCallback={setCheckedItems}
          onClickView={onClickView}
          onClickEdit={onClickEdit}
          loading={isLoading}
        />
        <Pagination
          postsPerPage={postsPerPage}
          totalPosts={scims.length}
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

export default SCIMPage;
