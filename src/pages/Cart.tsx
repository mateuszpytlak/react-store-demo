import {useCart} from "../store/cart/cart.ts";
import {Link} from "react-router-dom";
import {formatPrice} from "../utils/format.ts";

export const Cart = () => {
    const {items, setQty, remove, clear, totalPrice} = useCart();

    if (items.length === 0) {
        return (
            <div className="border border-[#1e1e1e] py-16 px-6 flex flex-col items-center gap-5">
                <p className="font-mono text-xs text-[#555]">// cart is empty</p>
                <Link to="/products" className="btn btn-primary font-mono text-xs">
                    browse products →
                </Link>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-[2fr_1fr] border border-[#1e1e1e]">
            {/* ── Items ──────────────────────────────────────────── */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
                    <div>
                        <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider">cart</p>
                        <h2 className="text-base font-bold text-white leading-tight">Your items</h2>
                    </div>
                    <button
                        className="btn font-mono text-xs hover:text-red-400 hover:border-red-900/50"
                        onClick={clear}
                    >
                        clear all
                    </button>
                </div>

                <ul className="divide-y divide-[#1a1a1a]">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center gap-4 px-5 py-4">
                            <div className="w-14 h-14 bg-[#0d0d0d] border border-[#1a1a1a] flex items-center justify-center shrink-0">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#ccc] line-clamp-1">
                                    {item.title}
                                </p>
                                <p className="font-mono text-xs text-[#666] mt-0.5">
                                    {formatPrice(item.price)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
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
                                <button
                                    className="btn font-mono text-xs hover:text-red-400 hover:border-red-900/50"
                                    onClick={() => remove(item.id)}
                                >
                                    rm
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="flex justify-end px-5 py-4 border-t border-[#1e1e1e] mt-auto">
                    <p className="font-mono text-sm text-[#666]">
                        total:{" "}
                        <span className="text-white font-bold text-base">
                            {formatPrice(totalPrice())}
                        </span>
                    </p>
                </div>
            </div>

            {/* ── Summary sidebar ────────────────────────────────── */}
            <aside className="border-t lg:border-t-0 lg:border-l border-[#1e1e1e] p-5 flex flex-col gap-5">
                <p className="font-mono text-[10px] text-[#555] uppercase tracking-wider">
                    // order summary
                </p>
                <div className="space-y-3 text-sm font-mono">
                    <div className="flex justify-between text-[#666]">
                        <span>subtotal</span>
                        <span>{formatPrice(totalPrice())}</span>
                    </div>
                    <div className="flex justify-between text-[#666]">
                        <span>shipping</span>
                        <span className="text-[#00ff88]">free</span>
                    </div>
                    <div className="border-t border-[#1e1e1e] pt-3 flex justify-between">
                        <span className="text-[#888]">total</span>
                        <span className="font-bold text-white">{formatPrice(totalPrice())}</span>
                    </div>
                </div>
                <Link to="/checkout" className="btn btn-primary w-full font-mono text-xs mt-auto">
                    checkout →
                </Link>
            </aside>
        </div>
    );
};
