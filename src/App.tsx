import {Header} from "./components/Header.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {Products} from "./pages/Products.tsx";
import {ProductDetails} from "./pages/ProductDetails.tsx";
import {Cart} from "./pages/Cart.tsx";
import {Checkout} from "./pages/Checkout.tsx";

export default function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container py-6 grow">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                </Routes>
            </main>
            <footer className="border-t border-gray-200 mt-8">
                <div className="container py-6 text-center text-sm text-gray-600">
                    React Store Demo · FakeStore API
                </div>
            </footer>
        </div>
    );
}
