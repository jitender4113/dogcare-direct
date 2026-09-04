import NavItem from "./NavItem";

function Sidebar() {

    const menuItems = [
        {
            name: "Dashboard",
            icon: "🏠",
            active: true,
        },
        {
            name: "Inventory",
            icon: "📦",
        },
        {
            name: "Donations",
            icon: "🎁",
        },
        {
            name: "Requests",
            icon: "📋",
        },
        {
            name: "Users",
            icon: "👥",
        },
        {
            name: "Reports",
            icon: "📊",
        },
    ];

    return (

        <aside className="fixed left-0 top-0 z-20 flex h-screen w-64 flex-col border-r border-[#E8EEE8] bg-white px-5 py-7">

            {/* Logo */}
            <div className="flex items-center gap-3 px-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5F6E7] text-2xl">
                    🐾
                </div>
                <div>
                    <h2 className="text-[17px] font-extrabold leading-none">
                        DogCare
                    </h2>
                    <p className="mt-1 text-[12px] font-bold text-[#3EAA62]">
                        Direct
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <p className="mt-5 mb-3 px-2 text-xs font-bold tracking-widest text-gray-400">
                MENU
            </p>

            <nav className="flex flex-col gap-1">
                
                {menuItems.map((item) => {
                    return (
                        // <button
                        //     key={item.name}
                        //     className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                        //         item.active
                        //             ? "bg-green-100 text-green-700"
                        //             : "text-gray-500 hover:bg-gray-100"
                        //     }`}
                        // >
                        //     <span className="w-6 text-center text-base">
                        //         {item.icon}
                        //     </span>

                        //     {item.name}
                        // </button>
                        <NavItem
                            key={item.name}
                            item={item}
                        />
                    );
                })}

            </nav>

            {/*pet card */}

            <div className="mt-auto">
                <div className="rounded-2xl bg-green-50 p-4">
                    <div className="text-3xl">
                        🐶
                    </div>
                    <p className="mt-2 text-sm font-bold text-gray-700">
                        Every pup deserves
                    </p>
                    <p className="text-xs text-gray-500">
                        love & care ❤️
                    </p>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t pt-4">
                    <div>
                        <p className="text-sm font-bold text-gray-700">
                            Admin
                        </p>
                        <p className="text-xs text-gray-400">
                            Shelter Admin
                        </p>
                    </div>
                </div>
            </div>

        </aside>

    );

}

export default Sidebar;