import { useState } from "react";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { createDonation } from "../services/donationService";
import { isAdmin } from "../utils/auth";

const EMPTY_ITEM = { name: "", quantity: "", unit: "" };
const EMPTY_FORM = {
    donorName: "",
    shelterName: "",
    items: [{ ...EMPTY_ITEM }],
    amount: "",
};

function validate(form) {
    const errors = {};

    if (!form.donorName.trim()) errors.donorName = "Donor name is required";
    if (!form.shelterName.trim()) errors.shelterName = "Shelter name is required";

    if (form.items.length === 0) {
        errors.itemsGeneral = "At least one item is required";
    } else {
        const itemErrors = [];
        form.items.forEach((item, index) => {
            const rowErrors = {};
            if (!item.name.trim()) rowErrors.name = "Item name is required";

            const quantity = Number(item.quantity);
            if (item.quantity === "" || Number.isNaN(quantity) || quantity <= 0) {
                rowErrors.quantity = "Must be greater than 0";
            }

            if (Object.keys(rowErrors).length > 0) itemErrors[index] = rowErrors;
        });
        if (itemErrors.length > 0) errors.items = itemErrors;
    }

    const amountNum = Number(form.amount);
    if (form.amount === "" || Number.isNaN(amountNum) || amountNum < 0) {
        errors.amount = "Amount must be 0 or greater";
    }

    return errors;
}

/**
 * Public donation creation flow:
 *   CreateDonation.jsx -> donationService.createDonation() -> POST /api/donations
 *   -> MongoDB Donation -> Past Orders (GET /api/donations)
 *
 * No status/date is sent — the backend defaults status to "Pending" and
 * date to now, exactly as required. Nothing here is stored in frontend
 * state beyond the form itself; MongoDB stays the single source of truth.
 */
function CreateDonation({ activePage = "create-donation", onNavigate }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [success, setSuccess] = useState(false);

    function updateField(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setSubmitError("");
    }

    function updateItem(index, field, value) {
        setForm((prev) => ({
            ...prev,
            items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
        }));
        setErrors((prev) => {
            if (!prev.items) return prev;
            const nextItems = [...prev.items];
            if (nextItems[index]) {
                nextItems[index] = { ...nextItems[index], [field]: undefined };
            }
            return { ...prev, items: nextItems };
        });
        setSubmitError("");
    }

    function addItem() {
        setForm((prev) => ({ ...prev, items: [...prev.items, { ...EMPTY_ITEM }] }));
    }

    function removeItem(index) {
        setForm((prev) => {
            // At least one item must remain.
            if (prev.items.length <= 1) return prev;
            return { ...prev, items: prev.items.filter((_, i) => i !== index) };
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");

        const fieldErrors = validate(form);
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSubmitting(true);
        try {
            await createDonation({
                donorName: form.donorName.trim(),
                shelterName: form.shelterName.trim(),
                items: form.items.map((item) => ({
                    name: item.name.trim(),
                    quantity: Number(item.quantity),
                    unit: item.unit.trim(),
                })),
                amount: Number(form.amount),
            });

            setSuccess(true);
            setForm(EMPTY_FORM);
            setErrors({});

            // Brief pause so the success message is actually visible
            // before navigating to Past Orders.
            setTimeout(() => {
                onNavigate?.("donations");
            }, 900);
        } catch (error) {
            setSubmitError(error.message || "Failed to create donation");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#F7FAF5] text-[#193024]">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activePage={activePage}
                onNavigate={onNavigate}
            />

            <main className="min-h-screen px-5 py-8 transition-all sm:px-8 md:ml-20 md:px-10 lg:ml-64 lg:px-12 lg:py-10">
                <Header onMenuClick={() => setSidebarOpen(true)} notificationCount={0} />

                <section className="mt-10 max-w-2xl">
                    <button
                        type="button"
                        onClick={() => onNavigate?.("donations")}
                        className="flex items-center gap-1.5 text-sm font-semibold text-[#7D887F] transition hover:text-[#3EAA62]"
                    >
                        <ArrowLeft size={15} strokeWidth={2.5} />
                        Back to Past Orders
                    </button>

                    <h1 className="mt-4 text-2xl font-extrabold text-[#193024]">Create Donation</h1>
                    <p className="mt-1 text-sm text-[#7D887F]">
                        Record a donation to a shelter — it will appear on the Past Orders page
                        once saved.
                    </p>

                    {!isAdmin() ? (
                        <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
                            <p className="text-3xl">🔒</p>
                            <p className="mt-3 text-sm font-semibold text-gray-500">
                                Only shelter admins can create donations.
                            </p>
                            <button
                                type="button"
                                onClick={() => onNavigate?.("donations")}
                                className="mt-4 rounded-xl bg-[#3EAA62] px-5 py-2 text-sm font-bold text-white transition hover:opacity-90"
                            >
                                Back to Past Orders
                            </button>
                        </div>
                    ) : (
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-8 space-y-6 rounded-2xl bg-white p-6 shadow-sm"
                    >
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-sm font-semibold text-[#193024]">Donor Name</label>
                                <input
                                    type="text"
                                    value={form.donorName}
                                    onChange={(e) => updateField("donorName", e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                    placeholder="e.g. Aditi Sharma"
                                />
                                {errors.donorName && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{errors.donorName}</p>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-semibold text-[#193024]">Shelter Name</label>
                                <input
                                    type="text"
                                    value={form.shelterName}
                                    onChange={(e) => updateField("shelterName", e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                    placeholder="e.g. Happy Paws Shelter"
                                />
                                {errors.shelterName && (
                                    <p className="mt-1 text-xs font-medium text-red-500">{errors.shelterName}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-[#193024]">Donation Items</label>

                            {errors.itemsGeneral && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.itemsGeneral}</p>
                            )}

                            <div className="mt-2 space-y-3">
                                {form.items.map((item, index) => (
                                    <div key={index} className="rounded-xl border border-gray-200 p-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                                                Item {index + 1}
                                            </p>
                                            {form.items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-gray-400 transition hover:text-red-500"
                                                    aria-label={`Remove item ${index + 1}`}
                                                >
                                                    <Trash2 size={14} strokeWidth={2.25} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                            <div>
                                                <label className="text-xs font-semibold text-[#193024]">
                                                    Item Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.name}
                                                    onChange={(e) => updateItem(index, "name", e.target.value)}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                                    placeholder="e.g. Dog Food"
                                                />
                                                {errors.items?.[index]?.name && (
                                                    <p className="mt-1 text-xs font-medium text-red-500">
                                                        {errors.items[index].name}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-[#193024]">
                                                    Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(index, "quantity", e.target.value)}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                                />
                                                {errors.items?.[index]?.quantity && (
                                                    <p className="mt-1 text-xs font-medium text-red-500">
                                                        {errors.items[index].quantity}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold text-[#193024]">Unit</label>
                                                <input
                                                    type="text"
                                                    value={item.unit}
                                                    onChange={(e) => updateItem(index, "unit", e.target.value)}
                                                    className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                                    placeholder="e.g. kg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={addItem}
                                className="mt-3 flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-semibold text-[#3EAA62] transition hover:border-[#3EAA62]"
                            >
                                <Plus size={15} strokeWidth={2.5} />
                                Add Another Item
                            </button>
                        </div>

                        <div className="max-w-xs">
                            <label className="text-sm font-semibold text-[#193024]">Donation Amount</label>
                            <input
                                type="number"
                                min="0"
                                value={form.amount}
                                onChange={(e) => updateField("amount", e.target.value)}
                                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                                placeholder="e.g. 2400"
                            />
                            {errors.amount && (
                                <p className="mt-1 text-xs font-medium text-red-500">{errors.amount}</p>
                            )}
                        </div>

                        {submitError && (
                            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                                {submitError}
                            </p>
                        )}

                        {success && (
                            <p className="rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-600">
                                Donation created successfully! Taking you to Past Orders…
                            </p>
                        )}

                        <div className="flex justify-end gap-3 border-t border-gray-50 pt-5">
                            <button
                                type="button"
                                onClick={() => onNavigate?.("donations")}
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || success}
                                className="rounded-xl bg-[#3EAA62] px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                            >
                                {success ? "Saved!" : submitting ? "Creating Donation…" : "Create Donation"}
                            </button>
                        </div>
                    </form>
                    )}
                </section>
            </main>
        </div>
    );
}

export default CreateDonation;
