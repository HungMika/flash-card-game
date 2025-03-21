"use client";

import Link from "next/link";

const ageGroups = ["1-2", "3-5", "6-8", "9-12"];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Chọn lớp</h1>
      <div className="grid grid-cols-2 gap-4">
        {ageGroups.map((age) => (
          <Link
            key={age}
            href={`/dashboard/age-group/${age}`}
            className="p-4 border rounded-xl text-center hover:shadow-md"
          >
            Lớp {age}
          </Link>
        ))}
      </div>
    </div>
  );
}
