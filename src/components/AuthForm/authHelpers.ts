import { z } from "zod";

export const inputClass =
    "w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm rounded-[3px]";

export const emailSchema = z.email("Invalid email");

export const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

export const getAuthErrorMessage = (error: unknown): string => {
    if (error !== null && typeof error === "object" && "code" in error) {
        const messages: Record<string, string> = {
            "auth/invalid-credential": "Invalid email or password.",
            "auth/email-already-in-use": "This email is already registered.",
            "auth/weak-password": "Password is too weak.",
            "auth/user-not-found": "Invalid email or password.",
            "auth/wrong-password": "Invalid email or password.",
            "auth/too-many-requests": "Too many attempts. Try again later.",
            "auth/network-request-failed": "Network error. Check your connection.",
        };
        return messages[error.code as string] ?? "Something went wrong. Try again.";
    }
    return "Something went wrong. Try again.";
};
