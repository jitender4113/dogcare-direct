function NavItem({ item }) {
    const isActive = item.active;
    return (
        <button
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                isActive
                    ? "bg-green-100 text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
            }`}
        >
            <span className="w-6 text-center">
                {item.icon}
            </span>

            {item.name}
        </button>
    );
}

export default NavItem;