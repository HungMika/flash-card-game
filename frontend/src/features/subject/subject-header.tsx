import React from 'react';
import { SubjectSearchBar } from './subject-search-bar';
import { BiSolidLeftArrowCircle } from 'react-icons/bi';

export const SubjectHeader = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      {/* Nút back */}
      <button className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110">
        <BiSolidLeftArrowCircle className="text-3xl" />
      </button>

      {/* Thanh tìm kiếm */}
      <div className="flex-1 max-w-md px-4">
        <SubjectSearchBar />
      </div>
    </div>
  );
};
