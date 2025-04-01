import React from "react";

const Pagination = ({
  postsPerPage,
  totalPosts,
  paginate,
  currentPage,
  pageStart,
  pageEnd,
  pageDisplayCount,
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  const selectedCSS =
    "relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
  const generalCSS =
    "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0";

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white dark:bg-slate-700 px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-yellow-100">
            Showing <span className="font-medium">{pageStart}</span> to{" "}
            <span className="font-medium">{pageEnd} pages </span> of{" "}
            <span className="font-medium">{pageNumbers.length}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <a
              href="#"
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <svg
                onClick={() =>
                  pageStart - pageDisplayCount > 0
                    ? paginate(
                        pageStart - pageDisplayCount,
                        pageStart - pageDisplayCount,
                        pageEnd - pageDisplayCount
                      )
                    : paginate(1, 1, pageDisplayCount)
                }
                className="h-8 w-8 text-indigo-500"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                <polyline points="15 6 9 12 15 18" />
              </svg>
              {/* <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" /> */}
            </a>
            {/* Current: "z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600", Default: "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0" */}
            {pageNumbers.slice(pageStart - 1, pageEnd).map((number) => (
              <a
                href="#"
                aria-current="page"
                className={number == currentPage ? selectedCSS : generalCSS}
                onClick={() => paginate(number, pageStart, pageEnd)}
                aria-label={`Go to Page ${number}`}
              >
                {number}
              </a>
            ))}
            <a
              href="#"
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              {/* <ChevronRightIcon className="h-5 w-5" aria-hidden="true" /> */}
              <svg
                onClick={() =>
                  pageEnd + pageDisplayCount < Math.max(...pageNumbers)
                    ? paginate(
                        pageStart + pageDisplayCount,
                        pageStart + pageDisplayCount,
                        pageEnd + pageDisplayCount
                      )
                    : paginate(
                        Math.max(...pageNumbers) - pageDisplayCount + 1,
                        Math.max(...pageNumbers) - pageDisplayCount + 1,
                        Math.max(...pageNumbers)
                      )
                }
                className="h-8 w-8 text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                {" "}
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </a>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
