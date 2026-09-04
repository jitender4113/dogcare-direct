import { useEffect, useState } from "react";
import { Package, AlertTriangle, Gift, ClipboardList } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SummaryCard from "../components/SummaryCard";
import CategoryOverview from "../components/CategoryOverview";
import CategorySubcategories from "../components/CategorySubcategories";
import InventoryOverview from "../components/InventoryOverview";

import { subscribeToInventory } from "../services/inventoryService";

function Dashboard({ activePage = "dashboard", onNavigate }) {
    const [inventory, setInventory] = useState({
        items: [],
        categorySummary: [],
        subCategorySummary: [],
        inventoryCategories: {},
    });
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToInventory(
            (data) => {
                setInventory(data);
                setStatus("ready");
            },
            () => setStatus("error")
        );
        return unsubscribe;
    }, []);

    const { items, categorySummary, subCategorySummary, inventoryCategories } = inventory;

    // KPIs — derived straight from backend data, nothing invented.
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    const lowStockCount = items.filter((item) => item.needRestock).length;

    // Category order comes from the backend's own inventoryCategories
    // object, so a category/subcategory added on the server shows up
    // here automatically without touching this file.
    const categoryNames = Object.keys(inventoryCategories);

    return (
        <div className="min-h-screen bg-[#F7FAF5] text-[#193024]">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activePage={activePage}
                onNavigate={onNavigate}
            />

            <main className="min-h-screen px-5 py-8 transition-all sm:px-8 md:ml-20 md:px-10 lg:ml-64 lg:px-12 lg:py-10">
                <Header onMenuClick={() => setSidebarOpen(true)} notificationCount={lowStockCount} />

                <section className="mt-10">
                    {status === "error" && (
                        <div className="mb-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-500">
                            Couldn't reach the inventory API. Make sure the server is running
                            on http://localhost:5001 — retrying automatically.
                        </div>
                    )}
                    {status === "loading" && (
                        <div className="mb-6 rounded-2xl bg-[#EAF7EC] px-5 py-4 text-sm font-semibold text-[#3EAA62]">
                            Loading live inventory…
                        </div>
                    )}

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                        <SummaryCard
                            title="Total Items"
                            value={totalItems}
                            description="units in inventory"
                            icon={Package}
                            tint="green"
                        />
                        <SummaryCard
                            title="Low Stock"
                            value={lowStockCount}
                            description="items need restocking"
                            icon={AlertTriangle}
                            tint="red"
                        />
                        <SummaryCard
                            title="Total Donations"
                            description="this month"
                            icon={Gift}
                            tint="blue"
                            comingSoon
                        />
                        <SummaryCard
                            title="Active Requests"
                            description="pending"
                            icon={ClipboardList}
                            tint="purple"
                            comingSoon
                        />
                    </div>

                    {status === "ready" && categoryNames.length === 0 && (
                        <div className="mt-10 rounded-[28px] bg-white p-12 text-center shadow-sm">
                            <p className="text-3xl">🐾</p>
                            <p className="mt-3 text-sm font-semibold text-gray-500">
                                No inventory categories configured yet.
                            </p>
                        </div>
                    )}

                    {/* One Overview + Subcategories block per backend-defined category */}
                    {categoryNames.map((category) => {
                        const summary = categorySummary.find((row) => row.category === category);
                        const subCategoryNames = inventoryCategories[category] || [];

                        return (
                            <div key={category}>
                                <CategoryOverview category={category} summary={summary} />
                                <CategorySubcategories
                                    category={category}
                                    subCategoryNames={subCategoryNames}
                                    subCategorySummary={subCategorySummary}
                                />
                            </div>
                        );
                    })}

                    {categorySummary.length > 0 && (
                        <InventoryOverview categorySummary={categorySummary} items={items} />
                    )}
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
