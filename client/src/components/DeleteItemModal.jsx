import { useState } from "react";
import { Trash2 } from "lucide-react";
import { deleteInventoryItem } from "../services/inventoryService";

/**
 * `item` is the inventory item pending deletion. `onDeleted` should
 * re-fetch inventory (the parent page's existing `refresh`) and close
 * the modal. Nothing happens until the admin explicitly confirms.
 */
function DeleteItemModal({ item, onClose, onDeleted }) {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    if (!item) return null;

    async function handleConfirm() {
        setDeleting(true);
        setError("");
        try {
            await deleteInventoryItem(item._id);
            setSuccess(true);
            // Brief pause so the success message is visible before the
            // parent refreshes the list and closes this modal.
            setTimeout(() => {
                onDeleted();
            }, 600);
        } catch (err) {
            setError(err.message || "Failed to delete item");
            setDeleting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                    <Trash2 size={20} strokeWidth={2.25} />
                </div>

                <h2 className="mt-4 text-lg font-extrabold text-[#193024]">Delete Inventory Item</h2>
                <p className="mt-2 text-sm text-[#7D887F]">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-[#193024]">"{item.name}"</span>? This
                    action cannot be undone.
                </p>

                {error && (
                    <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                        {error}
                    </p>
                )}

                {success && !error && (
                    <p className="mt-4 rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-600">
                        Item deleted successfully.
                    </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={deleting || success}
                        className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-50 disabled:opacity-60"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={deleting || success}
                        className="rounded-xl bg-red-500 px-5 py-2 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {success ? "Deleted!" : deleting ? "Deleting…" : "Confirm Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteItemModal;