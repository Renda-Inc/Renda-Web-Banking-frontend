import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Appearance = "light" | "dark" | "system";

type ThemeContextValue = {
  appearance: Appearance;
  setAppearance: (value: Appearance) => void;
  resolved: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue>({
  appearance: "system",
  setAppearance: () => {},
  resolved: "light",
});

const STORAGE_KEY = "renda-appearance";

function systemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearanceState] = useState<Appearance>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  const apply = useCallback((value: Appearance) => {
    const dark = value === "dark" || (value === "system" && systemPrefersDark());
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    setResolved(dark ? "dark" : "light");
  }, []);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Appearance | null) ?? "system";
    setAppearanceState(stored);
    apply(stored);
  }, [apply]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (appearance === "system") apply("system");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [appearance, apply]);

  const setAppearance = useCallback(
    (value: Appearance) => {
      setAppearanceState(value);
      localStorage.setItem(STORAGE_KEY, value);
      apply(value);
    },
    [apply],
  );

  return (
    <ThemeContext.Provider value={{ appearance, setAppearance, resolved }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
