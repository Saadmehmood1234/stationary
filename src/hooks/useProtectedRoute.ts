// hooks/useProtectedRoute.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/components/providers/SessionWrapper";

export const useProtectedRoute = (redirectTo: string = "/auth/signin") => {
  const { session, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
    }
  }, [session, loading, router, redirectTo]);

  return { session, loading };
};