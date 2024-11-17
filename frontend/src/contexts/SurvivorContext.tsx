"use client"

import React, { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { ISurvivor } from '~/interfaces';
import { useAppContext } from './AppContext';

interface AuthContextType {
  storedSurvivor: ISurvivor | null;
  isAuthenticated: boolean;
  storeSurvivor: (survivor: ISurvivor) => void;
  storeOnLocalStorage: (survivorId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ISurvivorAuthProvider {
  children: React.ReactNode;
}

export const SurvivorAuthProvider = ({ children }: ISurvivorAuthProvider) => {
  const [storedSurvivor, setStoredSurvivor] = useState<ISurvivor | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const { setAppIsLoading } = useAppContext();
  const router = useRouter();

  const itsOnPagesWithoutAuth = () => {
    const currentPath = window.location.pathname;

    return ['/login', '/signup'].includes(currentPath);
  };

  const fetchSurvivor = useCallback(async () => {
    const isSurvivorAuthenticated = Boolean(
      isAuthenticated || localStorage.getItem('isAuthenticated') === 'true'
    );

    const survivorId = localStorage.getItem('survivorId');

    if (isSurvivorAuthenticated && survivorId) {
      await checkForSurvivor(survivorId);
    } else {
      logout();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!itsOnPagesWithoutAuth()) setAppIsLoading(true);
    else setAppIsLoading(false);

    fetchSurvivor();
  }, [isAuthenticated]);

  const checkForSurvivor = async (id: string | number) => {
    try {
      const { status, data: survivor } = await axios.get(`/api/survivor/${id}`);

      if (status === 200) {
        storeSurvivor(survivor)

        if (itsOnPagesWithoutAuth()) router.push('/');
      } else logout();
    } catch (error) {
      console.error('Failed to perform survivor fetch', error);

      logout();
    }
  };

  const storeOnLocalStorage = (survivorId: string) => {
    localStorage.setItem('survivorId', survivorId);
    localStorage.setItem('isAuthenticated', 'true');

    setIsAuthenticated(true);
  };

  const storeSurvivor = (survivor: ISurvivor) => {
    setStoredSurvivor(survivor);

    storeOnLocalStorage(survivor.id.toString());

    setAppIsLoading(false);
  };

  const logout = () => {
    setStoredSurvivor(null);
    setIsAuthenticated(false);

    localStorage.removeItem('survivorId');
    localStorage.removeItem('isAuthenticated');

    setAppIsLoading(false);

    if (!itsOnPagesWithoutAuth()) router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ storedSurvivor, isAuthenticated, storeSurvivor, storeOnLocalStorage, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
