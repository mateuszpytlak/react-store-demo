import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useCart } from "../store/cart/cart";
import { useAuthStore } from "../store/authStore/authStore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { formatPrice } from "../utils/format";

type ShippingData = {
    name: string,
    email: string,
    address: string,
    notes?: string,
}

type Props = {
    shippingData: ShippingData;
    onSuccess: () => void;
}

export const PaymentForm = ({ shippingData, onSuccess }: Props) => {
    const [error, setError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const stripe = useStripe();
    const elements = useElements();
    const { items, totalPrice, clear } = useCart();
    const { user } = useAuthStore();

    const handlePay = async () => {
        if (!stripe || !elements) return;
        setIsProcessing(true);
        setError(null);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        })

        if (error) {
            setError(error.message ?? "Payment failed");
            setIsProcessing(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            try {
                const orderItems = items.map(({ title, price, qty }) => ({ title, price, qty }));

                if (user) {
                    await addDoc(collection(db, "users", user.uid, "orders"), {
                        name: shippingData.name,
                        email: shippingData.email,
                        address: shippingData.address,
                        notes: shippingData.notes ?? "",
                        items: orderItems,
                        total: totalPrice(),
                        paymentIntentId: paymentIntent.id,
                        paymentStatus: "paid",
                        createdAt: serverTimestamp(),
                    });
                }
                clear();
                onSuccess();
            }
            catch (e) {
                console.error(e);
                setError("Payment succeeded but order could not be saved. Contact support.");
                setIsProcessing(false);
            }
        }
    };

    return (
        <div className="card glass p-5 space-y-4 floating max-w-xl mx-auto">
            <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Step 2</p>
                <h2 className="text-xl font-semibold text-white">Payment</h2>
            </div>
            <PaymentElement />
            {error && <p className="text-sm text-red-300 mt-2">{error}</p>}
            <button onClick={handlePay} disabled={isProcessing} className="btn btn-primary w-full">
                {isProcessing ? "Processing..." : `Pay ${formatPrice(totalPrice())}`}
            </button>
        </div>
    )

}