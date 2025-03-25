'use client';

import { useState, useEffect, useRef } from 'react';

import { getSubjectsByAge } from '@/services/api';
import { AgeGroupSelector } from '@/components/AgeGroupSelector';
import { DashboardHeader } from '@/features/dashboard/components/header';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/features/dashboard/components/add-subject-modal';
import { getCurrUser } from '@/services/user';

type Subject = {
  id: string;
  name: string;
  ageGroup: string;
  userId: string;
};

type User = {
  id: string;
  username: string;
  email: string;
};

export default function DashboardPage() {
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const hasFetchedRef = useRef(false);

  // GET CURRENT USER FROM API
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    //fix lỗi log user 2 lần

    async function fetchUser() {
      const userData = await getCurrUser();
      console.log('User data:', userData);
      if (userData) {
        setUser(userData);
      } else {
        alert('User data not found.');
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (selectedAge) {
      getSubjectsByAge(selectedAge).then(setSubjects);
    }
  }, [selectedAge]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader user={user} />

      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4">Chọn nhóm lớp</h2>

        <AgeGroupSelector selectedAge={selectedAge} onSelect={setSelectedAge} />

        {selectedAge && (
          <div className="relative border rounded-lg p-4 flex flex-col max-h-[480px]">
            <div className="overflow-y-auto flex-1 mb-4">
              {subjects.length === 0 ? (
                <p className="text-center text-muted-foreground">
                  Chưa có subject nào cho nhóm lớp này
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {subjects.map((subject) => (
                    <SubjectCard
                      key={subject.id}
                      id={subject.id}
                      name={subject.name}
                      ageGroup={subject.ageGroup}
                      onChange={() =>
                        getSubjectsByAge(selectedAge).then(setSubjects)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="mt-auto flex justify-center">
              <AddSubjectModal
                ageGroup={selectedAge}
                onSubjectAdded={() =>
                  getSubjectsByAge(selectedAge).then(setSubjects)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
