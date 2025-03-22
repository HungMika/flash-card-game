// lib/auth.ts
"use client";

import { removeUser } from "./storage";
import { logOut } from "@/services/api";
import { redirect } from "next/navigation";

export async function logoutUser(shouldRedirect: boolean = true) {
  await logOut(); 
  removeUser(); 

  if (shouldRedirect) {
    redirect("/auth");
  }
}