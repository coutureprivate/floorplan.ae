import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Couture Private Estates palette
        canvas: "#F4F4F4",      // 60% — page background
        ink:    "#333333",      // 30% — body text
        deep:   "#252504",      // 5%  — primary accent / luxe dark
        copper: "#8E5734",      // 5%  — highlight / interactive
        // Warmer / layered neutrals so the surface stops feeling clinical
        bone:   "#EDE9DE",      // warm card / panel tint
        stone:  "#E2DDD0",      // mid-warm surface
        clay:   "#3B3722",      // soft alternate for dark sections
        // Functional availability tints
        avail: {
          available: "#5C7A4E",
          reserved:  "#B5893F",
          sold:      "#8C3A3A",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif-display)", "Georgia", "serif"],
        sans:  ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        wider2: "0.12em",
        wider3: "0.18em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(37,37,4,0.04), 0 8px 24px rgba(37,37,4,0.06)",
        lift: "0 2px 4px rgba(37,37,4,0.06), 0 18px 48px rgba(37,37,4,0.10)",
      },
      transitionTimingFunction: {
        couture: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
