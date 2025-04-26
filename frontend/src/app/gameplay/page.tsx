'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function GameplayPage() {
  const router = useRouter();
  const groups = ['1-2', '3-5', '6-8', '9-12'];
  const [loading, setLoading] = useState<string | null>(null);

  const groupColors: { [key: string]: string } = {
    '1-2': 'bg-red-500 hover:bg-red-600',
    '3-5': 'bg-green-500 hover:bg-green-600',
    '6-8': 'bg-blue-500 hover:bg-blue-600',
    '9-12': 'bg-yellow-500 hover:bg-yellow-600',
  };

  const handleSelectGroup = (group: string) => {
    setLoading(group);
    router.push(`/gameplay/${group}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <img
          src="/FLASH-logo-colorful.png"
          alt="Flash Logo"
          className="h-16 w-auto mb-2"
        />
      <h2 className="text-xl font-bold mb-5">Chọn Nhóm Lớp</h2>
      <div className="grid grid-cols-2 gap-4 w-full max-w-md">
        {groups.map((group) => (
          <button
            key={group}
            className={`
              ${groupColors[group]} text-white p-4 rounded-lg text-lg font-semibold transition
              transform hover:scale-105 active:scale-95 shadow-md
              hover:shadow-lg hover:brightness-110
            `}
            onClick={() => handleSelectGroup(group)}
            disabled={loading !== null}
          >
            {loading === group ? (
              <Loader2 className="animate-spin w-6 h-6 mx-auto" />
            ) : (
              group
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
