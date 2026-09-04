import { apiFetch } from "./api";

/** GET /api/inventory — { items, categorySummary, subCategorySummary, inventoryCategories } */
export async function getInventory() {
    const data = await apiFetch("/inventory");
    return {
        items: data.items || [],
        categorySummary: data.categorySummary || [],
        subCategorySummary: data.subCategorySummary || [],
        inventoryCategories: data.inventoryCategories || {},
    };
}

/** POST /api/inventory — creates a new inventory item. */
export async function createInventoryItem(item) {
    const data = await apiFetch("/inventory", {
        method: "POST",
        body: item,
    });
    return data.item;
}

/** POST /api/categories — creates a new category. */
export async function createCategory(name) {
    const data = await apiFetch("/categories", {
        method: "POST",
        body: { name },
    });
    return data.category;
}

/** POST /api/categories/:name/subcategories — adds a subcategory to an existing category. */
export async function addSubCategory(category, subCategory) {
    const data = await apiFetch(`/categories/${encodeURIComponent(category)}/subcategories`, {
        method: "POST",
        body: { subCategory },
    });
    return data.category;
}

/**
 * Poll the inventory endpoint so the dashboard reflects MongoDB changes
 * without a manual refresh. Swap the internals for a WebSocket/SSE
 * listener later — every component that consumes this stays the same.
 */
export function subscribeToInventory(onData, onError, intervalMs = 8000) {
    let cancelled = false;

    const tick = async () => {
        try {
            const data = await getInventory();
            if (!cancelled) onData(data);
        } catch (error) {
            if (!cancelled) onError?.(error);
        }
    };

    tick();
    const id = setInterval(tick, intervalMs);

    return () => {
        cancelled = true;
        clearInterval(id);
    };
}