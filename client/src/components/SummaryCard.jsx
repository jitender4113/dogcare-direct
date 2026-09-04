function SummaryCard({ title, value, description, icon }) {
    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-semibold text-gray-500">
                    {title}
                </p>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-lg">
                    {icon}
                </div>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900">
                {value}
            </h2>

            <p className="mt-1 text-xs text-gray-400">
                {description}
            </p>

        </div>
    );
}

export default SummaryCard;