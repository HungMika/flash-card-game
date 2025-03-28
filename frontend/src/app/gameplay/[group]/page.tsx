'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BiSolidLeftArrowCircle } from 'react-icons/bi';
import { getSubjectByGroup } from '@/services/subject';
import { Loader } from 'lucide-react';

type Subject = {
  _id: string;
  name: string;
  group: string;
};

export default function GroupPage() {
  const params = useParams();
  const group = params.group as string;
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!group) return;

    async function fetchSubjects() {
      try {
        setLoading(true);
        const data = await getSubjectByGroup(group);
        setSubjects(data);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, [group]);

  const handleSelectSubject = (subjectId: string) => {
    router.push(`/gameplay/${group}/${subjectId}`);
  };

  if (loading) {
    return (
      <div className="h-full flex-1 flex items-center justify-center flex-col gap-2">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-4 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center w-full mb-4 sticky top-0 bg-white z-10 p-2">
        <BiSolidLeftArrowCircle
          className="text-green-500 text-3xl cursor-pointer hover:text-green-600 transition"
          onClick={() => router.push('/gameplay')}
        />
        <div className="text-1xl font-bold mx-auto">Nhóm Lớp: {group}</div>
      </div>

      {subjects.length === 0 ? (
        <div className="text-center text-gray-500">Không có môn học nào!</div>
      ) : (
        <div className="w-full overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
            {subjects.map((subject) => (
              <div
                key={subject._id}
                className="bg-white border border-gray-300 p-4 rounded-lg text-lg font-semibold 
                text-center shadow-md hover:shadow-lg transition cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectSubject(subject._id)}
              >
                {subject.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
