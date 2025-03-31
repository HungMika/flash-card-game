'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BiSolidLeftArrowCircle } from 'react-icons/bi';

export const QuestionHeader = () => {
  const params = useParams();
  const router = useRouter();
  const ageGroup = params.ageGroup as string;

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white shadow-sm">
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-800 transition-transform transform hover:scale-110"
      >
        <BiSolidLeftArrowCircle className="text-3xl hover:text-3.5xl" />
      </button>

      <div className="flex-1 text-center text-lg font-semibold text-gray-700">
        Check group: {ageGroup}
      </div>
    </div>
  );
};
