import {useEffect, useState} from "react";
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {db} from "../../firebaseConfig";
import {useAuthStore} from "../store/authStore/authStore";
import {useNavigate} from "react-router-dom";

interface Order {
    id: string;
    total: number;
    createdAt?: string;
    items: { title: string; price: number }[];
}

export const MyOrders = () => {
    const {user} = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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

    if (loading) return <p className="text-center py-10 text-white/80">Ładowanie zamówień...</p>;

    if (!orders.length)
        return (
            <div className="card glass p-8 text-center floating">
                <h2 className="text-xl font-semibold mb-2 text-white">Brak zamówień</h2>
                <p className="text-white/70">Twoje ostatnie zamówienia pojawią się tutaj.</p>
            </div>
        );

    return (
        <div className="max-w-3xl mx-auto space-y-5">
            <div className="card glass p-6 floating">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Konto</p>
                <h1 className="text-2xl font-bold text-white">Moje zamówienia</h1>
                <p className="text-white/70 mt-2">Historia zakupów uporządkowana od najnowszych.</p>
            </div>

            <ul className="space-y-4">
                {orders.map((order) => (
                    <li
                        key={order.id}
                        className="card glass p-5 shadow-xl floating"
                    >
                        <div className="flex items-center justify-between mb-2 text-white">
                            <h2 className="font-semibold">Zamówienie #{order.id}</h2>
                            <p className="text-sm text-white/70">
                                {order.createdAt
                                    ? new Date(order.createdAt).toLocaleString()
                                    : "W trakcie realizacji"}
                            </p>
                        </div>

                        <ul className="mt-3 text-sm text-white/80 space-y-1">
                            {order.items.map((item, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>- {item.title}</span>
                                    <span>{item.price.toFixed(2)} PLN</span>
                                </li>
                            ))}
                        </ul>

                        <p className="text-right font-semibold mt-4 text-white">
                            Razem: {order.total.toFixed(2)} PLN
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
};
