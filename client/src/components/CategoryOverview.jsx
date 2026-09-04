import { getCategoryTheme } from "../theme/categoryTheme";

/**
 * The hero card for one inventory category — same visual pattern as the
 * original Food-only overview, now driven entirely by `summary` (a row
 * from the API's categorySummary array) and `category` (the name), so it
 * renders correctly for any category the backend returns.
 */
function CategoryOverview({ category, summary }) {
    if (!summary) return null;

    const theme = getCategoryTheme(category);
    const Icon = theme.icon;

    const fulfillment = Math.min(summary.stockPercentage ?? 0, 100);
    const needed = summary.neededQuantity ?? 0;
    const neededPct = Math.max(100 - fulfillment, 0);

    return (
        <div
            className="mt-8 overflow-hidden rounded-[28px] border p-8 shadow-sm"
            style={{ backgroundColor: theme.heroBg, borderColor: theme.heroBorder }}
        >
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                    <div
                        className="flex h-14 w-14 items-center justify-center rounded-2xl"
                        style={{ backgroundColor: theme.accentSoft, color: theme.accent }}
                    >
                        <Icon size={26} strokeWidth={2} />
                    </div>

                    <div>
                        <h2 className="text-2xl font-extrabold text-[#193024]">{category}</h2>
                        <p className="mt-1 text-sm text-[#7D887F]">{theme.tagline}</p>
                    </div>
                </div>

                {needed > 0 && (
                    <button
                        className="whitespace-nowrap rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                        style={{ backgroundColor: theme.accent }}
                    >
                        View Low Stock Items →
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr_1fr_1fr]">
                {/* Fulfillment ring */}
                <div className="flex flex-col items-center justify-center">
                    <div
                        className="flex h-36 w-36 items-center justify-center rounded-full border-[12px]"
                        style={{ borderColor: theme.accent }}
                    >
                        <div className="text-center">
                            <p className="text-3xl font-extrabold text-[#193024]">{fulfillment}%</p>
                            <p className="text-xs text-[#7D887F]">Fulfillment</p>
                        </div>
                    </div>
                </div>

                <div className="border-l pl-6" style={{ borderColor: theme.heroBorder }}>
                    <p className="text-sm text-[#7D887F]">Total Required</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#193024]">
                        {summary.totalRequired}
                        <span className="ml-1 text-base">units</span>
                    </p>
                    <p className="mt-1 text-xs text-[#9AA39C]">Across all {category.toLowerCase()} items</p>
                </div>

                <div className="border-l pl-6" style={{ borderColor: theme.heroBorder }}>
                    <p className="text-sm text-[#7D887F]">Total Available</p>
                    <p className="mt-2 text-3xl font-extrabold text-[#193024]">
                        {summary.totalQuantity}
                        <span className="ml-1 text-base">units</span>
                    </p>
                    <p className="mt-1 text-xs text-[#9AA39C]">Across all {category.toLowerCase()} items</p>
                </div>

                <div className="border-l pl-6" style={{ borderColor: theme.heroBorder }}>
                    <p className="text-sm text-[#7D887F]">Overall Needed</p>
                    <p className="mt-2 text-3xl font-extrabold text-red-500">
                        {needed}
                        <span className="ml-1 text-base">units</span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-red-400">{neededPct}% needed</p>
                </div>
            </div>

            {/* Low stock warning */}
            {needed > 0 && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl bg-[#FFF0F0] px-5 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500">
                        !
                    </div>
                    <div>
                        <p className="text-sm font-bold text-red-500">{category} stock is running low!</p>
                        <p className="text-xs text-[#7D887F]">
                            {neededPct}% of total {category.toLowerCase()} requirement is still needed.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategoryOverview;
