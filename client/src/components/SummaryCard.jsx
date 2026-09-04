const TINTS = {
    green: { icon: "bg-green-50 text-green-600", label: "text-green-700" },
    red: { icon: "bg-red-50 text-red-500", label: "text-red-500" },
    blue: { icon: "bg-blue-50 text-blue-600", label: "text-blue-600" },
    purple: { icon: "bg-purple-50 text-purple-600", label: "text-purple-600" },
};

function SummaryCard({ title, value, description, icon: Icon, tint = "green", comingSoon = false }) {
    const style = TINTS[tint] || TINTS.green;

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
                <p className={`text-sm font-bold ${style.label}`}>{title}</p>

                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${style.icon}`}>
                    <Icon size={18} strokeWidth={2.25} />
                </div>
            </div>

            {comingSoon ? (
                <h2 className="text-lg font-bold text-gray-300">Coming soon</h2>
            ) : (
                <h2 className="text-3xl font-extrabold text-gray-900">{value}</h2>
            )}

            <p className="mt-1 text-xs text-gray-400">{description}</p>
        </div>
    );
}

export default SummaryCard;
