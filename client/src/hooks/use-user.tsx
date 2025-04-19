import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

type UserWithoutPassword = Omit<User, "password">;

interface UserContextType {
  currentUser: UserWithoutPassword | null;
  isLoading: boolean;
  error: Error | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  // Hardcoded user ID for now - in a real app, we'd get this from a login process
  const userId = 1;
  
  const {
    data: user,
    error,
    isLoading,
  } = useQuery<UserWithoutPassword, Error>({
    queryKey: [`/api/users/${userId}`],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <UserContext.Provider
      value={{
        currentUser: user || null,
        isLoading,
        error,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}