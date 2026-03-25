import {useEffect} from "react";
import {ProductCard} from "../components/ProductCard/ProductCard";
import {useProducts} from "../store/useProducts/useProducts.ts";
import {useProductFilters} from "../hooks/useProductFilters.ts";

export const Products = () => {
    const {products, fetchAll, loading, error} = useProducts();
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

    if (error) return (
        <div className="border border-red-900/30 px-4 py-3 font-mono text-xs text-red-400">
            error: {error}
        </div>
    );

    return (
        <section className="space-y-0">
            {/* ── Hero ───────────────────────────────────────────── */}
            <div className="border-b border-[#1a1a1a] pb-10 mb-10">
                <p className="font-mono text-xs text-[#555] mb-4">
                    <span className="text-[#555]">$</span> whoami
                </p>
                <p className="font-mono text-sm mb-3">
                    <span className="text-[#555]">// </span>
                    <span className="text-[#00ff88]">mateusz</span>
                    <span className="text-[#555]"> · frontend developer</span>
                </p>
                <h1 className="fancy-heading mb-4">
                    Sharp tools.<br/>
                    Built to ship.<span className="cursor-blink text-[#00ff88]">_</span>
                </h1>
                <p className="text-[#777] text-sm max-w-md leading-relaxed mb-6">
                    A demo storefront powered by the FakeStore API. React, Tailwind, Zustand,
                    Firebase, Stripe.
                </p>
                <div className="flex items-center gap-6 flex-wrap">
                    <a href="#catalog" className="btn btn-primary font-mono text-xs px-4">
                        browse catalog →
                    </a>
                    {!loading && (
                        <div className="flex items-center gap-4 font-mono text-xs text-[#555]">
                            <span>
                                <span className="text-[#00ff88]">{products.length}</span> items
                            </span>
                            <span className="text-[#1e1e1e]">/</span>
                            <span>
                                <span className="text-[#00ff88]">{categories.length}</span> categories
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Filter bar ─────────────────────────────────────── */}
            <div id="catalog" className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between border-b border-[#1a1a1a] pb-6 mb-0">
                <p className="font-mono text-xs text-[#555] shrink-0">
                    <span className="text-[#00ff88]">{filteredProducts.length}</span> results
                </p>
                <div className="flex flex-wrap gap-2">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="search..."
                        className="bg-[#0d0d0d] border border-[#222] px-3 py-[0.58rem] text-sm text-[#d4d4d4] placeholder:text-[#555] focus:outline-none focus:border-[#00ff88] focus:shadow-[0_0_0_1px_rgba(0,255,136,0.12)] transition-colors font-mono rounded-none"
                    />
                    <div className="select-shell">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="select-field"
                        >
                            <option value="all">all categories</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="select-shell">
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="select-field"
                        >
                            <option value="relevance">sort: relevance</option>
                            <option value="price-asc">price: low → high</option>
                            <option value="price-desc">price: high → low</option>
                            <option value="title-asc">title: A → Z</option>
                            <option value="title-desc">title: Z → A</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ── Product grid ───────────────────────────────────── */}
            {loading ? (
                <div className="border border-[#1a1a1a] border-t-0 px-4 py-8">
                    <p className="font-mono text-xs text-[#555]">loading...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-[#1a1a1a]">
                    {filteredProducts.map((p) => (
                        <ProductCard key={p.id} product={p}/>
                    ))}
                </div>
            )}
        </section>
    );
};
