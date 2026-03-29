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

const labelClass = "block text-xs font-medium uppercase tracking-widest mb-1.5";

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
            <div
                className="w-full max-w-md p-8"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                }}
            >
                <div className="text-center space-y-1 mb-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{color: "var(--text-subtle)"}}>Customer area</p>
                    <h1 className="syne text-3xl font-bold" style={{color: "var(--text)"}}>Reset password</h1>
                </div>

                {sent ? (
                    <div className="text-center space-y-4">
                        <p className="text-sm" style={{color: "var(--text-muted)"}}>
                            Check your inbox — we've sent you a password reset link.
                        </p>
                        <Link to="/login" className="btn btn-primary w-full block text-center">
                            Back to sign in
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <p className="text-sm text-center" style={{color: "var(--text-muted)"}}>
                            Enter your email and we'll send you a reset link.
                        </p>

                        <div>
                            <label className={labelClass} style={{color: "var(--text-muted)"}}>Email</label>
                            <input type="email" {...register("email")} placeholder="your@email.com" className={inputClass} />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Sending…" : "Send reset link"}
                        </button>

                        <p className="text-center text-sm" style={{color: "var(--text-muted)"}}>
                            Remembered it?{" "}
                            <Link
                                to="/login"
                                className="font-medium transition-colors"
                                style={{color: "var(--accent)"}}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--text)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};
