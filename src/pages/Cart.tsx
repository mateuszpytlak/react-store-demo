import {useCart} from "../store/cart/cart.ts";
import {Link} from "react-router-dom";
import {formatPrice} from "../utils/format.ts";

export const Cart = () => {
    const {items, setQty, remove, clear, totalPrice} = useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-16 text-white">
                <p className="mb-4 text-white/70">Your cart is empty.</p>
                <Link to="/products" className="btn btn-primary">Browse products</Link>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <div className="card glass p-5 floating">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Cart</p>
                        <h2 className="text-xl font-semibold text-white">Your items</h2>
                    </div>
                    <button className="btn text-white" onClick={clear}>Clear</button>
                </div>
                <ul className="divide-y divide-white/10">
                    {items.map((item) =>
                        <li key={item.id} className="py-4 flex items-center gap-4">
                            <img src={item.image} alt={item.title} className="w-16 h-16 object-contain rounded-xl bg-white/5 p-2"/>
                            <div className="flex-1 text-white">
                                <div className="font-semibold line-clamp-1">{item.title}</div>
                                <div className="text-sm text-white/60">{formatPrice(item.price)}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="qty-control">
                                    <button
                                        type="button"
                                        className="qty-btn"
                                        aria-label="Decrease quantity"
                                        onClick={() => setQty(item.id, Math.max(1, item.qty - 1))}
                                    >
                                        <span className="qty-symbol">-</span>
                                    </button>
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.qty}
                                        onChange={(e) => setQty(item.id, Math.max(1, Number(e.target.value)))}
                                        className="qty-input"
                                    />
                                    <button
                                        type="button"
                                        className="qty-btn"
                                        aria-label="Increase quantity"
                                        onClick={() => setQty(item.id, item.qty + 1)}
                                    >
                                        <span className="qty-symbol">+</span>
                                    </button>
                                </div>
                                <button className="btn" onClick={() => remove(item.id)}>Remove</button>
                            </div>
                        </li>
                    )}
                </ul>
                <div className="flex justify-between items-center pt-4 text-white">
                    <div className="text-lg font-semibold">Total: {formatPrice(totalPrice())}</div>
                </div>
            </div>

            <aside className="card glass p-5 h-fit floating">
                <h3 className="font-semibold mb-3 text-white">Summary</h3>
                <div className="flex justify-between mb-4 text-white/80">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice())}</span>
                </div>
                <Link to="/checkout" className="btn btn-primary w-full">Proceed to checkout</Link>
            </aside>
        </div>
    );
};
