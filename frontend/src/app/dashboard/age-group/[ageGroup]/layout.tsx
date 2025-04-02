import { QuestionHeader } from '@/features/question/question-header';
import React from 'react';

export default function AgeGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ageGroup: string };
}) {
  return (
    <div className="p-6 space-y-4">
      <QuestionHeader />
      {children}
    </div>
  );
}
