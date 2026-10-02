// client/src/pages/Login.jsx
import { useState } from "react";
import { login as authLogin } from "../services/authService";
import { login as persistSession } from "../utils/auth";

function Login({ onNavigate, onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    function validate() {
        const nextErrors = {};
        if (!email.trim()) nextErrors.email = "Email is required";
        if (!password) nextErrors.password = "Password is required";
        return nextErrors;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");

        const fieldErrors = validate();
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSubmitting(true);
        try {
            const { token, user } = await authLogin(email.trim(), password);
            persistSession(token, user);
            onLogin?.();
            onNavigate?.("dashboard");
        } catch (error) {
            setSubmitError(error.message || "Login failed");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7FAF5] px-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
                <div className="flex justify-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F6E7] text-3xl">
                        🐾
                    </div>
                </div>

                <h1 className="mt-5 text-center text-xl font-extrabold text-[#193024]">
                    Welcome back
                </h1>
                <p className="mt-1 text-center text-sm text-[#7D887F]">
                    Sign in to manage DogCare Direct
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setErrors((prev) => ({ ...prev, email: undefined }));
                                setSubmitError("");
                            }}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="you@example.com"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setErrors((prev) => ({ ...prev, password: undefined }));
                                setSubmitError("");
                            }}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="••••••••"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
                        )}
                    </div>

                    {submitError && (
                        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                            {submitError}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-[#3EAA62] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {submitting ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => onNavigate?.("donations")}
                    className="mt-5 w-full text-center text-sm font-semibold text-[#7D887F] transition hover:text-[#3EAA62]"
                >
                    ← Browse Past Orders without signing in
                </button>

                <button
                    type="button"
                    onClick={() => onNavigate?.("signup")}
                    className="mt-3 w-full text-center text-sm font-semibold text-[#3EAA62] transition hover:opacity-80"
                >
                    Don't have an account? Sign Up
                </button>
            </div>
        </div>
    );
}

export default Login;