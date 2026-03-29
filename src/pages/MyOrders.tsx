import {useEffect, useState} from "react";
import {collection, getDocs, orderBy, query, type Timestamp} from "firebase/firestore";
import {db} from "../../firebaseConfig";
import {useAuthStore} from "../store/authStore/authStore";

interface Order {
    id: string;
    total: number;
    createdAt?: Timestamp;
    items: { title: string; price: number }[];
}

export const MyOrders = () => {
    const {user} = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return (
        <div className="py-16 flex flex-col items-center gap-4">
            <div
                className="w-7 h-7 rounded-full animate-spin"
                style={{
                    border: "2px solid var(--surface-raised)",
                    borderTopColor: "var(--accent)",
                    filter: "drop-shadow(0 0 6px var(--accent-glow))",
                }}
            />
        </div>
    );

    if (!orders.length) return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div
                className="p-10 text-center max-w-md mx-auto"
                style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                }}
            >
                <h2 className="syne text-2xl font-bold mb-2" style={{color: "var(--text)"}}>No orders yet</h2>
                <p className="text-sm" style={{color: "var(--text-muted)"}}>Your latest orders will appear here.</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div className="max-w-3xl mx-auto space-y-5">
                <div
                    className="p-6"
                    style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                    }}
                >
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-1" style={{color: "var(--text-subtle)"}}>Account</p>
                    <h1 className="syne text-3xl font-bold" style={{color: "var(--text)"}}>My orders</h1>
                    <p className="text-sm mt-2" style={{color: "var(--text-muted)"}}>Purchase history sorted from newest.</p>
                </div>

                <ul className="space-y-4">
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            className="p-5"
                            style={{
                                background: "var(--surface)",
                                border: "1px solid var(--border)",
                                borderRadius: "6px",
                            }}
                        >
                            <div
                                className="flex items-center justify-between mb-3 pb-3"
                                style={{borderBottom: "1px solid var(--border)"}}
                            >
                                <h2 className="text-sm font-medium" style={{color: "var(--text-muted)"}}>Order #{order.id}</h2>
                                <p className="text-xs" style={{color: "var(--text-subtle)"}}>
                                    {order.createdAt
                                        ? order.createdAt.toDate().toLocaleString("pl-PL")
                                        : "In progress"}
                                </p>
                            </div>

                            <ul className="space-y-1.5">
                                {order.items.map((item, index) => (
                                    <li key={index} className="flex justify-between text-sm" style={{color: "var(--text-muted)"}}>
                                        <span className="line-clamp-1">{item.title}</span>
                                        <span className="shrink-0 ml-4">{item.price.toFixed(2)} PLN</span>
                                    </li>
                                ))}
                            </ul>

                            <p
                                className="text-right text-sm mt-3 pt-3"
                                style={{borderTop: "1px solid var(--border)"}}
                            >
                                <span className="mr-2" style={{color: "var(--text-subtle)"}}>Total</span>
                                <span className="syne text-lg font-bold" style={{color: "var(--accent)"}}>{order.total.toFixed(2)} PLN</span>
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
