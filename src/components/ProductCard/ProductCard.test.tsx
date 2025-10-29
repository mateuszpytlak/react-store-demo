import {beforeEach, describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import {MemoryRouter} from 'react-router-dom';
import {ProductCard} from "./ProductCard.tsx";
import type {Product} from "../../types.ts";
import {useCart} from "../../store/cart/cart.ts";
import userEvent from '@testing-library/user-event';

describe('ProductCardComponent', () => {
    const product: Product = {
        id: 42,
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

    const renderComponent = () => {
        render (
            <MemoryRouter>
                <ProductCard product={product}/>
            </MemoryRouter>
        )
    }

    it('displays product title and price', () => {
        renderComponent();

        expect(screen.getByRole('link', {name: /high quality laptop/i})).toHaveAttribute('href', '/products/42');
        expect(screen.getByText(/(PLN|zł)/)).toBeInTheDocument();
    })

    it('adds product to cart', async () => {
        const user = userEvent.setup();
        renderComponent();

        await user.click(screen.getByRole('button', {name: /add to cart/i}));

        const [item] = useCart.getState().items;
        expect(item).toMatchObject({ id: product.id, qty: 1})
    })
})
