import type {Product} from "../../types.ts";
import {Link} from "react-router-dom";
import {useCart} from "../../store/cart/cart.ts";
import {formatPrice} from "../../utils/format.ts";

type Props = {
    product: Product;
}

export const ProductCard = ({product}: Props) => {
    const add = useCart((state) => state.add);

    return (
        <div className="card p-4 flex flex-col floating relative overflow-hidden">
            <div className="absolute -top-12 -right-8 w-32 h-32 bg-purple-500/15 blur-3xl" aria-hidden/>
            <div className="absolute -bottom-10 left-0 w-28 h-28 bg-cyan-400/10 blur-2xl" aria-hidden/>

            <div className="flex items-start justify-between mb-3 relative z-[1]">
                <span className="chip capitalize">{product.category}</span>
                <span className="text-sm text-white/70">#{product.id}</span>
            </div>

            <Link to={`/products/${product.id}`} className="flex flex-col items-center gap-3 relative z-[1]">
                <div className="aspect-square w-full grid place-items-center overflow-hidden rounded-2xl bg-white/5 border border-white/5">
                    <img src={product.image} alt={product.description} className="object-contain max-h-48" loading="lazy"/>
                </div>
                <h3 className="font-semibold text-white line-clamp-2 text-center leading-tight">
                    {product.title}
                </h3>
            </Link>

            <div className="mt-auto flex items-center justify-between pt-4 relative z-[1]">
                <div className="flex flex-col">
                    <span className="text-xs uppercase text-white/60 tracking-wide">Cena</span>
                    <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>
                </div>
                <button className="btn btn-primary" onClick={() => add(product)}>Dodaj do koszyka</button>
            </div>
        </div>
    )
}
