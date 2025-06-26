"use client";

import { createContext, useContext } from "react";
import { useUser, UseUser } from "./useUser";

interface Props {
  children: React.ReactNode;
}

// Create the context
const UserContext = createContext<UseUser | undefined>(undefined);

// Create a custom hook to use the context
const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

// Create the provider component
const UserProvider = ({ children }: Props) => {
  const userUserData = useUser();
  return <UserContext.Provider value={userUserData}>{children}</UserContext.Provider>;
};

export { UserProvider, useUserContext };
