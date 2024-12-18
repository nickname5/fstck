import clsx from "clsx";

export default function Pagination({ page, limit, totalPages, onPageChange }) {
  // const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-end items-center my-4">
      <button className={clsx("px-2 py-1 mx-1 border border-gray-300", {"bg-gray-700": page === 1})}
              disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Prev
      </button>
      <button className="px-2 py-1 mx-1 border border-gray-300 bg-gray-700" disabled>
        {page}
      </button>
      <button className="px-2 py-1 mx-1 border border-gray-300" onClick={() => onPageChange(page + 1)}>Next</button>
      <button className="px-2 py-1 mx-1 border border-gray-300" onClick={() => onPageChange(page + 10)}>Next 10</button>
    </div>
  );
}