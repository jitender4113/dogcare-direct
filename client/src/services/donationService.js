import { apiFetch } from "./api";

// Backend documents use MongoDB's `_id`, but PastOrderCard (and the mock
// data it was built against) expects `id`. Normalizing here keeps that
// component completely untouched.
function normalizeDonation(donation) {
    if (!donation) return donation;
    return {
        ...donation,
        id: donation._id || donation.id,
    };
}

/** GET /api/donations — public donation history, newest first. */
export async function getDonations() {
    const data = await apiFetch("/donations");
    const donations = data.donations || [];
    return donations.map(normalizeDonation);
}

/** GET /api/donations/summary — { totalDonations, totalItemsDonated, sheltersHelped } */
export async function getDonationSummary() {
    const data = await apiFetch("/donations/summary");
    return {
        totalDonations: data.totalDonations ?? 0,
        totalItemsDonated: data.totalItemsDonated ?? 0,
        sheltersHelped: data.sheltersHelped ?? 0,
    };
}

/** POST /api/donations — creates a new donation/order. */
export async function createDonation(donation) {
    const data = await apiFetch("/donations", {
        method: "POST",
        body: donation,
    });
    return normalizeDonation(data.donation);
}