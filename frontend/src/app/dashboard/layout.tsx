"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("teacher");
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }, [router]);

  return <div>{children}</div>;
}
