'use client'
import { useState, useEffect } from 'react';

export interface AuthState {
  isAuthenticated: boolean;
  userName: string;
}

export interface UseAuthReturn extends AuthState {
  setIsAuthenticated: (value: boolean) => void;
  setUserName: (name: string) => void;
  logout: () => Promise<void>;
  login: (userName: string) => void;
}

export function useAuth(initialAuth?: AuthState): UseAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAuth?.isAuthenticated ?? false
  );
  const [userName, setUserName] = useState(initialAuth?.userName ?? "");

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

  return {
    isAuthenticated,
    userName,
    setIsAuthenticated,
    setUserName,
    logout,
    login,
  };
}
