import { useEffect } from "react";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { useProducts } from "../store/useProducts/useProducts.ts";
import { useProductFilters } from "../hooks/useProductFilters.ts";

export const Products = () => {
    const { products, fetchAll, loading, error } = useProducts();
    const {
        categories,
        selectedCategory, setSelectedCategory,
        sort, setSort,
        query, setQuery,
        filteredProducts,
    } = useProductFilters(products);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

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
                        <h1 className="fancy-heading">Explore our curated collection</h1>
                        <p className="muted max-w-xl">
                            We pick the best from FakeStore: style, electronics, and lifestyle in one place.
                            Search, filter, and compare with ease.
                        </p>
                        <div className="flex flex-wrap gap-4 text-white/80">
                            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                                <p className="text-xs uppercase text-white/60">Available</p>
                                <p className="text-2xl font-bold">{products.length}</p>
                            </div>
                            <div className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3">
                                <p className="text-xs uppercase text-white/60">Categories</p>
                                <p className="text-2xl font-bold">{categories.length || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card glass p-4 md:p-5 flex flex-col gap-4 floating">
                <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-white/60">Collection</p>
                        <h2 className="text-xl font-semibold text-white">Browse products</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search by name..."
                            className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                        <div className="select-shell">
                            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="select-field">
                                <option value="all">All categories</option>
                                {categories.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="select-shell">
                            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select-field">
                                <option value="relevance">Sort: relevance</option>
                                <option value="price-asc">Price: low to high</option>
                                <option value="price-desc">Price: high to low</option>
                                <option value="title-asc">Title: A-Z</option>
                                <option value="title-desc">Title: Z-A</option>
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
