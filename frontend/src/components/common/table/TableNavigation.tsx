"use client";

import React, { useMemo } from "react";
import Tooltip from "../Tooltip";
type ITableRowCell = string[] | React.ReactNode[];

interface ITable {
  tableItems: ITableRowCell[];
  currentPage: number;
  onPaginateTo: Function;
}

export default function TableNavigation({
  tableItems,
  currentPage,
  onPaginateTo,
}: ITable) {
  const itemsPerPage = 5;
  const quantityOfItems = tableItems.length;
  const quantityOfPages = Math.round(quantityOfItems / itemsPerPage);

  const paginateTo = (page: number) => {
    if (page > quantityOfPages || page < 1) return;

    onPaginateTo(page);
  };

  const lastFivePages = useMemo(() => {
    const pageIndexes = tableItems.map((_, index) => index + 1);

    const center = 3;

    let start = Math.max(0, currentPage - center);
    const end = Math.min(quantityOfPages, start + itemsPerPage);

    if (end - start < itemsPerPage) {
      start = Math.max(0, end - itemsPerPage);
    }

    return pageIndexes.slice(start, end);
  }, [currentPage, tableItems]);

  const paginationBaseClass =
    "flex items-center justify-center px-3 h-8 border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 hover:cursor-pointer";

  const activePageClass =
    "text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-white";

  const inactivePageClass =
    "leading-tight text-gray-500 bg-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white";

  const getBorderClass = (index: number) => {
    if (index === 0) return "rounded-s-lg";
    else if (index === 4 || index === quantityOfPages - 1)
      return "rounded-e-lg";

    return "";
  };

  const getPaginationClass = (page: number, index: number) => {
    const currentPageClass =
      currentPage === page ? activePageClass : inactivePageClass;
    const borderClass = getBorderClass(index);

    return `${paginationBaseClass} ${currentPageClass} ${borderClass}`;
  };

  const pageIsOutOfTheEdges = (page: number) =>
    page > 1 || page < quantityOfPages;

  const renderCurrentPagination = (page: number, index: number) => {
    const ellipsisPrefix =
      pageIsOutOfTheEdges(page) && index === 0 ? "..." : "";
    const ellipsisSufix = pageIsOutOfTheEdges(page) && index === 4 ? "..." : "";

    return (
      <li key={index}>
        <a
          className={getPaginationClass(page, index)}
          onClick={() => paginateTo(page)}
        >
          {`${ellipsisPrefix} ${page} ${ellipsisSufix}`}
        </a>
      </li>
    );
  };

  const SummaryOfPages = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, quantityOfItems);

    return (
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto flex justify-center">
        <span className="mr-1">Showing</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {start} - {end}
        </span>
        <span className="mx-1">of</span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {quantityOfItems}
        </span>
      </span>
    );
  };

  const PreviousPageIcon = (
    <svg
      className="w-2 h-2 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 8 14"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 1 1.3 6.326a.91.91 0 0 0 0 1.348L7 13"
      />
    </svg>
  );

  const FirstPageIcon = (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m17 16-4-4 4-4m-6 8-4-4 4-4"
      />
    </svg>
  );

  const NextPageIcon = (
    <svg
      className="w-2 h-2 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 8 14"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m1 13 5.7-5.326a.909.909 0 0 0 0-1.348L1 1"
      />
    </svg>
  );

  const LastPageIcon = (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="m7 16 4-4-4-4m6 8 4-4-4-4"
      />
    </svg>
  );

  return (
    <nav
      className="flex items-center flex-col flex-wrap md:flex-row justify-between pt-4"
      aria-label="Table navigation"
    >
      <SummaryOfPages />

      <ul className="inline-flex mb-4 -space-x-px rtl:space-x-reverse text-sm h-8 md:mb-0">
        {lastFivePages.map((page, index) =>
          renderCurrentPagination(page, index),
        )}
      </ul>

      <ul className="inline-flex  -space-x-px rtl:space-x-reverse text-sm h-8">
        <li>
          <Tooltip text="First page">
            <a
              className="hover:cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => paginateTo(1)}
            >
              {FirstPageIcon}
            </a>
          </Tooltip>
        </li>
        <li>
          <Tooltip text="Previous page">
            <a
              className="hover:cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => paginateTo(currentPage - 1)}
            >
              {PreviousPageIcon}
            </a>
          </Tooltip>
        </li>

        <li>
          <Tooltip text="Next page">
            <a
              className="hover:cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => paginateTo(currentPage + 1)}
            >
              {NextPageIcon}
            </a>
          </Tooltip>
        </li>
        <li>
          <Tooltip text="Last page">
            <a
              className="hover:cursor-pointer flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              onClick={() => paginateTo(quantityOfPages)}
            >
              {LastPageIcon}
            </a>
          </Tooltip>
        </li>
      </ul>
    </nav>
  );
}
