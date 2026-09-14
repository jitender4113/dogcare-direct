import { useState } from "react";
import { X } from "lucide-react";
import { updateInventoryItem } from "../services/inventoryService";

function buildFormFromItem(item) {
    return {
        name: item?.name || "",
        category: item?.category || "",
        subCategory: item?.subCategory || "",
        quantity: item?.quantity ?? "",
        minimumRequired: item?.minimumRequired ?? "",
        unit: item?.unit || "",
    };
}

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
 * `item` is the inventory item being edited (pre-fills the form).
 * `inventoryCategories` is the same { Food: [...], Medicine: [...] }
 * object used by AddItemForm — the single source of truth for both
 * dropdowns, sourced from MongoDB. `onUpdated` should re-fetch inventory
 * (the parent page's existing `refresh`) and close the modal.
 */
function EditItemForm({ item, inventoryCategories, onClose, onUpdated }) {
    const [form, setForm] = useState(() => buildFormFromItem(item));
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(false);

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
        setSubmitError("");
        setSuccess(false);
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");

        const fieldErrors = validate(form);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSubmitting(true);
        try {
            await updateInventoryItem(item._id, {
                name: form.name.trim(),
                category: form.category,
                subCategory: form.subCategory,
                quantity: Number(form.quantity),
                minimumRequired: Number(form.minimumRequired),
                unit: form.unit.trim(),
            });

            setSuccess(true);
            // Brief pause so the success message is actually visible
            // before the parent refreshes the list and closes this modal.
            setTimeout(() => {
                onUpdated();
            }, 700);
        } catch (error) {
            setSubmitError(error.message || "Failed to update item");
            setSubmitting(false);
        }
    }

    if (!item) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-[#193024]">Edit Inventory Item</h2>
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
                        />
                        {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => updateField("category", e.target.value)}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                        >
                            <option value="">Select category</option>
                            {categoryOptions.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.category}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Subcategory</label>
                        <select
                            value={form.subCategory}
                            onChange={(e) => updateField("subCategory", e.target.value)}
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
                        </select>
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
                        />
                        {errors.unit && <p className="mt-1 text-xs font-medium text-red-500">{errors.unit}</p>}
                    </div>

                    {submitError && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                            {submitError}
                        </p>
                    )}

                    {success && (
                        <p className="rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-600">
                            Item updated successfully.
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
                            disabled={submitting || success}
                            className="rounded-xl bg-[#3EAA62] px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                        >
                            {success ? "Saved!" : submitting ? "Saving…" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditItemForm;