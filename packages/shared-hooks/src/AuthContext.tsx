"use client";

import { createContext, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  userName: string;
  setUserName: (name: string) => void;
  logout: () => Promise<void>;
  login: (name: string) => void;
};

const noop = () => undefined;
const noopAsync = async () => undefined;

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: noop,
  userName: "",
  setUserName: noop,
  logout: noopAsync,
  login: noop,
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

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setIsAuthenticated(false);
    setUserName("");

    // Redirecionar para home após logout
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  const login = (name: string) => {
    setIsAuthenticated(true);
    setUserName(name);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, userName, setUserName, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
