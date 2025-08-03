'use client'
import { useState } from 'react';

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

  return {
    isAuthenticated,
    userName,
    setIsAuthenticated,
    setUserName,
    logout,
    login,
  };
}
