import { apiFetch } from "./api";

/** POST /api/auth/login — { message, token, user: { id, name, email, role } } */
export async function login(email, password) {
    const data = await apiFetch("/auth/login", {
        method: "POST",
        body: { email, password },
    });

    return {
        token: data.token,
        user: data.user,
    };
}

/**
 * POST /api/users — creates a new account. The backend always assigns
 * role "user" (the schema default); role is never sent here and would
 * be ignored by the server even if it were.
 */
export async function register(name, email, password) {
    const data = await apiFetch("/users", {
        method: "POST",
        body: { name, email, password },
    });

    return data.user;
}