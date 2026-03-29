import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginUser } from "../services/auth";
import { useAuthStore } from "../store/authStore/authStore";
import { inputClass, emailSchema, passwordSchema, getAuthErrorMessage } from "../components/AuthForm/authHelpers";

const schema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

type FormData = z.infer<typeof schema>;

const labelClass = "block text-xs font-medium uppercase tracking-widest mb-1.5";

export const Login = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    if (user) navigate("/account", { replace: true });

    const onSubmit = async (data: FormData) => {
        try {
            await loginUser(data.email, data.password);
            navigate("/products");
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="text-center space-y-1 mb-2">
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{color: "var(--text-subtle)"}}>Customer area</p>
                        <h1 className="syne text-3xl font-bold" style={{color: "var(--text)"}}>Sign in</h1>
                    </div>

                    <div>
                        <label className={labelClass} style={{color: "var(--text-muted)"}}>Email</label>
                        <input type="email" {...register("email")} placeholder="your@email.com" className={inputClass} />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className={labelClass} style={{color: "var(--text-muted)"}}>Password</label>
                        <input type="password" {...register("password")} placeholder="••••••••" className={inputClass} />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <div className="text-right">
                        <Link
                            to="/forgot-password"
                            className="text-xs transition-colors"
                            style={{color: "var(--text-muted)"}}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Signing in…" : "Sign in"}
                    </button>

                    <p className="text-center text-sm" style={{color: "var(--text-muted)"}}>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-medium transition-colors"
                            style={{color: "var(--accent)"}}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--text)"}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                        >
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
