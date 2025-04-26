'use client';

import { useState, useEffect } from 'react';
import { getSubjectByUserId } from '@/services/subject';
import { AgeGroupSelector } from '@/components/AgeGroupSelector';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/features/dashboard/components/add-subject-modal';
import { useAuthStore } from '@/services/auth-store';

type Subject = {
  _id: string;
  userId: string;
  name: string;
  group: string;
};

export default function DashboardPage() {
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const user = useAuthStore((state) => state.user);

  const fetchSubjects = async (ageGroup: string) => {
    setIsLoading(true);
    try {
      const subjectsData = await getSubjectByUserId(ageGroup);
      setSubjects(subjectsData);
    } catch (error) {
      // toast.error('Error fetching subjects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedAge) return;

    setSubjects([]);
    fetchSubjects(selectedAge);
  }, [selectedAge]);

  const handleSubjectAdded = () => {
    fetchSubjects(selectedAge);
  };

  const handleSubjectDeleted = async (subjectId: string) => {
    setSubjects((prev) => prev.filter((subject) => subject._id !== subjectId));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">

      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4">Select group</h2>

        <AgeGroupSelector selectedAge={selectedAge} onSelect={setSelectedAge} />

        {selectedAge && (
          <div className="relative border rounded-lg p-4 flex flex-col max-h-[480px]">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                <p className="ml-2">Loading...</p>
              </div>
            ) : (
              <>
                <div className="overflow-y-auto flex-1 mb-4">
                  {subjects.length === 0 ? (
                    <p className="text-center text-muted-foreground">
                      No subjects found.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {subjects.map((subject) => (
                        <SubjectCard
                          key={subject._id}
                          id={subject._id}
                          name={subject.name}
                          ageGroup={subject.group}
                          onChange={() => handleSubjectDeleted(subject._id)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex justify-center">
                  <AddSubjectModal
                    user={user}
                    ageGroup={selectedAge}
                    onSubjectAdded={handleSubjectAdded}
                  />
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
