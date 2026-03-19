import { z } from "zod";

export const inputClass =
    "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500/60 focus:outline-none";

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
