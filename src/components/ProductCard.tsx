import type {Product} from "../types.ts";
import {Link} from "react-router-dom";

type Props = {
    product: Product;
}

export const ProductCard = ({product}: Props) => {
    return (
        <div className="card p-4 flex flex-col">
            <Link to={`/products/${product.id}`} className="flex flex-col items-center gap-3">
                <div className="aspect-square w-full grid place-items-center overflow-hidden">
                    <img src={product.image} alt={product.title} className="object-contain max-h-48" loading="lazy" />
                </div>
                <h3 className="font-medium line-clamp-2 text-center">{product.title}</h3>
            </Link>
            <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-lg font-semibold">{product.price}</span>
                <button className="btn btn-primary">Add to cart</button>
            </div>
        </div>
    )
}
