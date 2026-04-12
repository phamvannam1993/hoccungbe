'use client';

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type AppPageName =
  | 'home'
  | 'courses'
  | 'games'
  | 'progress'
  | 'lesson'
  | 'dashboard'
  | 'pricing'
  | 'support'
  | 'login'
  | 'register';

type AppPageContextType = {
  page: AppPageName;
  setPage: (page: AppPageName) => void;
};

const AppPageContext = createContext<AppPageContextType | null>(null);

export default function AppPageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [page, setPage] = useState<AppPageName>('home');

  const value = useMemo(
    () => ({
      page,
      setPage,
    }),
    [page]
  );

  return (
    <AppPageContext.Provider value={value}>
      {children}
    </AppPageContext.Provider>
  );
}

export function useAppPage() {
  const context = useContext(AppPageContext);

  if (!context) {
    throw new Error('useAppPage must be used inside AppPageProvider');
  }

  return context;
}