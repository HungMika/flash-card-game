'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const QuestionHeader = () => {
  const params = useParams();
  const router = useRouter();
  const ageGroup = params.ageGroup as string;

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-white ">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/dashboard')}
        className="border border-gray-300 p-2"
      >
        <ArrowLeft className="w-5 h-5" />
      </Button>

      <div className="flex-1 text-center text-lg font-semibold text-gray-700">
        Check group: {ageGroup}
      </div>

      {/* Dummy div để căn giữa tiêu đề vì không có nút nào bên phải */}
      <div className="w-10" />
    </div>
  );
};
