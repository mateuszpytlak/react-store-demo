import type {CartState} from "../../types.ts";
import {persist} from "zustand/middleware";
import {create} from "zustand/react";

export const useCart = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            add: (product, qty = 1) => set((state) => {
                const existingItem = state.items.find(item => item.id === product.id)
                if (existingItem) {
                    return {
                        items: state.items.map(item => item.id === product.id ? {...item, qty: item.qty + qty} : item)
                    }
                }
                return {
                    items: [{
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        qty: qty,
                    }, ...state.items]}
            }),
            remove: (id) => set( (state) => ( { items: state.items.filter(item => item.id !== id) })),
            setQty: (id, qty) => set( (state) => ({ items: state.items.map( item => item.id === id ? {...item, qty } : item) })),
            clear: () => set( { items: [] }),
            totalItems: () => get().items.reduce((acc, item) => acc + item.qty, 0),
            totalPrice: () => get().items.reduce((acc, item) => acc + item.qty * item.price, 0),
        }),
        {name: 'cart-storage'}
    )
)
