function FoodOverview({ categoryData }) {
    const food = categoryData["Food"];

    if (!food) {
        return null;
    }

    const fulfillment =
        food.required > 0
            ? Math.round((food.quantity / food.required) * 100)
            : 0;

    const needed = Math.max(food.required - food.quantity, 0);

    return (
        <div className="mt-8 overflow-hidden rounded-[28px] border border-[#F2E7D8] bg-[#FFFBF5] p-8 shadow-sm">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0D9] text-3xl">
                        🥣
                    </div>

                    <div>
                        <h2 className="text-2xl font-extrabold text-[#193024]">
                            Food
                        </h2>

                        <p className="mt-1 text-sm text-[#7D887F]">
                            Track food inventory and fulfill your furry friends&apos; needs
                        </p>
                    </div>
                </div>

                <button className="rounded-xl bg-[#F28C18] px-5 py-3 text-sm font-bold text-white">
                    View Low Stock Items →
                </button>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[180px_1fr_1fr_1fr]">

                {/* Fulfillment */}
                <div className="flex flex-col items-center justify-center">
                    <div className="flex h-36 w-36 items-center justify-center rounded-full border-[12px] border-[#F28C18]">
                        <div className="text-center">
                            <p className="text-3xl font-extrabold text-[#193024]">
                                {Math.min(fulfillment, 100)}%
                            </p>

                            <p className="text-xs text-[#7D887F]">
                                Fulfillment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Required */}
                <div className="border-l border-[#EDE3D7] pl-6">
                    <p className="text-sm text-[#7D887F]">
                        Total Required
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#193024]">
                        {food.required}
                        <span className="ml-1 text-base">units</span>
                    </p>

                    <p className="mt-1 text-xs text-[#9AA39C]">
                        Across all food items
                    </p>
                </div>

                {/* Available */}
                <div className="border-l border-[#EDE3D7] pl-6">
                    <p className="text-sm text-[#7D887F]">
                        Total Available
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-[#193024]">
                        {food.quantity}
                        <span className="ml-1 text-base">units</span>
                    </p>

                    <p className="mt-1 text-xs text-[#9AA39C]">
                        Across all food items
                    </p>
                </div>

                {/* Needed */}
                <div className="border-l border-[#EDE3D7] pl-6">
                    <p className="text-sm text-[#7D887F]">
                        Overall Needed
                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-red-500">
                        {needed}
                        <span className="ml-1 text-base">units</span>
                    </p>

                    <p className="mt-1 text-xs font-semibold text-red-400">
                        {Math.max(100 - fulfillment, 0)}% needed
                    </p>
                </div>

            </div>

            {/* Warning */}
            {needed > 0 && (
                <div className="mt-7 flex items-center gap-3 rounded-2xl bg-[#FFF0F0] px-5 py-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-500">
                        !
                    </div>

                    <div>
                        <p className="text-sm font-bold text-red-500">
                            Food stock is running low!
                        </p>

                        <p className="text-xs text-[#7D887F]">
                            {Math.max(100 - fulfillment, 0)}% of total food requirement is still needed.
                        </p>
                    </div>
                </div>
            )}

        </div>
    );
}

export default FoodOverview;