"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyTheme = (theme: Theme) => {
  if (typeof document === "undefined") {
    return;
  }
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
};

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = typeof window !== "undefined"
      ? (localStorage.getItem(STORAGE_KEY) as Theme | null)
      : null;
    const initial = stored ?? getSystemTheme();
    setTheme(initial);
    applyTheme(initial);

    if (stored) {
      return undefined;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (event: MediaQueryListEvent) => {
      const next: Theme = event.matches ? "dark" : "light";
      setTheme(next);
      applyTheme(next);
    };
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      aria-label="Toggle dark mode"
    >
      {theme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
}
