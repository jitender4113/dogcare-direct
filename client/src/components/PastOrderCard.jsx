const STATUS_STYLES = {
    Delivered: "bg-green-50 text-green-600",
    Confirmed: "bg-blue-50 text-blue-600",
    Pending: "bg-orange-50 text-orange-600",
};

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function formatCurrency(amount) {
    if (typeof amount !== "number") return amount;
    return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * `order` is intentionally limited to public-safe fields: donor name,
 * shelter name, donated items, amount, date, id, and status. Never pass
 * phone/email/address/payment data into this component.
 */
function PastOrderCard({ order }) {
    const statusStyle = STATUS_STYLES[order.status] || "bg-gray-50 text-gray-500";
    const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-extrabold text-[#193024]">{order.donorName}</p>
                    <p className="mt-0.5 text-xs text-[#7D887F]">donated to {order.shelterName}</p>
                </div>
                <span
                    className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyle}`}
                >
                    {order.status}
                </span>
            </div>

            <div className="mt-4 space-y-1.5">
                {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-[#193024]">{item.name}</span>
                        <span className="font-semibold text-[#7D887F]">
                            {item.quantity} {item.unit}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4 text-xs">
                <div>
                    <p className="font-bold text-[#193024]">{formatCurrency(order.amount)}</p>
                    <p className="mt-0.5 text-[#9AA39C]">{totalQuantity} item(s) total</p>
                </div>
                <div className="text-right text-[#9AA39C]">
                    <p>{formatDate(order.date)}</p>
                    <p className="mt-0.5 font-mono">{order.id}</p>
                </div>
            </div>
        </div>
    );
}

export default PastOrderCard;