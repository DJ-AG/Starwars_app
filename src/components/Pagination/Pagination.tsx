import React from 'react';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  totalPage: number;
  goToPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  hasNextPage,
  hasPrevPage,
  totalPage,
  goToPage
}) => {
  return (
    <div className="paginationContainer">
      {hasPrevPage && (
        <button
          className="paginationButton"
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>
      )}
      <span className="currentPage">
        {currentPage} / {totalPage}
      </span>
      {hasNextPage && (
        <button
          className="paginationButton"
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Pagination;
