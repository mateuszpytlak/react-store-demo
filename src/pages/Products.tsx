import {useEffect, useMemo, useState} from "react";
import {fetchCategories} from "../api/products";
import {ProductCard} from "../components/ProductCard/ProductCard";
import {useProducts} from "../store/useProducts/useProducts.ts";

export const Products = () => {
    const {products, fetchAll, loading, error} = useProducts();
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sort, setSort] = useState("relevance");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    const filteredProducts = useMemo(() => {
        let list = [...products];
        if (selectedCategory !== "all") {
            list = list.filter((p) => p.category === selectedCategory);
        }
        if (debouncedQuery) {
            list = list.filter((p) =>
                p.title.toLowerCase().includes(debouncedQuery.toLowerCase())
            );
        }
        switch (sort) {
            case "price-asc":
                list.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                list.sort((a, b) => b.price - a.price);
                break;
            case "title-asc":
                list.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "title-desc":
                list.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        return list;
    }, [products, selectedCategory, sort, debouncedQuery]);

    if (error) return <div className="container py-10 text-red-300">Error: {error}</div>;
    if (loading) return <div className="container py-10 text-white/80">Loading products...</div>;

    return (
        <section className="space-y-8">
            <div className="card glass p-6 md:p-8 floating relative overflow-hidden">
                <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-purple-500/20 blur-3xl" aria-hidden/>
                <div className="absolute -left-10 bottom-0 w-60 h-60 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden/>
                <div className="relative z-[1] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <div className="chip w-fit">Fresh stock</div>
                        <h1 className="fancy-heading">Poznaj naszą wyselekcjonowaną kolekcję</h1>
                        <p className="muted max-w-xl">
                            Wybieramy najlepsze propozycje z FakeStore: styl, elektronika i lifestyle w jednym miejscu.
                            Szukaj, filtruj i porównuj bez wysiłku.
                        </p>
                        <div className="flex flex-wrap gap-4 text-white/80">
                            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                                <p className="text-xs uppercase text-white/60">Dostępne</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                                <p className="text-xs uppercase text-white/60">Kategorie</p>
                                <p className="text-2xl font-bold">{categories.length || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card glass p-4 md:p-5 flex flex-col gap-4 floating">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Kolekcja</p>
                        <h2 className="text-xl font-semibold text-white">Przeglądaj produkty</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Szukaj po nazwie..."
                            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                        <div className="select-shell">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="select-field"
                            >
                                <option value="all">Wszystkie kategorie</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="select-shell">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="select-field"
                            >
                                <option value="relevance">Sortowanie: trafność</option>
                                <option value="price-asc">Cena: od najniższej</option>
                                <option value="price-desc">Cena: od najwyższej</option>
                                <option value="title-asc">Tytuł: A-Z</option>
                                <option value="title-desc">Tytuł: Z-A</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p}/>
                ))}
            </div>
        </section>
    );
};
