"use client";

import { useCurrency } from "./CurrencyProvider";
import clsx from "clsx";

export function CurrencyToggle() {
  const { currency, setCurrency } = useCurrency();
  const options: Array<"AED" | "USD"> = ["AED", "USD"];

  return (
    <div
      role="radiogroup"
      aria-label="Currency"
      className="inline-flex items-center rounded-full border border-deep/15 p-0.5"
    >
      {options.map((c) => {
        const active = c === currency;
        return (
          <button
            key={c}
            role="radio"
            aria-checked={active}
            onClick={() => setCurrency(c)}
            className={clsx(
              "px-3 py-1 text-[11px] uppercase tracking-wider2 font-sans rounded-full",
              "transition-all duration-300 ease-couture",
              active ? "bg-deep text-canvas" : "text-ink/70 hover:text-copper"
            )}
          >
            {c}
          </button>
        );
      })}
    </div>
  );
}
