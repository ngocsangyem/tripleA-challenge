import { ref, watch } from 'vue';

type Theme = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'triplea-theme';

const theme = ref<Theme>('system');

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (newTheme: Theme): void => {
  const root = document.documentElement;
  const effectiveTheme = newTheme === 'system' ? getSystemTheme() : newTheme;

  if (effectiveTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useTheme = () => {
  const setTheme = (newTheme: Theme): void => {
    theme.value = newTheme;
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  };

  const initTheme = (): void => {
    // Get theme from localStorage or default to system
    const storedTheme = (localStorage.getItem(STORAGE_KEY) as Theme) || 'system';
    theme.value = storedTheme;
    applyTheme(storedTheme);

    // Listen for system theme changes
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (theme.value === 'system') {
          applyTheme('system');
        }
      };

      // Modern browsers
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      }
    }
  };

  // Watch for theme changes
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
  });

  return {
    theme,
    setTheme,
    initTheme,
  };
};
