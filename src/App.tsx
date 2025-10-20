import {Header} from "./components/Header.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {Products} from "./pages/Products.tsx";
import {ProductDetails} from "./pages/ProductDetails.tsx";

export default function App() {
    return (
        <div className="flex flex-col">
            <Header />
            <main className="container py-6">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    {/*<Route path="cart" element={<Cart />} />*/}
                    {/*<Route path="checkout" element={<Checkout />} />*/}
                </Routes>
            </main>
            <footer className="border-t mt-8">
                <div className="container py-6 text-center text-sm text-gray-600">
                    React Store Demo · FakeStore API
                </div>
            </footer>
        </div>
    );
}
