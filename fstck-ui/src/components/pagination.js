'use client';

import clsx from "clsx";

export default function Pagination({ page, limit, totalPages, onPageChange }) {
  // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // const handlePageChange = async (newPage) => {
  //   await onPageChange(newPage, limit); // Invoke the fetcher
  // };

  return (
    <div className="flex justify-end items-center my-4">
      <button className={clsx("px-2 py-1 mx-1 border border-gray-300", {"bg-gray-700": page === 1})}
              disabled={page === 1}>
        Prev
      </button>
      <button className="px-2 py-1 mx-1 border border-gray-300 bg-gray-700" disabled>
        {page}
      </button>
      <button className="px-2 py-1 mx-1 border border-gray-300">Next</button>
      <button className="px-2 py-1 mx-1 border border-gray-300">Next 10</button>
    </div>
  );
}