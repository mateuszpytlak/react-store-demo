import {Header} from "./components/Header/Header.tsx";
import {Navigate, Route, Routes} from "react-router-dom";
import {Products} from "./pages/Products.tsx";
import {ProductDetails} from "./pages/ProductDetails.tsx";
import {Cart} from "./pages/Cart.tsx";
import {Checkout} from "./pages/Checkout.tsx";
import {useEffect} from "react";
import {initAuthListener} from "./services/auth.ts";
import {AuthForm} from "./components/AuthForm/AuthForm.tsx";
import {MyOrders} from "./pages/MyOrders.tsx";

export default function App() {
    useEffect(() => {
        initAuthListener();
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(124,58,237,0.2),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_60%_80%,rgba(59,130,246,0.2),transparent_32%)]"/>
                <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.04),transparent)]"/>
            </div>

            <Header/>

            <main className="container py-10 grow relative z-[1] space-y-10">
                <Routes>
                    <Route path="/" element={<Navigate to="/products" replace/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:id" element={<ProductDetails/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/checkout" element={<Checkout/>}/>
                    <Route path="/login" element={<AuthForm/>}/>
                    <Route path="/account" element={<MyOrders/>}/>
                </Routes>
            </main>

            <footer className="mt-10 relative z-[1]">
                <div className="container py-8 text-center text-sm text-white/60">
                    React Store Demo - FakeStore API
                </div>
            </footer>
        </div>
    );
}
