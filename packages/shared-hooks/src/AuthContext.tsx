"use client";

import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    // Sincroniza com localStorage no lado cliente apenas na primeira vez
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem("isAuthenticated");
      const storedUserName = localStorage.getItem("userName");

      if (storedAuth && !isAuthenticated) {
        setIsAuthenticated(JSON.parse(storedAuth));
      }

      if (storedUserName && !userName) {
        setUserName(storedUserName);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("isAuthenticated", JSON.stringify(isAuthenticated));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (userName) {
        localStorage.setItem("userName", userName);
      } else {
        localStorage.removeItem("userName");
      }
    }
  }, [userName]);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }

    setIsAuthenticated(false);
    setUserName("");

    if (typeof window !== 'undefined') {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userName");
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
