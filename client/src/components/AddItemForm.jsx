import { useState } from "react";
import { X } from "lucide-react";
import { createInventoryItem, createCategory, addSubCategory } from "../services/inventoryService";

const EMPTY_FORM = {
    name: "",
    category: "",
    subCategory: "",
    quantity: "",
    minimumRequired: "",
    unit: "",
};

const ADD_NEW_CATEGORY = "__ADD_NEW_CATEGORY__";
const ADD_NEW_SUBCATEGORY = "__ADD_NEW_SUBCATEGORY__";

function validate(form) {
    const errors = {};

    if (!form.name.trim()) errors.name = "Item name is required";
    if (!form.category) errors.category = "Category is required";
    if (!form.subCategory) errors.subCategory = "Subcategory is required";

    if (form.quantity === "" || Number.isNaN(Number(form.quantity)) || Number(form.quantity) < 0) {
        errors.quantity = "Enter a valid quantity (0 or more)";
    }

    if (
        form.minimumRequired === "" ||
        Number.isNaN(Number(form.minimumRequired)) ||
        Number(form.minimumRequired) < 0
    ) {
        errors.minimumRequired = "Enter a valid minimum required (0 or more)";
    }

    if (!form.unit.trim()) errors.unit = "Unit is required";

    return errors;
}

/**
 * `inventoryCategories` is the same object the backend returns from
 * GET /api/inventory ({ Food: [...], Medicine: [...], ... }) — it is the
 * single source of truth for both dropdowns. Nothing here is hardcoded.
 *
 * `onCategoriesChanged` should re-fetch inventory (the parent page's
 * existing `refresh`) so newly created categories/subcategories show up
 * immediately, without a page reload.
 */
function AddItemForm({ inventoryCategories, onClose, onCreated, onCategoriesChanged }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // Inline "add new category" state
    const [addingCategory, setAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categorySubmitting, setCategorySubmitting] = useState(false);
    const [categoryError, setCategoryError] = useState("");

    // Inline "add new subcategory" state
    const [addingSubCategory, setAddingSubCategory] = useState(false);
    const [newSubCategoryName, setNewSubCategoryName] = useState("");
    const [subCategorySubmitting, setSubCategorySubmitting] = useState(false);
    const [subCategoryError, setSubCategoryError] = useState("");

    const categoryOptions = Object.keys(inventoryCategories || {});
    const subCategoryOptions = form.category ? inventoryCategories[form.category] || [] : [];

    function updateField(field, value) {
        setForm((prev) => ({
            ...prev,
            [field]: value,
            // Changing category invalidates whatever subcategory was picked.
            ...(field === "category" ? { subCategory: "" } : {}),
        }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function handleCategorySelect(value) {
        if (value === ADD_NEW_CATEGORY) {
            setAddingCategory(true);
            setCategoryError("");
            return;
        }
        updateField("category", value);
    }

    function handleSubCategorySelect(value) {
        if (value === ADD_NEW_SUBCATEGORY) {
            setAddingSubCategory(true);
            setSubCategoryError("");
            return;
        }
        updateField("subCategory", value);
    }

    async function handleCreateCategory() {
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            setCategoryError("Category name is required");
            return;
        }

        setCategorySubmitting(true);
        setCategoryError("");
        try {
            await createCategory(trimmed);
            await onCategoriesChanged?.();
            updateField("category", trimmed);
            setAddingCategory(false);
            setNewCategoryName("");
        } catch (error) {
            setCategoryError(error.message || "Failed to add category");
        } finally {
            setCategorySubmitting(false);
        }
    }

    async function handleCreateSubCategory() {
        const trimmed = newSubCategoryName.trim();
        if (!trimmed) {
            setSubCategoryError("Subcategory name is required");
            return;
        }

        setSubCategorySubmitting(true);
        setSubCategoryError("");
        try {
            await addSubCategory(form.category, trimmed);
            await onCategoriesChanged?.();
            updateField("subCategory", trimmed);
            setAddingSubCategory(false);
            setNewSubCategoryName("");
        } catch (error) {
            setSubCategoryError(error.message || "Failed to add subcategory");
        } finally {
            setSubCategorySubmitting(false);
        }
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");

        const fieldErrors = validate(form);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSubmitting(true);
        try {
            await createInventoryItem({
                name: form.name.trim(),
                category: form.category,
                subCategory: form.subCategory,
                quantity: Number(form.quantity),
                minimumRequired: Number(form.minimumRequired),
                unit: form.unit.trim(),
            });

            setForm(EMPTY_FORM);
            await onCreated();
        } catch (error) {
            setSubmitError(error.message || "Failed to add item");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-[#193024]">Add Inventory Item</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 transition hover:text-gray-600"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Item Name</label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="e.g. Pedigree Dog Food"
                        />
                        {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Category</label>

                        {addingCategory ? (
                            <div className="mt-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="New category name"
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={categorySubmitting}
                                        className="whitespace-nowrap rounded-xl bg-[#3EAA62] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                                    >
                                        {categorySubmitting ? "Adding…" : "Add"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddingCategory(false);
                                            setNewCategoryName("");
                                            setCategoryError("");
                                        }}
                                        className="whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {categoryError && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{categoryError}</p>
                                )}
                            </div>
                        ) : (
                            <select
                                value={form.category}
                                onChange={(e) => handleCategorySelect(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            >
                                <option value="">Select category</option>
                                {categoryOptions.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                                <option value={ADD_NEW_CATEGORY}>+ Add New Category…</option>
                            </select>
                        )}

                        {errors.category && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.category}</p>
                        )}
                    </div>

                    {/* Subcategory */}
                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Subcategory</label>

                        {addingSubCategory ? (
                            <div className="mt-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newSubCategoryName}
                                        onChange={(e) => setNewSubCategoryName(e.target.value)}
                                        placeholder="New subcategory name"
                                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleCreateSubCategory}
                                        disabled={subCategorySubmitting}
                                        className="whitespace-nowrap rounded-xl bg-[#3EAA62] px-3 py-2 text-xs font-bold text-white disabled:opacity-60"
                                    >
                                        {subCategorySubmitting ? "Adding…" : "Add"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAddingSubCategory(false);
                                            setNewSubCategoryName("");
                                            setSubCategoryError("");
                                        }}
                                        className="whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {subCategoryError && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{subCategoryError}</p>
                                )}
                            </div>
                        ) : (
                            <select
                                value={form.subCategory}
                                onChange={(e) => handleSubCategorySelect(e.target.value)}
                                disabled={!form.category}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62] disabled:bg-gray-50 disabled:text-gray-400"
                            >
                                <option value="">
                                    {form.category ? "Select subcategory" : "Select a category first"}
                                </option>
                                {subCategoryOptions.map((sub) => (
                                    <option key={sub} value={sub}>
                                        {sub}
                                    </option>
                                ))}
                                {form.category && (
                                    <option value={ADD_NEW_SUBCATEGORY}>+ Add New Subcategory…</option>
                                )}
                            </select>
                        )}

                        {errors.subCategory && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.subCategory}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-sm font-semibold text-[#193024]">Quantity</label>
                            <input
                                type="number"
                                min="0"
                                value={form.quantity}
                                onChange={(e) => updateField("quantity", e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            />
                            {errors.quantity && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.quantity}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-[#193024]">Minimum Required</label>
                            <input
                                type="number"
                                min="0"
                                value={form.minimumRequired}
                                onChange={(e) => updateField("minimumRequired", e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            />
                            {errors.minimumRequired && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.minimumRequired}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Unit</label>
                        <input
                            type="text"
                            value={form.unit}
                            onChange={(e) => updateField("unit", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="e.g. kg, L, packs"
                        />
                        {errors.unit && <p className="mt-1 text-xs font-medium text-red-500">{errors.unit}</p>}
                    </div>

                    {submitError && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                            {submitError}
                        </p>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="rounded-xl bg-[#3EAA62] px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                            {submitting ? "Adding…" : "Add Item"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddItemForm;