import {useCart} from "../store/cart/cart.ts";
import {Link} from "react-router-dom";
import {formatPrice} from "../utils/format.ts";

export const Cart = () => {
    const {items, setQty, remove, clear, totalPrice}= useCart();

    if (items.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="mb-4">Your cart is empty.</p>
                <Link to="/products" className="btn btn-primary">Browse products</Link>
            </div>
        )
    }

    return (
        <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
            <div className="card p-4">
                <h2 className="text-lg font-semibold mb-4">Cart</h2>
                <ul className="divide-y">
                    {
                        items.map((item) =>
                            <li key={item.id} className="py-4 flex items border-gray-200 items-center gap-4">
                                <img src={item.image} alt={item.title} className="w-16 h-16 object-contain"/>
                                <div className="flex-1">
                                    <div className="font-medium line-clamp-1">{item.title}</div>
                                    <div className="text-sm text-gray-600">{formatPrice(item.price)}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min={1}
                                        value={item.qty}
                                        onChange={(e) => setQty(item.id, Math.max(1, Number(e.target.value)))}
                                        className="w-16 border border-gray-200 rounded-lg px-2 py-1"
                                    />
                                    <button className="btn" onClick={ () => remove(item.id) }>Remove</button>
                                </div>
                            </li>
                        )
                    }
                </ul>
                <div className="flex justify-between items-center pt-4">
                    <button className="btn" onClick={clear}>Clear cart</button>
                    <div className="text-lg font-semibold">Total: {formatPrice(totalPrice())}</div>
                </div>
            </div>

            <aside className="card p-4 h-fit">
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="flex justify-between mb-4">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice())}</span>
                </div>
                <Link to="/checkout" className="btn btn-primary w-full">Go to checkout</Link>
            </aside>
        </div>

    )
}
