import { LayoutDashboard, Package, Gift, ClipboardList, Users, BarChart3, Plus, Heart, FileText } from "lucide-react";
import NavItem from "./NavItem";

const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, view: "dashboard" },
    { name: "Inventory", icon: Package, view: "inventory" },
    { name: "Donations", icon: Gift },
    { name: "Requests", icon: ClipboardList },
    { name: "Users", icon: Users },
    { name: "Reports", icon: BarChart3 },
];

const quickActions = [
    { name: "Add New Item", icon: Plus, tint: "bg-green-100 text-green-700" },
    { name: "Request Donation", icon: Heart, tint: "bg-red-100 text-red-500" },
    { name: "Generate Report", icon: FileText, tint: "bg-blue-100 text-blue-600" },
];

function Sidebar({ isOpen = false, onClose = () => {}, activePage = "dashboard", onNavigate }) {
    return (
        <>
            {/* Mobile scrim */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-[#E8EEE8] bg-white px-5 py-7 transition-transform duration-200
                ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
                md:w-20 md:px-3 lg:w-64 lg:px-5`}
            >
                {/* Logo */}
                <div className="flex items-center gap-3 px-2 md:justify-center lg:justify-start">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E5F6E7] text-2xl">
                        🐾
                    </div>
                    <div className="md:hidden lg:block">
                        <h2 className="text-[17px] font-extrabold leading-none">DogCare</h2>
                        <p className="mt-1 text-[12px] font-bold text-[#3EAA62]">Direct</p>
                    </div>
                </div>

                {/* Navigation */}
                <p className="mt-5 mb-3 px-2 text-xs font-bold tracking-widest text-gray-400 md:hidden lg:block">
                    MENU
                </p>

                <nav className="flex flex-col gap-1">
                    {menuItems.map((item) => (
                        <NavItem
                            key={item.name}
                            item={item}
                            isActive={Boolean(item.view) && item.view === activePage}
                            onClick={item.view && onNavigate ? () => onNavigate(item.view) : undefined}
                        />
                    ))}
                </nav>

                <p className="mt-6 mb-2 px-2 text-xs font-bold tracking-widest text-gray-400 md:hidden lg:block">
                    QUICK ACTIONS
                </p>

                <div className="flex flex-col gap-1 md:hidden lg:flex">
                    {quickActions.map((action) => (
                        <button
                            key={action.name}
                            className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-left text-sm font-semibold text-[#193024] transition hover:bg-gray-50"
                        >
                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${action.tint}`}>
                                <action.icon size={15} strokeWidth={2.5} />
                            </span>
                            {action.name}
                        </button>
                    ))}
                </div>

                {/* Pet card */}
                <div className="mt-auto md:hidden lg:block">
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
                        <div className="text-3xl">🐶</div>
                        <p className="mt-2 text-sm font-bold text-gray-700">Every pup deserves</p>
                        <p className="text-xs text-gray-500">love &amp; care ❤️</p>
                    </div>

                    <div className="mt-5 flex items-center gap-3 border-t pt-4">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E5F6E7] text-sm">
                            🧑‍💼
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-700">Admin</p>
                            <p className="text-xs text-gray-400">Shelter Admin</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
