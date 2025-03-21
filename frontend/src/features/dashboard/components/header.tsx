"use client";

import { Button } from "@/components/ui/button";
import { getTeacher } from "@/lib/storage";
import { logoutTeacher } from "@/lib/auth-log-out";
import { useEffect, useState } from "react";

interface Teacher {
  id: string;
  username: string;
  email: string;
}

export const DashboardHeader = () => {
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    const currTeacher = getTeacher();
    if (!currTeacher) {
      logoutTeacher();
    } else {
      setTeacher(currTeacher);
    }
  }, []);

  if (!teacher) return null;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white sticky top-0 z-10">
      <div>
        <h1 className="text-lg font-semibold">Chào mừng, {teacher.username}!</h1>
        <p className="text-sm text-muted-foreground">{teacher.email}</p>
      </div>
      <Button variant="outline" onClick={() => logoutTeacher()}>
        Đăng xuất
      </Button>
    </header>
  );
};
