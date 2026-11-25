import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type BankingMode = "individual" | "business";

const KEY = "renda-mode";

const ModeContext = createContext<{
  mode: BankingMode;
  setMode: (m: BankingMode) => void;
}>({ mode: "individual", setMode: () => {} });

function isMode(v: string | null): v is BankingMode {
  return v === "business" || v === "individual";
}

function syncUrl(mode: BankingMode) {
  const url = new URL(window.location.href);
  if (url.searchParams.get("mode") !== mode) {
    url.searchParams.set("mode", mode);
    window.history.replaceState(window.history.state, "", url.toString());
  }
}

export function setStoredMode(mode: BankingMode) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, mode);
}

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<BankingMode>("individual");

  useEffect(() => {
    // The URL wins so the workspace opens in the same mode in a new tab or window.
    const fromUrl = new URLSearchParams(window.location.search).get("mode");
    const stored = window.localStorage.getItem(KEY);
    const next = isMode(fromUrl) ? fromUrl : isMode(stored) ? stored : "individual";
    setModeState(next);
    setStoredMode(next);
    syncUrl(next);
  }, []);

  function setMode(m: BankingMode) {
    setModeState(m);
    setStoredMode(m);
    syncUrl(m);
  }

  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}

export function useMode() {
  return useContext(ModeContext);
}

export function useIsBusiness() {
  return useContext(ModeContext).mode === "business";
}
