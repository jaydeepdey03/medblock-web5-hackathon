"use client";

import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export default function Toggletheme() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <button
        onClick={
          theme === "dark" ? () => setTheme("light") : () => setTheme("dark")
        }
        className="inline-flex aspect-square w-10 items-center justify-center rounded bg-slate-200 font-bold text-gray-800 hover:bg-gray-400"
      >
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </button>
    </>
  );
}
