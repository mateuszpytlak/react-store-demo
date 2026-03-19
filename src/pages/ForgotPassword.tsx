import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { resetPassword } from "../services/auth";
import { inputClass, emailSchema, getAuthErrorMessage } from "../components/AuthForm/authHelpers";

const schema = z.object({
    email: emailSchema,
});

type FormData = z.infer<typeof schema>;

export const ForgotPassword = () => {
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await resetPassword(data.email);
            setSent(true);
        } catch (e) {
            setError(getAuthErrorMessage(e));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md card glass p-6 floating relative overflow-hidden">
                <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
                <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-indigo-400/20 blur-3xl" aria-hidden />

                <div className="relative z-1">
                    <div className="text-center space-y-1 mb-6">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Customer area</p>
                        <h1 className="text-2xl font-semibold text-white">Reset password</h1>
                    </div>

                    {sent ? (
                        <div className="text-center space-y-4">
                            <p className="text-green-300">
                                Check your inbox — we've sent you a password reset link.
                            </p>
                            <Link to="/login" className="btn btn-primary w-full block text-center">
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <p className="text-sm text-white/60 text-center">
                                Enter your email and we'll send you a reset link.
                            </p>

                            <div>
                                <input type="email" {...register("email")} placeholder="E-mail" className={inputClass} />
                                {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
                            </div>

                            {error && <p className="text-red-300 text-sm">{error}</p>}

                            <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                                {isSubmitting ? "Sending..." : "Send reset link"}
                            </button>

                            <p className="text-center text-sm text-white/70">
                                Remembered it?{" "}
                                <Link to="/login" className="text-white underline font-semibold">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
