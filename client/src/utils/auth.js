/**
 * Reuses the SAME "token" apiFetch already reads from localStorage and
 * sends as a Bearer header — no new auth system, no new storage key for
 * the token itself. A second key, "user", stores the { id, name, email,
 * role } object returned by POST /api/auth/login, purely for display
 * (the JWT payload itself only carries userId/role/iat/exp).
 *
 * getCurrentUser() is the single authoritative check for "is there a
 * valid session, and what role does it have" — it decodes the live JWT
 * and checks expiry every time, so a stale "user" object left in
 * storage can never look logged-in on its own. It never verifies the
 * signature — that only happens server-side, in
 * authMiddleware/adminMiddleware. Never trust this for anything other
 * than what to show/hide/redirect in the UI.
 */
function decodeToken(token) {
    try {
        const payload = token.split(".")[1];
        const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64);
        return JSON.parse(json);
    } catch {
        return null;
    }
}

/** Returns the decoded token payload ({ userId, role, iat, exp }) or null. */
export function getCurrentUser() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    const decoded = decodeToken(token);
    if (!decoded) return null;

    // Treat an expired token as "logged out" for UI purposes.
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
        return null;
    }

    return decoded;
}

export function isAdmin() {
    return getCurrentUser()?.role === "admin";
}

/** True if there is a currently valid (non-expired) session. */
export function isLoggedIn() {
    return getCurrentUser() !== null;
}

/**
 * Display-only profile info (name/email) from the last successful
 * login. Never used for access control — only getCurrentUser()/role is.
 */
export function getStoredUser() {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/** Call after a successful POST /api/auth/login. */
export function login(token, user) {
    localStorage.setItem("token", token);
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    }
}

/** Clears the JWT and stored profile info. */
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}