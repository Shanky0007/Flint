import { useTheme } from "../../hooks/useTheme";

export default function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary dark:bg-primary-500 text-primary-50 dark:text-primary-50 shadow-lg hover:scale-110 transition-transform duration-200 flex items-center justify-center text-2xl z-[1000]"
      aria-label="Toggle theme"
    >
      {mode === "light" ? "🌙" : "☀️"}
    </button>
  );
}
