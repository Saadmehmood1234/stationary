// components/providers/SessionWrapper.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getSession } from "@/app/actions/auth.actions";
import { SessionPayload } from "@/types";

interface SessionContextType {
  session: SessionPayload | null;
  loading: boolean;
  refreshSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionWrapper({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async (): Promise<void> => {
    try {
      const sessionData = await getSession();
      setSession(sessionData);
    } catch (error) {
      console.error("Failed to refresh session:", error);
      setSession(null);
    }
  };

  useEffect(() => {
    const initializeSession = async () => {
      await refreshSession();
      setLoading(false);
    };

    initializeSession();
  }, []);

  useEffect(() => {
    const handleStorageChange = async (event: StorageEvent) => {
      if (event.key === "session-update") {
        await refreshSession();
      }
    };

    const handleFocus = async () => {
      await refreshSession();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("focus", handleFocus);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("focus", handleFocus);
      }
    };
  }, []);

  const value: SessionContextType = {
    session,
    loading,
    refreshSession,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionWrapper");
  }
  return context;
};