'use client';
import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SubjectSearchBar = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="relative max-w-lg w-full">
      <input
        type="text"
        placeholder="Tìm kiếm môn học..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700 shadow-sm transition-all"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
    </div>
  );
};
