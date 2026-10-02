import { useState } from "react";
import { register, login as authLogin } from "../services/authService";
import { login as persistSession } from "../utils/auth";

function validate({ name, email, password, confirmPassword }) {
    const errors = {};

    if (!name.trim()) errors.name = "Name is required";
    if (!email.trim()) errors.email = "Email is required";

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 6) {
        errors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
    }

    return errors;
}

function SignUp({ onNavigate, onLogin }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    // True only when the account itself was created successfully but the
    // immediately-following auto-login call failed (rare, e.g. network
    // blip) — distinct from a plain registration failure, since here the
    // account genuinely exists and the person just needs to log in.
    const [accountCreatedLoginFailed, setAccountCreatedLoginFailed] = useState(false);

    function updateField(setter, field) {
        return (e) => {
            setter(e.target.value);
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            setSubmitError("");
            setAccountCreatedLoginFailed(false);
        };
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setSubmitError("");
        setAccountCreatedLoginFailed(false);

        const fieldErrors = validate({ name, email, password, confirmPassword });
        setErrors(fieldErrors);
        if (Object.keys(fieldErrors).length > 0) return;

        setSubmitting(true);

        // Step 1: create the account. role is never sent — the backend
        // schema default ("user") is the only thing that can ever apply.
        try {
            await register(name.trim(), email.trim(), password);
        } catch (error) {
            setSubmitError(error.message || "Registration failed");
            setSubmitting(false);
            return;
        }

        // Step 2: auto-login with the same credentials, exactly like
        // Login.jsx's own submit flow.
        try {
            const { token, user } = await authLogin(email.trim(), password);
            persistSession(token, user);
            onLogin?.();
            onNavigate?.("dashboard");
        } catch {
            setAccountCreatedLoginFailed(true);
            setSubmitError(
                "Your account was created, but automatic sign-in failed. Please log in."
            );
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
                    Create your account
                </h1>
                <p className="mt-1 text-center text-sm text-[#7D887F]">
                    Join DogCare Direct to support local shelters
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={updateField(setName, "name")}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="Your name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={updateField(setEmail, "email")}
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
                            onChange={updateField(setPassword, "password")}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="At least 6 characters"
                        />
                        {errors.password && (
                            <p className="mt-1 text-xs font-medium text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-[#193024]">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={updateField(setConfirmPassword, "confirmPassword")}
                            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#3EAA62]"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs font-medium text-red-500">
                                {errors.confirmPassword}
                            </p>
                        )}
                    </div>

                    {submitError && (
                        <div className="rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-500">
                            <p>{submitError}</p>
                            {accountCreatedLoginFailed && (
                                <button
                                    type="button"
                                    onClick={() => onNavigate?.("dashboard")}
                                    className="mt-2 font-bold underline underline-offset-2"
                                >
                                    Go to Login
                                </button>
                            )}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-xl bg-[#3EAA62] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-60"
                    >
                        {submitting ? "Creating account…" : "Sign Up"}
                    </button>
                </form>

                <button
                    type="button"
                    onClick={() => onNavigate?.("dashboard")}
                    className="mt-5 w-full text-center text-sm font-semibold text-[#7D887F] transition hover:text-[#3EAA62]"
                >
                    Already have an account? Log In
                </button>
            </div>
        </div>
    );
}

export default SignUp;