'use client';

import { useState, useEffect, useRef } from 'react';

import { getSubjectByGroup } from '@/services/subject';
import { AgeGroupSelector } from '@/components/AgeGroupSelector';
import { DashboardHeader } from '@/features/dashboard/components/header';
import { SubjectCard } from '@/components/SubjectCard';
import { AddSubjectModal } from '@/features/dashboard/components/add-subject-modal';
import { getCurrUser } from '@/services/user';
import { redirect, useRouter } from 'next/navigation';

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
  const hasFetchedRef = useRef(false);

  const router = useRouter();

  // GET CURRENT USER FROM API
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true; // Fix lỗi gọi API user 2 lần

    async function fetchUser() {
      try {
        const userData = await getCurrUser();
        console.log('User data:', userData);
        if (userData) {
          setUser(userData);
        } else {
          alert('User data not found.');
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Lỗi khi lấy user:', error);
      }
    }

    fetchUser();
  }, []);

  // GET SUBJECTS BY AGE GROUP
  useEffect(() => {
    if (!selectedAge) return;

    async function fetchSubjectByGroup() {
      try {
        const subjectsData = await getSubjectByGroup(selectedAge);
        setSubjects(subjectsData);
      } catch (error) {
        console.error(`Lỗi chưa có Subjects của ${selectedAge}:`, error);
      }
    }

    fetchSubjectByGroup();
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
                      key={subject._id}
                      id={subject._id}
                      name={subject.name}
                      ageGroup={subject.group}
                      onChange={() =>
                        getSubjectByGroup(selectedAge).then(setSubjects)
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
                  getSubjectByGroup(selectedAge).then(setSubjects)
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
