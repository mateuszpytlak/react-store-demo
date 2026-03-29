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

const inputClass = "w-full bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:ring-1 focus:ring-[var(--accent)] focus:border-[var(--accent)] focus:outline-none transition-colors text-sm rounded-[3px]";
const labelClass = "block text-xs font-medium uppercase tracking-widest mb-1.5";

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
                <div
                    className="p-10 text-center space-y-4 max-w-md w-full"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                    }}
                >
                    <CheckCircle className="w-10 h-10 mx-auto" style={{color: "var(--accent)"}} strokeWidth={1.5} />
                    <h2 className="syne text-3xl font-bold" style={{color: "var(--text)"}}>Order placed</h2>
                    <p className="text-sm" style={{color: "var(--text-muted)"}}>Thank you. Your order has been received.</p>
                    {user && (
                        <Link to="/account" className="btn btn-primary block w-full text-center">
                            View my orders
                        </Link>
                    )}
                    <Link
                        to="/products"
                        className="block text-sm transition-colors"
                        style={{color: "var(--text-muted)"}}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="py-16 text-center text-sm" style={{color: "var(--text-muted)"}}>
                Your cart is empty.
            </div>
        );
    }

    if (clientSecret && shippingData) {
        return (
            <Elements stripe={stripePromise} options={{
                clientSecret,
                fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500&display=swap" }],
                appearance: {
                    theme: "night",
                    variables: {
                        colorPrimary: "#9B7FFF",
                        colorBackground: "#111118",
                        colorText: "#EAE8F2",
                        colorTextSecondary: "#6C6A80",
                        colorTextPlaceholder: "#3A3850",
                        colorDanger: "#F87171",
                        borderRadius: "3px",
                        fontFamily: "'Outfit', sans-serif",
                    },
                    rules: {
                        ".Input": {
                            backgroundColor: "#111118",
                            border: "1px solid rgba(255,255,255,0.06)",
                            color: "#EAE8F2",
                            boxShadow: "none",
                            padding: "10px 14px",
                        },
                        ".Input:focus": {
                            border: "1px solid #9B7FFF",
                            boxShadow: "0 0 0 1px rgba(155,127,255,0.3)",
                        },
                        ".Label": {
                            color: "#6C6A80",
                            fontSize: "0.75rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            fontWeight: "500",
                        },
                        ".Tab": {
                            backgroundColor: "#18181F",
                            border: "1px solid rgba(255,255,255,0.06)",
                            color: "#6C6A80",
                            boxShadow: "none",
                        },
                        ".Tab:hover": {
                            backgroundColor: "#1E1E28",
                            color: "#EAE8F2",
                        },
                        ".Tab--selected": {
                            backgroundColor: "#1E1E28",
                            border: "1px solid #9B7FFF",
                            color: "#EAE8F2",
                            boxShadow: "none",
                        },
                        ".TabLabel": { color: "#6C6A80" },
                        ".TabLabel--selected": { color: "#EAE8F2" },
                        ".TermsText": { color: "#3A3850" },
                        ".TermsText a": { color: "#9B7FFF" },
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
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
                <form
                    className="p-6 space-y-5"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                    }}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{color: "var(--text-subtle)"}}>Step 1</p>
                        <h2 className="syne text-2xl font-bold" style={{color: "var(--text)"}}>Shipping details</h2>
                    </div>
                    <div>
                        <label className={labelClass} style={{color: "var(--text-muted)"}}>Full name*</label>
                        <input className={inputClass} {...register("name")} placeholder="Jane Doe" />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    {!user && (
                        <div>
                            <label className={labelClass} style={{color: "var(--text-muted)"}}>Email*</label>
                            <input className={inputClass} {...register("email")} placeholder="your@email.com" />
                            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                        </div>
                    )}
                    <div>
                        <label className={labelClass} style={{color: "var(--text-muted)"}}>Address*</label>
                        <input className={inputClass} {...register("address")} placeholder="123 Main St, City" />
                        {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address.message}</p>}
                    </div>
                    <div>
                        <label className={labelClass} style={{color: "var(--text-muted)"}}>Notes</label>
                        <textarea className={`${inputClass} min-h-24 resize-none`} {...register("notes")} placeholder="Any delivery notes…" />
                    </div>

                    {!user && (
                        <p className="text-sm" style={{color: "var(--text-muted)"}}>
                            <Link
                                to="/login"
                                className="transition-colors"
                                style={{color: "var(--accent)"}}
                                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--text)"}
                                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--accent)"}
                            >
                                Sign in
                            </Link>{" "}
                            to save your order history.
                        </p>
                    )}

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    <button disabled={isSubmitting} className="btn btn-primary w-full">
                        {isSubmitting ? "Processing…" : "Continue to payment"}
                    </button>
                </form>

                <aside
                    className="p-5 h-fit"
                    style={{
                        background: "var(--surface-raised)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                    }}
                >
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4" style={{color: "var(--text-subtle)"}}>Order summary</p>
                    <ul className="space-y-2.5 mb-4">
                        {items.map(item => (
                            <li key={item.id} className="flex justify-between text-sm" style={{color: "var(--text-muted)"}}>
                                <span className="line-clamp-1">{item.title} × {item.qty}</span>
                                <span className="shrink-0 ml-3">{formatPrice(item.price * item.qty)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="pt-3 flex justify-between items-baseline" style={{borderTop: "1px solid var(--border)"}}>
                        <span className="text-sm font-medium" style={{color: "var(--text)"}}>Total</span>
                        <span className="syne text-xl font-bold" style={{color: "var(--accent)"}}>{formatPrice(totalPrice())}</span>
                    </div>
                </aside>
            </div>
        </div>
    );
};
