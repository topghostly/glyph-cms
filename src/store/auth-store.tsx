"use client";

import { Auth } from "@/type/auth";
import { createContext, useContext, useState } from "react";
import { Session } from "next-auth";

const AuthContext = createContext<Auth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);

  const updateSession = (session: Session | null) => {
    setSession(session);
  };

  return (
    <AuthContext.Provider value={{ session, updateSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
