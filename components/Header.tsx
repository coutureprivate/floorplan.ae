"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Wordmark } from "./Wordmark";
import { CurrencyToggle } from "./CurrencyToggle";

const NAV = [
  { href: "/projects", label: "Projects" },
  { href: "/compare",  label: "Compare" },
  { href: "/about",    label: "About" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-bone/85 backdrop-blur border-b border-deep/10">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between gap-6">
        <Wordmark size="md" />

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-4 py-2 text-[12px] uppercase tracking-wider2 font-sans",
                  "transition-colors duration-300 ease-couture relative",
                  active ? "text-deep" : "text-ink/65 hover:text-copper"
                )}
              >
                {item.label}
                <span
                  className={clsx(
                    "absolute left-4 right-4 -bottom-0.5 h-px bg-copper origin-left",
                    "transition-transform duration-500 ease-couture",
                    active ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <CurrencyToggle />
          {/* <span className="hidden sm:inline eyebrow text-ink/50">Broker</span> */}
        </div>
      </div>
    </header>
  );
}
