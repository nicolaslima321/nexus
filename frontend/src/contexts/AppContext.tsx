"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface AppContextProps {
  appIsLoading: boolean;
  setAppIsLoading: (isLoading: boolean) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [appIsLoading, setAppIsLoading] = useState<boolean>(true);

  return (
    <AppContext.Provider value={{ appIsLoading, setAppIsLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextProps => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
