'use client';

import { useState, useEffect } from 'react';

export interface AuthUser {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setUser({
          sub: data.userId,
          email: data.email,
          name: data.name,
          picture: data.picture,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = '/api/auth/login';
  };

  const logout = () => {
    window.location.href = '/api/auth/logout';
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refresh: checkAuth,
  };
} 