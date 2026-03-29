import {useCart} from "../store/cart/cart.ts";
import {Link} from "react-router-dom";
import {formatPrice} from "../utils/format.ts";

export const Cart = () => {
    const {items, setQty, remove, clear, totalPrice} = useCart();

    if (items.length === 0) {
        return (
            <div
                className="py-16 px-6 flex flex-col items-center gap-5"
                style={{borderBottom: "1px solid var(--border)"}}
            >
                <p className="text-sm tracking-wide" style={{color: "var(--text-muted)"}}>Your cart is empty</p>
                <Link to="/products" className="btn btn-primary text-xs">
                    Browse collection
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-10">
            <div
                className="grid lg:grid-cols-[2fr_1fr]"
                style={{border: "1px solid var(--border)", borderRadius: "6px", overflow: "hidden"}}
            >
                {/* ── Items ──────────────────────────────────────────── */}
                <div className="flex flex-col">
                    <div
                        className="flex items-center justify-between px-5 py-4"
                        style={{borderBottom: "1px solid var(--border)"}}
                    >
                        <div>
                            <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{color: "var(--text-subtle)"}}>Cart</p>
                            <h2 className="text-base font-medium leading-tight" style={{color: "var(--text)"}}>Your items</h2>
                        </div>
                        <button
                            className="btn text-xs"
                            style={{"--hover-color": "rgb(248 113 113)"} as React.CSSProperties}
                            onClick={clear}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.color = "#f87171";
                                (e.currentTarget as HTMLElement).style.borderColor = "rgba(127,29,29,0.5)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.color = "";
                                (e.currentTarget as HTMLElement).style.borderColor = "";
                            }}
                        >
                            Clear all
                        </button>
                    </div>

                    <ul className="divide-y" style={{"--tw-divide-opacity": "1"} as React.CSSProperties}>
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center gap-4 px-5 py-4"
                                style={{borderBottom: "1px solid var(--border-subtle)"}}
                            >
                                <div
                                    className="w-14 h-14 flex items-center justify-center shrink-0 rounded-[3px]"
                                    style={{background: "var(--surface-raised)"}}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-10 h-10 object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium line-clamp-1" style={{color: "var(--text-muted)"}}>
                                        {item.title}
                                    </p>
                                    <p className="text-xs mt-0.5" style={{color: "var(--text-subtle)"}}>
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
                                        className="btn text-xs"
                                        onClick={() => remove(item.id)}
                                        onMouseEnter={e => {
                                            (e.currentTarget as HTMLElement).style.color = "#f87171";
                                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(127,29,29,0.5)";
                                        }}
                                        onMouseLeave={e => {
                                            (e.currentTarget as HTMLElement).style.color = "";
                                            (e.currentTarget as HTMLElement).style.borderColor = "";
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div
                        className="flex justify-end px-5 py-4 mt-auto"
                        style={{borderTop: "1px solid var(--border)"}}
                    >
                        <p className="text-sm" style={{color: "var(--text-muted)"}}>
                            Subtotal:{" "}
                            <span className="syne text-lg font-semibold ml-1" style={{color: "var(--text)"}}>
                                {formatPrice(totalPrice())}
                            </span>
                        </p>
                    </div>
                </div>

                {/* ── Summary sidebar ────────────────────────────────── */}
                <aside
                    className="border-t lg:border-t-0 lg:border-l p-5 flex flex-col gap-5"
                    style={{
                        background: "var(--surface-raised)",
                        borderColor: "var(--border)",
                    }}
                >
                    <p className="text-[10px] font-medium uppercase tracking-[0.18em]" style={{color: "var(--text-subtle)"}}>Summary</p>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between" style={{color: "var(--text-muted)"}}>
                            <span>Subtotal</span>
                            <span>{formatPrice(totalPrice())}</span>
                        </div>
                        <div className="flex justify-between" style={{color: "var(--text-muted)"}}>
                            <span>Shipping</span>
                            <span className="font-medium" style={{color: "var(--accent)"}}>Free</span>
                        </div>
                        <div className="pt-3 flex justify-between" style={{borderTop: "1px solid var(--border)"}}>
                            <span className="font-medium" style={{color: "var(--text)"}}>Total</span>
                            <span className="syne text-xl font-bold" style={{color: "var(--text)"}}>{formatPrice(totalPrice())}</span>
                        </div>
                    </div>
                    <Link to="/checkout" className="btn btn-primary w-full text-xs mt-auto text-center">
                        Proceed to checkout
                    </Link>
                </aside>
            </div>
        </div>
    );
};
