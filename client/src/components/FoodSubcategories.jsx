// function FoodSubcategories({ inventory, categories }) {
//     const foodSubcategories = categories?.Food || [];

//     return (
//         <div className="mt-6 rounded-[28px] bg-white p-7 shadow-sm">
//             <div className="flex items-center justify-between">
//                 <div>
//                     <h2 className="text-xl font-extrabold text-[#193024]">
//                         Food Subcategories 🍖
//                     </h2>

//                     <p className="mt-1 text-sm text-[#7D887F]">
//                         Breakdown by food type
//                     </p>
//                 </div>

//                 <button className="text-sm font-semibold text-[#54A86D]">
//                     View all food items →
//                 </button>
//             </div>

//             {/* Horizontal scroll container */}
//             <div className="mt-6 overflow-x-auto pb-3">
//                 <div className="flex w-max gap-3">
//                     {foodSubcategories.map((name) => {
//                         const items = inventory.filter(
//                             (item) =>
//                                 item.category === "Food" &&
//                                 item.subCategory === name
//                         );

//                         const quantity = items.reduce(
//                             (total, item) => total + item.quantity,
//                             0
//                         );

//                         const required = items.reduce(
//                             (total, item) =>
//                                 total + item.minimumRequired,
//                             0
//                         );

//                         const percentage =
//                             required > 0
//                                 ? Math.round(
//                                       (quantity / required) * 100
//                                   )
//                                 : 0;

//                         const needed = Math.max(
//                             required - quantity,
//                             0
//                         );

//                         return (
//                             <div
//                                 key={name}
//                                 className="w-[180px] shrink-0 rounded-2xl border border-gray-100 bg-white p-4"
//                             >
//                                 {/* Name */}
//                                 <div className="flex items-center gap-2">
//                                     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF3E4] text-lg">
//                                         🦴
//                                     </div>

//                                     <p className="truncate text-sm font-bold text-[#193024]">
//                                         {name}
//                                     </p>
//                                 </div>

//                                 {/* Percentage */}
//                                 <div className="mt-4 flex justify-center">
//                                     <div className="flex h-16 w-16 items-center justify-center rounded-full border-[6px] border-[#54A86D]">
//                                         <span className="text-sm font-extrabold text-[#193024]">
//                                             {Math.min(
//                                                 percentage,
//                                                 100
//                                             )}
//                                             %
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Quantity */}
//                                 <p className="mt-3 text-center text-xs font-semibold text-[#7D887F]">
//                                     {quantity} / {required} units
//                                 </p>

//                                 {/* Needed */}
//                                 <p className="mt-2 text-center text-xs font-bold text-red-500">
//                                     {needed} needed
//                                 </p>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default FoodSubcategories;

function FoodSubcategories({ categories, subCategorySummary }) {
    const foodSubcategories = categories?.Food || [];

    const colors = [
        {
            bg: "bg-green-50",
            iconBg: "bg-green-100",
            color: "#3EAA62",
        },
        {
            bg: "bg-orange-50",
            iconBg: "bg-orange-100",
            color: "#F28C18",
        },
        {
            bg: "bg-blue-50",
            iconBg: "bg-blue-100",
            color: "#3B82F6",
        },
        {
            bg: "bg-red-50",
            iconBg: "bg-red-100",
            color: "#EF5B62",
        },
        {
            bg: "bg-purple-50",
            iconBg: "bg-purple-100",
            color: "#9B6BCB",
        },
        {
            bg: "bg-cyan-50",
            iconBg: "bg-cyan-100",
            color: "#14B8A6",
        },
    ];

    return (
        <div className="mt-6 rounded-[28px] bg-white p-7 shadow-sm">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-[#193024]">
                        Food Subcategories 🍖
                    </h2>

                    <p className="mt-1 text-sm text-[#7D887F]">
                        Breakdown by food type
                    </p>
                </div>

                <button className="text-sm font-semibold text-[#54A86D]">
                    View all food items →
                </button>
            </div>

            {/* Horizontal Scroll */}
            <div className="mt-6 overflow-x-auto pb-3">
                <div className="flex w-max gap-4">

                    {foodSubcategories.map((name, index) => {

                        const summary = subCategorySummary?.find(
                            (item) =>
                                item.category === "Food" &&
                                item.subCategory === name
                        );

                        /*
                         * ALL VALUES ARE FROM BACKEND
                         */
                        const quantity =
                            summary?.totalQuantity ?? 0;

                        const required =
                            summary?.totalRequired ?? 0;

                        const needed =
                            summary?.neededQuantity ?? 0;

                        const percentage =
                            Number(summary?.stockPercentage) || 0;

                        const style =
                            colors[index % colors.length];

                        return (
                            <div
                                key={name}
                                className={`w-[180px] shrink-0 rounded-2xl border border-gray-100 ${style.bg} p-4 transition hover:-translate-y-1 hover:shadow-md`}
                            >

                                {/* Icon + Name */}
                                <div className="flex items-center gap-3">

                                    <div
                                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${style.iconBg} text-xl`}
                                    >
                                        🐾
                                    </div>

                                    <p className="truncate text-sm font-extrabold text-[#193024]">
                                        {name}
                                    </p>

                                </div>

                                {/* Progress Circle */}
                                <div className="mt-5 flex justify-center">

                                    <div className="relative h-[82px] w-[82px]">

                                        <svg
                                            className="h-full w-full -rotate-90"
                                            viewBox="0 0 100 100"
                                        >

                                            {/* Background Circle */}
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="42"
                                                fill="none"
                                                stroke="#E5E7EB"
                                                strokeWidth="9"
                                            />

                                            {/* Progress Circle */}
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

                                        {/* Percentage */}
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span
                                                className="text-lg font-extrabold"
                                                style={{
                                                    color: style.color,
                                                }}
                                            >
                                                {percentage}%
                                            </span>
                                        </div>

                                    </div>

                                </div>

                                {/* Backend Numbers */}
                                <div className="mt-4 text-center">

                                    <p className="text-sm font-extrabold text-[#193024]">
                                        {quantity} / {required}
                                    </p>

                                    <p className="mt-1 text-[11px] font-medium text-[#7D887F]">
                                        Stock / Required
                                    </p>

                                </div>

                                {/* Needed */}
                                <div className="mt-3 rounded-xl bg-white/80 px-2 py-2 text-center">

                                    <p className="text-xs font-bold text-red-500">
                                        {needed} needed
                                    </p>

                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        </div>
    );
}

export default FoodSubcategories;