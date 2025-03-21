import React from "react";

export default function AgeGroupLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { ageGroup: string };
}) {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Nhóm tuổi: {params.ageGroup}</h1>
      {children}
    </div>
  );
}
