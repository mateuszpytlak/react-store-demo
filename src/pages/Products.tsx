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
        <div className="min-h-screen px-6 py-8" style={{background: "var(--bg)"}}>
            <div
                className="max-w-6xl mx-auto px-4 py-3 text-sm font-medium"
                style={{
                    border: "1px solid rgba(255,80,80,0.25)",
                    color: "#FF7070",
                    background: "rgba(255,80,80,0.05)",
                    borderRadius: "4px",
                }}
            >
                {error}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen" style={{background: "var(--bg)", color: "var(--text)"}}>

            {/* ── Hero ─────────────────────────────────────────────── */}
            <section
                className="max-w-6xl mx-auto px-6 pt-16 pb-14"
                style={{borderBottom: "1px solid var(--border)"}}
            >
                <span className="tag mb-8 inline-block">{new Date().getFullYear()} Collection</span>

                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
                    <h1 className="fancy-heading">
                        Objects<br />
                        Worth<br />
                        Wanting.
                    </h1>

                    <div className="md:max-w-[300px] md:pb-1 flex flex-col gap-8 shrink-0">
                        <p className="text-[0.9375rem] leading-relaxed" style={{color: "var(--text-muted)"}}>
                            A precision selection for those who know the difference between good and exceptional.
                        </p>
                        <div className="flex items-center gap-6 flex-wrap">
                            <a href="#catalog" className="btn btn-primary">
                                Explore All
                            </a>
                            {!loading && (
                                <p className="text-[0.8125rem]" style={{color: "var(--text-subtle)"}}>
                                    <span style={{color: "var(--accent)", fontWeight: 600}}>{products.length}</span> objects
                                    {" · "}
                                    <span style={{color: "var(--accent)", fontWeight: 600}}>{categories.length}</span> categories
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Filter bar ───────────────────────────────────────── */}
            <section
                id="catalog"
                className="max-w-6xl mx-auto px-6 py-4"
                style={{borderBottom: "1px solid var(--border)"}}
            >
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                    <p className="text-[0.8125rem] shrink-0" style={{color: "var(--text-subtle)"}}>
                        <span style={{color: "var(--text)", fontWeight: 500}}>{filteredProducts.length}</span> results
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search objects…"
                            className="bg-transparent px-3.5 py-2 text-[0.8125rem] focus:outline-none transition-all duration-200 min-w-[180px]"
                            style={{
                                border: "1px solid var(--border)",
                                color: "var(--text)",
                                borderRadius: "3px",
                            }}
                            onFocus={e => (e.target as HTMLInputElement).style.borderColor = "rgba(155,127,255,0.4)"}
                            onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border)"}
                        />

                        <div className="relative inline-flex items-center min-w-[148px]">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none w-full px-3.5 py-2 pr-8 text-[0.8125rem] focus:outline-none transition-all duration-200 cursor-pointer"
                                style={{
                                    border: "1px solid var(--border)",
                                    color: "var(--text-muted)",
                                    background: "var(--surface)",
                                    borderRadius: "3px",
                                }}
                                onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "rgba(155,127,255,0.4)"}
                                onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--border)"}
                            >
                                <option value="all" style={{background: "var(--surface-raised)"}}>All categories</option>
                                {categories.map((c) => (
                                    <option key={c} value={c} style={{background: "var(--surface-raised)"}}>{c}</option>
                                ))}
                            </select>
                            <span className="absolute right-3 pointer-events-none text-[8px] leading-none" style={{color: "var(--text-subtle)"}}>▼</span>
                        </div>

                        <div className="relative inline-flex items-center min-w-[166px]">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="appearance-none w-full px-3.5 py-2 pr-8 text-[0.8125rem] focus:outline-none transition-all duration-200 cursor-pointer"
                                style={{
                                    border: "1px solid var(--border)",
                                    color: "var(--text-muted)",
                                    background: "var(--surface)",
                                    borderRadius: "3px",
                                }}
                                onFocus={e => (e.target as HTMLSelectElement).style.borderColor = "rgba(155,127,255,0.4)"}
                                onBlur={e => (e.target as HTMLSelectElement).style.borderColor = "var(--border)"}
                            >
                                <option value="relevance" style={{background: "var(--surface-raised)"}}>Sort: Relevance</option>
                                <option value="price-asc" style={{background: "var(--surface-raised)"}}>Price: Low → High</option>
                                <option value="price-desc" style={{background: "var(--surface-raised)"}}>Price: High → Low</option>
                                <option value="title-asc" style={{background: "var(--surface-raised)"}}>Name: A – Z</option>
                                <option value="title-desc" style={{background: "var(--surface-raised)"}}>Name: Z – A</option>
                            </select>
                            <span className="absolute right-3 pointer-events-none text-[8px] leading-none" style={{color: "var(--text-subtle)"}}>▼</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Product grid ─────────────────────────────────────── */}
            <section className="max-w-6xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="py-32 flex flex-col items-center gap-5">
                        <div
                            className="w-7 h-7 rounded-full animate-spin"
                            style={{
                                border: "2px solid var(--surface-raised)",
                                borderTopColor: "var(--accent)",
                                filter: "drop-shadow(0 0 6px var(--accent-glow))",
                            }}
                        />
                        <p
                            className="text-[0.75rem] tracking-[0.18em] uppercase"
                            style={{color: "var(--text-subtle)"}}
                        >
                            Loading collection
                        </p>
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px"
                        style={{background: "var(--border)"}}
                    >
                        {filteredProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
};
