import Link from "next/link";

export function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: { primary: "text-base", secondary: "text-[9px]" },
    md: { primary: "text-xl",   secondary: "text-[10px]" },
    lg: { primary: "text-3xl",  secondary: "text-xs" },
  }[size];

  return (
    <Link
      href="/"
      className="group inline-flex flex-col leading-none select-none"
      aria-label="Floor plan — Home"
    >
      <span
        className={`font-serif font-light tracking-wider2 text-deep ${sizes.primary} transition-colors duration-500 ease-couture group-hover:text-copper`}
      >
        Floor plan
      </span>
      <span
        className={`eyebrow mt-1 text-deep/60 ${sizes.secondary} transition-colors duration-500 ease-couture group-hover:text-copper/80`}
      >
        Couture Private Estates
      </span>
    </Link>
  );
}
