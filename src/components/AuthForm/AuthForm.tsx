import {useAuthStore} from "../../store/authStore/authStore.ts";
import {useForm} from "react-hook-form";
import {loginUser, logoutUser, registerUser} from "../../services/auth.ts";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const schema = z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
})

type FormData = z.infer<typeof schema>;

const getAuthErrorMessage = (error: unknown): string => {
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

export const AuthForm = () => {
    const {user} = useAuthStore();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);
    const {reset, handleSubmit, register, formState: {errors, isSubmitting}} = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        try {
            if (mode === "register") {
                await registerUser(data.email, data.password);
            } else {
                await loginUser(data.email, data.password);
            }
            reset();
        } catch (e: unknown) {
            setError(getAuthErrorMessage(e));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md card glass p-6 floating relative overflow-hidden">
                <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
                <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-indigo-400/20 blur-3xl" aria-hidden />

                {user ? (
                    <div className="text-center relative z-[1] space-y-4">
                        <p className="text-white/80">
                            You are signed in as <strong className="text-white">{user.email}</strong>
                        </p>
                        <button
                            onClick={logoutUser}
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            Log out
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-[1]">
                        <div className="text-center space-y-1">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Customer area</p>
                            <h2 className="text-2xl font-semibold text-white">
                                {mode === "login" ? "Sign in" : "Create account"}
                            </h2>
                        </div>

                        <div>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="E-mail"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500/60 focus:outline-none"
                            />
                            {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Password"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-white/50 focus:ring-2 focus:ring-purple-500/60 focus:outline-none"
                            />
                            {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {error && <p className="text-red-300 text-sm mb-2">{error}</p>}

                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : mode === "login" ? "Sign in" : "Create account"}
                        </button>

                        <p className="text-center text-sm mt-2 text-white/70">
                            {mode === "login" ? (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("register")}
                                        className="text-white underline font-semibold"
                                    >
                                        Create one
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="text-white underline font-semibold"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </p>
                    </form>
                )}
            </div>
        </div>
    )
}
