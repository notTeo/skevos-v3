import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className={className ? `${styles.button} ${className}` : styles.button}
      aria-label={t(isDark ? 'navbar.themeLight' : 'navbar.themeDark')}
      onClick={toggleTheme}
    >
      {isDark ? <Sun size={19} strokeWidth={1.75} /> : <Moon size={19} strokeWidth={1.75} />}
    </button>
  );
}
