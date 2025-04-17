"use client";

import { Auth } from "@/type/auth";
import { createContext, useContext, useState } from "react";
import { Session } from "next-auth";
import { Types } from "mongoose";

const AuthContext = createContext<Auth | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<Types.ObjectId | null>(null);

  const updateSession = (session: Session | null) => {
    setSession(session);
  };

  const updateUserId = (userId: Types.ObjectId | null) => {
    setUserId(userId);
  };

  return (
    <AuthContext.Provider
      value={{ session, updateSession, updateUserId, userId }}
    >
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
