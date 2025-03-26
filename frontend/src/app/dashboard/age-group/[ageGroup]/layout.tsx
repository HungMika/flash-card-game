import { SubjectHeader } from '@/features/subject/subject-header';
import React from 'react';

export default async function AgeGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ageGroup: string };
}) {
  const ageParams = await params;
  return (
    <div className="p-6 space-y-4 ">
      <SubjectHeader />
      <div className="text-1xl font-bold">
        Nhóm lớp: {ageParams.ageGroup}
      </div>
      {children}
    </div>
  );
}
