'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import IconButton from '../IconButton/IconButton';

const themeButtonIconMap: Record<'dark' | 'light' | 'system', string> = {
  dark: 'moon',
  light: 'sun',
  system: 'monitor',
} as const;

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div aria-hidden className="h-9 w-32" />;
  }
  const currentTheme = resolvedTheme === 'dark' ? 'dark' : 'light';
  const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

  return (
    <div aria-label="Color theme">
      <IconButton
        icon={themeButtonIconMap[theme as 'dark' | 'light']}
        variant="ghost"
        title="Toggle theme"
        onClick={() => setTheme(nextTheme)}
      />
    </div>
  );
}
