function NavItem({ item, isActive, onClick }) {
    const Icon = item.icon;
    const clickable = Boolean(onClick);

    return (
        <button
            onClick={onClick}
            disabled={!clickable}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition md:justify-center lg:justify-start ${
                isActive
                    ? "bg-[#3EAA62] text-white shadow-sm shadow-green-200"
                    : clickable
                    ? "text-gray-500 hover:bg-gray-100"
                    : "text-gray-300"
            }`}
        >
            <Icon size={17} strokeWidth={2.25} className="shrink-0" />
            <span className="md:hidden lg:inline">{item.name}</span>
        </button>
    );
}

export default NavItem;
