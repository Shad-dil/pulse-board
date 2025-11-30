// src/lib/format.ts
export function fmtNumber(n: number | string | undefined) {
  const v = Number(n || 0);
  return v.toLocaleString();
}

export function fmtCurrency(n: number | string | undefined) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function fmtCurrency2(n: number | string | undefined) {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

export function fmtPercent(n: number | string | undefined, digits = 2) {
  const v = Number(n || 0);
  return `${v.toFixed(digits)}%`;
}

export function fmtDateShort(iso: string | Date) {
  const d = typeof iso === "string" ? new Date(iso) : iso;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
