"use client";

import React, { useEffect, useMemo, useState } from "react";
import TableHeader from "./TableHeader";
import TableBody from "./TableBody";
import TableNavigation from "./TableNavigation";

type ITableHeaderCell = string;

type ITableRowCell = string[] | React.ReactNode[];

interface ITable {
  tableHeaders: ITableHeaderCell[];
  tableItems: ITableRowCell[];
}

export default function Table({ tableHeaders, tableItems }: ITable) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalOfItems = tableItems.length;
  const itemsPerPage = 5;

  const lastFiveItems = useMemo<ITableRowCell[]>(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(currentPage * itemsPerPage, totalOfItems);

    const currentItems = tableItems.slice(startIndex, endIndex);

    return currentItems.slice(-5);
  }, [currentPage, itemsPerPage, totalOfItems, tableItems]);

  const onPaginateTo = (page: number) => setCurrentPage(page);

  useEffect(() => {}, [currentPage]);

  return (
    <>
      <div className="relative overflow-x-auto rounded-lg border dark:border-0">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <TableHeader headerItems={tableHeaders} />
          <TableBody tableItems={lastFiveItems} />
        </table>
      </div>

      <TableNavigation
        tableItems={tableItems}
        currentPage={currentPage}
        onPaginateTo={onPaginateTo}
      />
    </>
  );
}
