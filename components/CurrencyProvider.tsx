"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Currency = "AED" | "USD";

// Fixed mock rate — AED is pegged to USD around 3.6725
const AED_PER_USD = 3.6725;

type CurrencyCtx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (aed: number) => string;
};

const Ctx = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("AED");

  // Persist user choice across pages
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("cpe-currency") : null;
    if (stored === "AED" || stored === "USD") setCurrency(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cpe-currency", currency);
    }
  }, [currency]);

  const value = useMemo<CurrencyCtx>(
    () => ({
      currency,
      setCurrency,
      format: (aed: number) => {
        if (currency === "AED") {
          return `AED ${aed.toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
        }
        const usd = aed / AED_PER_USD;
        return `USD ${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
      },
    }),
    [currency]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
