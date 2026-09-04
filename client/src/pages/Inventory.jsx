import { useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import AddItemForm from "../components/AddItemForm";

import { getInventory, subscribeToInventory } from "../services/inventoryService";

function Inventory({ activePage = "inventory", onNavigate }) {
    const [inventory, setInventory] = useState({
        items: [],
        categorySummary: [],
        subCategorySummary: [],
        inventoryCategories: {},
    });
    const [status, setStatus] = useState("loading"); // loading | ready | error
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);

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

    // Used after a successful POST so the new item shows up immediately,
    // instead of waiting for the next poll tick.
    const refresh = useCallback(async () => {
        try {
            const data = await getInventory();
            setInventory(data);
            setStatus("ready");
        } catch {
            setStatus("error");
        }
    }, []);

    const { items, inventoryCategories } = inventory;
    const lowStockCount = items.filter((item) => item.needRestock).length;

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
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-extrabold text-[#193024]">Inventory</h1>
                            <p className="mt-1 text-sm text-[#7D887F]">
                                All shelter inventory items, live from the database.
                            </p>
                        </div>

                        <button
                            onClick={() => setShowAddForm(true)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#3EAA62] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                        >
                            <Plus size={16} strokeWidth={2.5} />
                            Add Item
                        </button>
                    </div>

                    {status === "error" && (
                        <div className="mt-6 rounded-2xl bg-red-50 px-5 py-4 text-sm font-semibold text-red-500">
                            Couldn't reach the inventory API. Make sure the server is running
                            on http://localhost:5001 — retrying automatically.
                        </div>
                    )}
                    {status === "loading" && (
                        <div className="mt-6 rounded-2xl bg-[#EAF7EC] px-5 py-4 text-sm font-semibold text-[#3EAA62]">
                            Loading inventory…
                        </div>
                    )}

                    <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs font-bold uppercase tracking-wide text-gray-400">
                                    <th className="px-5 py-4">Item</th>
                                    <th className="px-5 py-4">Category</th>
                                    <th className="px-5 py-4">Subcategory</th>
                                    <th className="px-5 py-4">Quantity</th>
                                    <th className="px-5 py-4">Min. Required</th>
                                    <th className="px-5 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-50 last:border-0">
                                        <td className="px-5 py-4 font-semibold text-[#193024]">{item.name}</td>
                                        <td className="px-5 py-4 text-[#7D887F]">{item.category}</td>
                                        <td className="px-5 py-4 text-[#7D887F]">{item.subCategory}</td>
                                        <td className="px-5 py-4 text-[#193024]">
                                            {item.quantity} {item.unit}
                                        </td>
                                        <td className="px-5 py-4 text-[#193024]">
                                            {item.minimumRequired} {item.unit}
                                        </td>
                                        <td className="px-5 py-4">
                                            {item.needRestock ? (
                                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-500">
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-600">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {status === "ready" && items.length === 0 && (
                            <div className="px-5 py-10 text-center text-sm font-semibold text-gray-400">
                                No inventory items yet — click "Add Item" to create the first one.
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {showAddForm && (
                <AddItemForm
                    inventoryCategories={inventoryCategories}
                    onClose={() => setShowAddForm(false)}
                    onCategoriesChanged={refresh}
                    onCreated={async () => {
                        await refresh();
                        setShowAddForm(false);
                    }}
                />
            )}
        </div>
    );
}

export default Inventory;