import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import SummaryCard from "../components/SummaryCard";
import InventoryOverview from "../components/InventoryOverview";
import FoodOverview from "../components/FoodOverview";
import FoodSubcategories from "../components/FoodSubcategories";

function Dashboard() {
    const [inventory, setInventory] = useState([]);
    const [inventoryCategories, setInventoryCategories] = useState({});

    useEffect(() => {
        fetch("http://localhost:5001/api/inventory")
            .then((response) => response.json())
            .then((data) => {
    console.log("API DATA:", data);

    setInventory(data.items);
    setInventoryCategories(data.inventoryCategories);
})
            .catch((error) => {
                console.log("Error fetching inventory:", error);
            });
    }, []);

    // Summary calculations
    const totalItems = inventory.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const lowStock = inventory.filter(
        (item) => item.needRestock === true
    ).length;

    const categories = new Set(
        inventory.map((item) => item.category)
    ).size;

    const itemsNeeded = inventory.reduce(
        (total, item) => total + item.neededQuantity,
        0
    );

    // Category-wise inventory
    const categoryData = inventory.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = {
                quantity: 0,
                required: 0,
            };
        }

        acc[item.category].quantity += item.quantity;
        acc[item.category].required += item.minimumRequired;

        return acc;
    }, {});

    return (
        <div className="min-h-screen bg-[#F7FAF5] text-[#193024]">

            <Sidebar />

            <main className="ml-[250px] min-h-screen px-12 py-10">

                <Header />

                <section className="mt-10">

                    {/* Summary Cards */}
                    <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                        <SummaryCard
                            title="Total Items"
                            value={totalItems}
                            description="items in inventory"
                            icon="📦"
                        />

                        <SummaryCard
                            title="Low Stock"
                            value={lowStock}
                            description="items need restocking"
                            icon="⚠️"
                        />

                        <SummaryCard
                            title="Categories"
                            value={categories}
                            description="active categories"
                            icon="📂"
                        />

                        <SummaryCard
                            title="Items Needed"
                            value={itemsNeeded}
                            description="units needed"
                            icon="📋"
                        />

                    </div>

                    <FoodOverview categoryData={categoryData} />

                    <FoodSubcategories
    inventory={inventory}
    categories={inventoryCategories}
/>

                    <InventoryOverview
                        categoryData={categoryData}
                        inventory={inventory}
                    />

                </section>

            </main>

        </div>
    );
}

export default Dashboard;