"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingState from "./Loading"; // Assuming this exists or we use a simple loader

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return <div className="min-h-screen bg-[#020402] flex items-center justify-center"><LoadingState /></div>;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
