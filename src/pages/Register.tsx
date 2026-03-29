import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerUser } from "../services/auth";
import { useAuthStore } from "../store/authStore/authStore";
import { inputClass, emailSchema, passwordSchema, getAuthErrorMessage } from "../components/AuthForm/authHelpers";

const schema = z.object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        });
    }
});

type FormData = z.infer<typeof schema>;

const labelClass = "block text-xs font-medium uppercase tracking-widest mb-1.5";

export const Register = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    if (user) navigate("/account", { replace: true });

    const onSubmit = async (data: FormData) => {
        try {
            await registerUser(data.email, data.password);
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
                        <h1 className="syne text-3xl font-bold" style={{color: "var(--text)"}}>Create account</h1>
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

                    <div>
                        <label className={labelClass} style={{color: "var(--text-muted)"}}>Confirm password</label>
                        <input type="password" {...register("confirmPassword")} placeholder="••••••••" className={inputClass} />
                        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account…" : "Create account"}
                    </button>

                    <p className="text-center text-sm" style={{color: "var(--text-muted)"}}>
                        Already have an account?{" "}
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
            </div>
        </div>
    );
};
