"use client";

import { LocalUserInfoProps, UserContextProps } from "@/type/user";
import React, { createContext, ReactNode, useContext, useState } from "react";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<LocalUserInfoProps>({
    username: "Unknown User",
    usermail: "Unknown Mail",
    userId: "",
    userImage: "",
  });

  const updateUserInfo = (info: LocalUserInfoProps) => {
    setUserInfo(info);
  };

  return (
    <UserContext.Provider value={{ userInfo, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UseUser should be used inside a UserProvider");
  }
  return context;
};
