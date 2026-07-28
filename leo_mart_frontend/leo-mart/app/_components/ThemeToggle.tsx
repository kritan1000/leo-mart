"use client";

import React from "react";
import { useTheme } from "@/lib/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="relative w-14 h-7 rounded-full bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 dark:from-slate-600 dark:via-slate-500 dark:to-indigo-500 p-0.5 transition-all duration-500 ease-in-out hover:shadow-lg hover:shadow-purple-500/25 dark:hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-purple-500/40 group"
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          theme === "dark" ? "left-[calc(100%-1.75rem)]" : "left-0.5"
        }`}
      >
        {theme === "light" ? (
          <svg
            className="w-3.5 h-3.5 text-amber-500 animate-[spin_0s_linear]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-3.5 h-3.5 text-indigo-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </div>
    </button>
  );
}
