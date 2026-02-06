import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  const { speak } = useVoiceFeedback();

  return (
    <button
      onClick={() => {
        toggleTheme();
        speak(isDarkMode ? 'Light mode activated' : 'Dark mode activated');
      }}
      onMouseEnter={() => speak(isDarkMode ? 'Switch to light mode' : 'Switch to dark mode')}
      className="p-2 bg-white/10 hover:bg-white/20 dark:bg-gray-700/50 dark:hover:bg-gray-600/50 text-white rounded-lg transition"
      aria-label="Toggle theme"
    >
      {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
