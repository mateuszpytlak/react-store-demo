import {useAuthStore} from "../../store/authStore/authStore.ts";
import {useForm} from "react-hook-form";
import {loginUser, logoutUser, registerUser} from "../../services/auth.ts";
import {useState} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";

const schema = z.object({
    email: z.email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>;

export const AuthForm = () => {
    const {user} = useAuthStore();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [error, setError] = useState<string | null>(null);
    const {reset, handleSubmit, register, formState: {errors, isSubmitting}} = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const onSubmit = async (data: FormData) => {
        try {
            if (mode === 'register') {
                await registerUser(data.email, data.password);
            } else {
                await loginUser(data.email, data.password);
            }
            reset();
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message);
            } else {
                setError("Unknown error");
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow p-6 border border-gray-200">
                {user ? (
                    <div className="text-center">
                        <p className="text-gray-800 mb-4">
                            Logged in as <strong>{user.email}</strong>
                        </p>
                        <button
                            onClick={logoutUser}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-md transition"
                            disabled={isSubmitting}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <h2 className="text-2xl font-semibold text-center mb-6">
                            {mode === 'login' ? 'Login' : 'Register'}
                        </h2>

                        <div>
                            <input
                                type="email"
                                {...register("email")}
                                placeholder="E-mail"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                type="password"
                                {...register("password")}
                                placeholder="Password"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : mode === "login" ? "Login" : "Register"}
                        </button>

                        <p className="text-center text-sm mt-4 text-gray-600">
                            {mode === "login" ? (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("register")}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Register
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        onClick={() => setMode("login")}
                                        className="text-blue-600 hover:underline font-medium"
                                    >
                                        Login
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
