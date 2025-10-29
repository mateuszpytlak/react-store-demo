import type {Product} from "../../types.ts";
import {beforeEach, describe, expect, it} from "vitest";
import {useCart} from "./cart.ts";

const baseProduct: Product = {
    id: 1,
    title: 'Laptop',
    price: 999.99,
    description: 'High quality laptop',
    category: 'electronics',
    image: '/laptop.png',
    rating: {
        rate: 4.5,
        count: 87
    }
}

beforeEach(() => {
    useCart.setState({items: []});
    useCart.persist?.clearStorage?.();
})

describe('cart store', () => {
    it('adds new items with default quantity', () => {
        useCart.getState().add(baseProduct);

        expect(useCart.getState().items).toEqual([
            {
                id: baseProduct.id,
                title: baseProduct.title,
                price: baseProduct.price,
                image: baseProduct.image,
                qty: 1,
            },
        ]);
    });

    it('increments quantity when adding the same product', () => {
        const { add } = useCart.getState();

        add(baseProduct, 2);
        add(baseProduct);

        expect(useCart.getState().items[0]?.qty).toBe(3);
    });

    it('removes items and calculates totals', () => {
        const { add, remove, totalItems, totalPrice } = useCart.getState();
        const otherProduct: Product = { ...baseProduct, id: 2, title: 'Phone', price: 1500 };
        const anotherProduct: Product = { ...baseProduct, id: 3, title: 'Headphones', price: 389.43 };

        add(baseProduct, 2);
        add(otherProduct);
        add(anotherProduct, 3);

        expect(totalItems()).toBe(6);
        expect(totalPrice()).toBe(2 * baseProduct.price + 1 * otherProduct.price + 3 * anotherProduct.price);

        remove(baseProduct.id);

        expect(useCart.getState().items).toHaveLength(2);
        expect(totalItems()).toBe(4);
        expect(totalPrice()).toBe(1 * otherProduct.price + 3 * anotherProduct.price);
    });
})
