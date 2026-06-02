"use client";
import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], itemsPerPage: number = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    return items.slice(indexOfFirst, indexOfLast);
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    currentItems,
    setCurrentPage,
  };
}
