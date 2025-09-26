import { useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook to manage theme (light/dark mode).
 * @returns An object containing the current theme mode and a function to toggle it.
 */
export function useTheme() {
    const [isDarkMode, setIsDarkMode] = useLocalStorage('theme-dark-mode', false);

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, [setIsDarkMode]);

    // Listen for system theme changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            // Only auto-change if user hasn't manually set a preference
            const hasUserPreference = localStorage.getItem('theme-dark-mode') !== null;
            if (!hasUserPreference) {
                setIsDarkMode(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [setIsDarkMode]);

    return {
        isDarkMode,
        toggleTheme
    };
}