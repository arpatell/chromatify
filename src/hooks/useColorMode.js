import { useEffect, useState } from 'react';

const STORAGE_KEY = 'chromatify-theme';

export const useColorMode = () => {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#121719' : '#f0f0e9');
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Theme switching still works when browser storage is disabled.
    }
  }, [mode]);

  return [mode, () => setMode((current) => current === 'dark' ? 'light' : 'dark')];
};
