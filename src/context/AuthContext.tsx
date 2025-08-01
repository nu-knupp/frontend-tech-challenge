"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
};

const noop = () => undefined;

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: noop,
  userName: "",
  setUserName: noop,
});

type AuthProviderProps = {
  children: React.ReactNode;
  initialAuth?: {
    isAuthenticated: boolean;
    userName: string;
  };
};

export const AuthProvider = ({
  children,
  initialAuth = { isAuthenticated: false, userName: "" },
}: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuth.isAuthenticated);
  const [userName, setUserName] = useState(initialAuth.userName);

  useEffect(() => {
    if (!userName) {
      const stored = localStorage.getItem("userName");
      if (stored) setUserName(stored);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userName, setUserName }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
