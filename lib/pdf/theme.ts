export const PDF_COLORS = {
  canvas: "#F4F4F4",
  ink: "#333333",
  deep: "#252504",
  copper: "#8E5734",
  rule: "#252504",
  muted: "#7A7A6E",
} as const;

export function formatAed(aed: number): string {
  return `AED ${aed.toLocaleString("en-AE", { maximumFractionDigits: 0 })}`;
}

export function formatUsd(aed: number): string {
  const usd = aed / 3.6725;
  return `USD ${usd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}
