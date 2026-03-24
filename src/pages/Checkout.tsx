import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useCart } from "../store/cart/cart.ts";
import { formatPrice } from "../utils/format.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore/authStore.ts";
import { CheckCircle } from "lucide-react";
import { PaymentForm } from "./PaymentForm.tsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const schema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.email("Invalid email"),
    address: z.string().min(5, "Address is too short"),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/60";

export const Checkout = () => {
    const { items, totalPrice } = useCart();
    const { user } = useAuthStore();
    const [placed, setPlaced] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [shippingData, setShippingData] = useState<FormData | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { email: user?.email ?? "" },
    });

    const onSubmit = async (data: FormData) => {
        try {
            const res = await fetch("/api/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: totalPrice() }),
            });

            if (!res.ok) throw new Error("Failed to create payment intent");

            const { clientSecret } = await res.json();
            setClientSecret(clientSecret);
            setShippingData(data);
        } catch (e) {
            console.error(e);
            setError("Failed to initialize payment. Please try again.");
        }
    };

    if (placed) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="card glass p-10 text-center space-y-4 floating max-w-md w-full">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                    <h2 className="text-2xl font-semibold text-white">Order placed!</h2>
                    <p className="text-white/70">Thank you. Your order has been received.</p>
                    {user && (
                        <Link to="/account" className="btn btn-primary block">
                            View my orders
                        </Link>
                    )}
                    <Link to="/products" className="block text-sm text-white/50 hover:text-white/80 transition-colors">
                        Continue shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return <div className="py-10 text-center text-white/70">Your cart is empty.</div>;
    }

    if (clientSecret && shippingData) {
        return (
            <Elements stripe={stripePromise} options={{
                clientSecret,
                appearance: {
                    theme: "night",
                    variables: {
                        colorPrimary: "#a855f7",
                        colorBackground: "#ffffff0d",
                        colorText: "#ffffff",
                        colorDanger: "#fca5a5",
                        borderRadius: "16px",
                        fontFamily: "inherit",
                    },
                },
            }}>
                <PaymentForm
                    shippingData={shippingData}
                    onSuccess={() => setPlaced(true)}
                />
            </Elements>
        );
    }

    return (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <form className="card glass p-5 space-y-4 floating" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/60">Order</p>
                    <h2 className="text-xl font-semibold text-white">Shipping details</h2>
                </div>
                <div>
                    <label className="block text-sm mb-1 text-white/80">Full name*</label>
                    <input className={inputClass} {...register("name")} />
                    {errors.name && <p className="text-sm text-red-300 mt-1">{errors.name.message}</p>}
                </div>
                {!user && (
                    <div>
                        <label className="block text-sm mb-1 text-white/80">Email*</label>
                        <input className={inputClass} {...register("email")} />
                        {errors.email && <p className="text-sm text-red-300 mt-1">{errors.email.message}</p>}
                    </div>
                )}
                <div>
                    <label className="block text-sm mb-1 text-white/80">Address*</label>
                    <input className={inputClass} {...register("address")} />
                    {errors.address && <p className="text-sm text-red-300 mt-1">{errors.address.message}</p>}
                </div>
                <div>
                    <label className="block text-sm mb-1 text-white/80">Notes</label>
                    <textarea className={`${inputClass} min-h-24`} {...register("notes")} />
                </div>

                {!user && (
                    <p className="text-sm text-white/50">
                        <Link to="/login" className="text-white underline">Sign in</Link> to save your order history.
                    </p>
                )}

                {error && <p className="text-sm text-red-300">{error}</p>}

                <button disabled={isSubmitting} className="btn btn-primary">
                    {isSubmitting ? "Processing..." : "Place order"}
                </button>
            </form>

            <aside className="card glass p-5 h-fit floating">
                <h3 className="font-semibold mb-3 text-white">Summary</h3>
                <ul className="space-y-2 mb-4">
                    {items.map(item => (
                        <li key={item.id} className="flex justify-between text-sm text-white/80">
                            <span className="line-clamp-1">{item.title} × {item.qty}</span>
                            <span>{formatPrice(item.price * item.qty)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between font-semibold text-lg text-white">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice())}</span>
                </div>
            </aside>
        </div>
    );
};
