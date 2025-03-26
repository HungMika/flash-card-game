'use client';

import { useParams, useRouter } from 'next/navigation';
import { BiSolidLeftArrowCircle } from 'react-icons/bi';

export default function GroupPage() {
  const { group } = useParams();
  const router = useRouter();

  const subjects = [
    { id: 'sub1', name: 'Math' },
    { id: 'sub2', name: 'Science' },
    { id: 'sub3', name: 'History' },
    { id: 'sub4', name: 'Literature' },
    { id: 'sub5', name: 'Physics' },
    { id: 'sub6', name: 'Chemistry' },
    { id: 'sub7', name: 'Biology' },
    { id: 'sub8', name: 'Geography' },
    { id: 'sub9', name: 'Music' },
    { id: 'sub10', name: 'Arts' },
  ];

  const handleSelectSubject = (subjectId: string) => {
    router.push(`/gameplay/${group}/${subjectId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-2xl">
      {/* Header - Cố định trên */}
      <div className="flex items-center w-full mb-4 sticky top-0 bg-white z-10 p-2">
        <BiSolidLeftArrowCircle
          className="text-green-500 text-3xl cursor-pointer hover:text-green-600 transition"
          onClick={() => router.push('/gameplay')}
        />
        <div className="text-1xl font-bold mx-auto">Nhóm Lớp: {group}</div>
      </div>

      {/* Danh sách subject - Scrollable */}
      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-white border border-gray-300 p-4 rounded-lg text-lg font-semibold 
              text-center shadow-md hover:shadow-lg transition cursor-pointer hover:bg-gray-100"
              onClick={() => handleSelectSubject(subject.id)}
            >
              {subject.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
