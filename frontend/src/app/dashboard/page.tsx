'use client';

import { useState, useEffect, useRef } from 'react';
import { getSubjectByUserId, searchSubjects } from '@/services/subject';
import { AgeGroupSelector } from '@/components/AgeGroupSelector';
import { DashboardHeader } from '@/features/dashboard/components/header';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/features/dashboard/components/add-subject-modal';
import { getCurrUser } from '@/services/user';
import { useRouter } from 'next/navigation';
import useDebounce from '@/hooks/use-debounce';
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false); // State Loader
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const hasFetchedRef = useRef(false);

  const router = useRouter();

  // GET CURRENT USER FROM API
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

  // GET SUBJECTS BY AGE GROUP
  useEffect(() => {
    if (!selectedAge) return;

    async function fetchSubjectByGroup() {
      setIsLoading(true);
      try {
        const subjectsData = await getSubjectByUserId(selectedAge);
        setSubjects(subjectsData);
      } catch (error) {
        toast.error('Error fetching subjects.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchSubjectByGroup();
  }, [selectedAge]);

  // SEARCH SUBJECTS
  useEffect(() => {
    if (!selectedAge) return;

    if (!debouncedSearchQuery) {
      getSubjectByUserId(selectedAge).then(setSubjects);
      return;
    }

    async function fetchSearchResults() {
      setIsLoading(true); // Hiển thị loader khi tìm kiếm
      try {
        const searchResults = await searchSubjects(
          debouncedSearchQuery,
          selectedAge,
        );
        setSubjects(searchResults);
      } catch (error) {
        toast.error('Error searching subjects.');
      } finally {
        setIsLoading(false); // Tắt loader sau khi tìm kiếm
      }
    }

    fetchSearchResults();
  }, [debouncedSearchQuery, selectedAge]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4">Select group</h2>

        <AgeGroupSelector selectedAge={selectedAge} onSelect={setSelectedAge} />

        {selectedAge && (
          <div className="relative border rounded-lg p-4 flex flex-col max-h-[480px]">
            {/* Hiển thị loader nếu đang load */}
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="loader border-t-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
                <p className="ml-2">Loading...</p>
              </div>
            ) : (
              <>
                {/* Search Input */}
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full p-2 mb-4 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />

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
                          onChange={() =>
                            getSubjectByUserId(selectedAge).then(setSubjects)
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex justify-center">
                  <AddSubjectModal
                    user={user}
                    ageGroup={selectedAge}
                    onSubjectAdded={() =>
                      getSubjectByUserId(selectedAge).then(setSubjects)
                    }
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
