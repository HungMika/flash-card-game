"use client";

import { useParams } from "next/navigation";

export default function GameplayLayout({ children }: { children: React.ReactNode }) {
  const { group } = useParams();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
