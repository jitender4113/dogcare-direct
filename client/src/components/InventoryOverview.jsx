function InventoryOverview({ categoryData, inventory }) {
    return (
        <div className="mt-8 rounded-[28px] bg-white p-7 shadow-sm">

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-extrabold text-[#193024]">
                        Inventory Overview
                    </h2>

                    <p className="mt-1 text-sm text-[#7D887F]">
                        Current stock levels by category
                    </p>
                </div>

                <button className="rounded-xl bg-[#EAF7EC] px-4 py-2 text-sm font-semibold text-[#3EAA62]">
                    View Inventory
                </button>
            </div>

            <div className="mt-7 space-y-6">
                {Object.entries(categoryData).map(([category, data]) => {
                    const percentage =
                        data.required > 0
                            ? Math.round(
                                  (data.quantity / data.required) * 100
                              )
                            : 0;

                    return (
                        <div key={category}>

                            <div className="mb-2 flex items-center justify-between">
                                <p className="text-sm font-bold text-[#193024]">
                                    {category}
                                </p>

                                <p className="text-sm font-semibold text-[#7D887F]">
                                    {data.quantity} / {data.required}
                                </p>
                            </div>

                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#EDF2ED]">
                                <div
                                    className="h-full rounded-full bg-[#54A86D]"
                                    style={{
                                        width: `${Math.min(percentage, 100)}%`,
                                    }}
                                ></div>
                            </div>

                            <p className="mt-1 text-xs text-[#9AA39C]">
                                {percentage}% stocked
                            </p>

                            <div className="mt-3 space-y-2">
                                {inventory
                                    .filter((item) => item.category === category)
                                    .map((item) => (
                                        <div
                                            key={item._id}
                                            className="flex items-center justify-between rounded-xl bg-[#F7FAF5] px-4 py-3"
                                        >
                                            <p className="text-sm font-medium text-[#193024]">
                                                {item.name}
                                            </p>

                                            <div className="flex items-center gap-3">

                                                <p className="text-xs font-semibold text-[#7D887F]">
                                                    {item.quantity} / {item.minimumRequired} {item.unit}
                                                </p>

                                                {item.needRestock ? (
                                                    <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-500">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600">
                                                        In Stock
                                                    </span>
                                                )}

                                            </div>
                                        </div>
                                    ))}
                            </div>

                        </div>
                    );
                })}
            </div>

        </div>
    );
}

export default InventoryOverview;