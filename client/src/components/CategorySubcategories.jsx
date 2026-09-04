import { getSubcategoryIcon, SUBCATEGORY_PALETTE } from "../theme/categoryTheme";
import { clampPct } from "../utils/inventoryHelpers";

/**
 * One horizontal-scroll row of subcategory cards for `category`.
 *
 * The list of subcategories comes from `inventoryCategories[category]` —
 * the backend's own definition — not from whatever happens to have stock
 * right now. That's what makes a brand-new subcategory show up
 * automatically (at 0%) the moment it's added on the backend, even
 * before any item exists in it.
 */
function CategorySubcategories({ category, subCategoryNames, subCategorySummary }) {
    if (!subCategoryNames || subCategoryNames.length === 0) return null;

    return (
        <div className="mt-6 rounded-[28px] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-[#193024]">
                        {category} Subcategories
                    </h2>
                    <p className="mt-1 text-sm text-[#7D887F]">Breakdown by subcategory</p>
                </div>

                <button className="text-sm font-semibold text-[#54A86D]">
                    View all {category.toLowerCase()} items →
                </button>
            </div>

            <div className="mt-6 overflow-x-auto pb-3">
                <div className="flex w-max gap-4">
                    {subCategoryNames.map((name, index) => {
                        const summary = subCategorySummary?.find(
                            (row) => row.category === category && row.subCategory === name
                        );

                        const quantity = summary?.totalQuantity ?? 0;
                        const required = summary?.totalRequired ?? 0;
                        const needed = summary?.neededQuantity ?? 0;
                        const percentage = clampPct(summary?.stockPercentage ?? 0);
                        const hasStock = Boolean(summary);

                        const style = SUBCATEGORY_PALETTE[index % SUBCATEGORY_PALETTE.length];
                        const Icon = getSubcategoryIcon(name);

                        return (
                            <div
                                key={name}
                                className={`w-[180px] shrink-0 rounded-2xl border border-gray-100 ${style.bg} p-4 transition hover:-translate-y-1 hover:shadow-md`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg}`}
                                        style={{ color: style.color }}
                                    >
                                        <Icon size={19} strokeWidth={2} />
                                    </div>
                                    <p className="truncate text-sm font-extrabold text-[#193024]">{name}</p>
                                </div>

                                {/* Progress ring */}
                                <div className="mt-5 flex justify-center">
                                    <div className="relative h-[82px] w-[82px]">
                                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="#E5E7EB" strokeWidth="9" />
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke={style.color}
                                                strokeWidth="9"
                                                strokeLinecap="round"
                                                pathLength="100"
                                                strokeDasharray={`${percentage} 100`}
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-extrabold" style={{ color: style.color }}>
                                                {percentage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-sm font-extrabold text-[#193024]">
                                        {quantity} / {required}
                                    </p>
                                    <p className="mt-1 text-[11px] font-medium text-[#7D887F]">
                                        Stock / Required
                                    </p>
                                </div>

                                <div className="mt-3 rounded-xl bg-white/80 px-2 py-2 text-center">
                                    {hasStock ? (
                                        needed > 0 ? (
                                            <p className="text-xs font-bold text-red-500">{needed} needed</p>
                                        ) : (
                                            <p className="text-xs font-bold text-green-600">Fully stocked</p>
                                        )
                                    ) : (
                                        <p className="text-xs font-semibold text-gray-400">No items yet</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default CategorySubcategories;
