'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface PrideContextValue {
  pride: boolean;
  toggle: () => void;
}

const PrideContext = createContext<PrideContextValue>({ pride: false, toggle: () => {} });

export function usePride() {
  return useContext(PrideContext);
}

export function PrideProvider({ children }: { children: ReactNode }) {
  // Inline script in layout.tsx <head> sets data-pride before hydration.
  const [pride, setPrideState] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-pride') === 'true';
    }
    return false;
  });

  const setPride = useCallback((on: boolean) => {
    setPrideState(on);
    document.documentElement.setAttribute('data-pride', String(on));
    localStorage.setItem('siedels-pride', on ? 'true' : 'false');
  }, []);

  const toggle = useCallback(() => {
    setPride(!pride);
  }, [pride, setPride]);

  return (
    <PrideContext.Provider value={{ pride, toggle }}>
      {children}
    </PrideContext.Provider>
  );
}
