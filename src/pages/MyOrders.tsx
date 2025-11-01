import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useAuthStore } from "../store/authStore/authStore";
import { useNavigate } from "react-router-dom";

interface Order {
    id: string;
    total: number;
    createdAt?: string;
    items: { title: string; price: number }[];
}

export const MyOrders = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // jeśli nie zalogowany → redirect
    useEffect(() => {
        if (!user) navigate("/login");
    }, [user, navigate]);

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            try {
                const ordersRef = collection(db, "users", user.uid, "orders");
                const q = query(ordersRef, orderBy("createdAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Order[];

                setOrders(data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading) return <p className="text-center py-10">Loading orders...</p>;

    if (!orders.length)
        return (
            <div className="text-center py-16">
                <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
                <p className="text-gray-500">Your recent orders will appear here.</p>
            </div>
        );

    return (
        <div className="container max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">My Orders</h1>

            <ul className="space-y-4">
                {orders.map((order) => (
                    <li
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold">Order #{order.id}</h2>
                            <p className="text-sm text-gray-500">
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleString()
                                    : "Pending..."}
                            </p>
                        </div>

                        <ul className="mt-3 text-sm text-gray-700 space-y-1">
                            {order.items.map((item, index) => (
                                <li key={index}>
                                    • {item.title} – {item.price.toFixed(2)} PLN
                                </li>
                            ))}
                        </ul>

                        <p className="text-right font-semibold mt-3">
                            Total: {order.total.toFixed(2)} PLN
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
