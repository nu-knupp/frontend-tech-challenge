"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  isAuthLoading: boolean;
};

const noop = () => undefined;

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: noop,
  userName: "",
  setUserName: noop,
  isAuthLoading: true,
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    // Simula checagem de autenticação async
    setIsAuthLoading(true);
    setTimeout(() => {
      // Aqui você pode colocar sua lógica real de checagem
      const storedAuth = localStorage.getItem("isAuthenticated");
      setIsAuthenticated(storedAuth === "true");
      const storedUser = localStorage.getItem("userName");
      if (storedUser) setUserName(storedUser);
      setIsAuthLoading(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("userName", userName);
    }
  }, [userName]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userName, setUserName, isAuthLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
