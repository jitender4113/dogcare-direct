export function clampPct(n) {
    const num = Number(n);
    if (!isFinite(num)) return 0;
    return Math.max(0, Math.min(100, Math.round(num)));
}

/** Stock tier used for coloring rings, bars, and badges everywhere. */
export function tierForPct(pct) {
    if (pct >= 80) return "good";
    if (pct >= 50) return "warn";
    return "bad";
}

export const TIER_COLOR = {
    good: "#3EAA62",
    warn: "#F28C18",
    bad: "#EF5B62",
};

export const TIER_LABEL = {
    good: "In Stock",
    warn: "Watch",
    bad: "Low Stock",
};
