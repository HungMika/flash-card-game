'use client';

import { useState, useEffect, useRef } from 'react';
import { getSubjectByUserId } from '@/services/subject';
import { AgeGroupSelector } from '@/components/AgeGroupSelector';
import { DashboardHeader } from '@/features/dashboard/components/header';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/features/dashboard/components/add-subject-modal';
import { getCurrUser } from '@/services/user';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Subject = {
  _id: string;
  userId: string;
  name: string;
  group: string;
};

type User = {
  _id: string;
  username: string;
  email: string;
};

export default function DashboardPage() {
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const hasFetchedRef = useRef(false);

  const router = useRouter();

  const fetchSubjects = async (ageGroup: string) => {
    setIsLoading(true);
    try {
      const subjectsData = await getSubjectByUserId(ageGroup);
      setSubjects(subjectsData);
    } catch (error) {
      //toast.error('Error fetching subjects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    async function fetchUser() {
      try {
        const userData = await getCurrUser();
        if (userData) {
          setUser(userData);
        } else {
          toast.error('User data not found.');
          router.replace('/auth');
        }
      } catch (error) {
        toast.error('Error fetching user data.');
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedAge) return;

    // Reset subjects before fetching new ones
    setSubjects([]);

    fetchSubjects(selectedAge);
  }, [selectedAge]);

  const handleSubjectAdded = () => {
    fetchSubjects(selectedAge); // Lấy lại danh sách subjects sau khi thêm subject mới
  };

  const handleSubjectDeleted = async (subjectId: string) => {
    // Cập nhật trực tiếp trong state sau khi xoá
    setSubjects((prevSubjects) =>
      prevSubjects.filter((subject) => subject._id !== subjectId),
    );
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

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
