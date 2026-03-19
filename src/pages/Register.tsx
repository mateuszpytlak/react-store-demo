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
            <div className="w-full max-w-md card glass p-6 floating relative overflow-hidden">
                <div className="absolute -top-14 -right-10 w-44 h-44 rounded-full bg-purple-500/20 blur-3xl" aria-hidden />
                <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-indigo-400/20 blur-3xl" aria-hidden />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 relative z-1">
                    <div className="text-center space-y-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Customer area</p>
                        <h1 className="text-2xl font-semibold text-white">Create account</h1>
                    </div>

                    <div>
                        <input type="email" {...register("email")} placeholder="E-mail" className={inputClass} />
                        {errors.email && <p className="text-red-300 text-sm mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <input type="password" {...register("password")} placeholder="Password" className={inputClass} />
                        {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                        <input type="password" {...register("confirmPassword")} placeholder="Confirm password" className={inputClass} />
                        {errors.confirmPassword && <p className="text-red-300 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    {error && <p className="text-red-300 text-sm">{error}</p>}

                    <button type="submit" className="btn btn-primary w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Creating account..." : "Create account"}
                    </button>

                    <p className="text-center text-sm text-white/70">
                        Already have an account?{" "}
                        <Link to="/login" className="text-white underline font-semibold">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};
