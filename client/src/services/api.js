const BASE_URL = "http://localhost:5001/api";

/**
 * Shared fetch wrapper: prefixes BASE_URL, sends/receives JSON, attaches
 * a bearer token if one is in localStorage (for your auth-protected
 * routes), and throws a real Error with the backend's message on
 * non-2xx responses so callers can use plain try/catch.
 */
export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
    }

    return data;
}

export default apiFetch;
