// lib/auth.ts
"use client";

import { removeTeacher } from "./storage";
import { logOut } from "@/services/api";
import { redirect } from "next/navigation";

export async function logoutTeacher(shouldRedirect: boolean = true) {
  await logOut(); 
  removeTeacher(); 

  if (shouldRedirect) {
    redirect("/auth");
  }
}