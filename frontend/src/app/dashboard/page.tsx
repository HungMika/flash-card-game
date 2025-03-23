"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import { getUser } from "@/lib/storage";
import { getSubjectsByAge } from "@/services/api";
import { logoutUser } from "@/lib/auth-log-out";
import { AgeGroupSelector } from "@/components/AgeGroupSelector";
import { DashboardHeader } from "@/features/dashboard/components/header";
import { SubjectCard } from "@/components/SubjectCard";
import { AddSubjectModal } from "@/features/dashboard/components/add-subject-modal";

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

  useEffect(() => {
    const currUser = getUser();
    if (!currUser) {
      logoutUser();
    } else {
      setUser(currUser);
    }
  }, []);

  useEffect(() => {
    if (selectedAge) {
      getSubjectsByAge(selectedAge).then(setSubjects);
    }
  }, [selectedAge]);

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />

      <div className="p-6 flex-1">
        <h2 className="text-xl font-semibold mb-4">Chọn nhóm tuổi</h2>

        <AgeGroupSelector selectedAge={selectedAge} onSelect={setSelectedAge} />

        {selectedAge && (
          <div className="relative border rounded-lg p-4 max-h-[480px] overflow-y-auto">
            {subjects.length === 0 ? (
              <p className="text-center text-muted-foreground mb-20">
                Chưa có subject nào cho độ tuổi này
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-20">
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

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
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
