import { useEffect, useMemo, useState } from "react";
import { fetchCategories } from "../api/products";
import type { Product } from "../types";

export const useProductFilters = (products: Product[]) => {
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sort, setSort] = useState("relevance");
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");

    useEffect(() => {
        fetchCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timeout);
    }, [query]);

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
            case "price-asc":  list.sort((a, b) => a.price - b.price); break;
            case "price-desc": list.sort((a, b) => b.price - a.price); break;
            case "title-asc":  list.sort((a, b) => a.title.localeCompare(b.title)); break;
            case "title-desc": list.sort((a, b) => b.title.localeCompare(a.title)); break;
        }

        return list;
    }, [products, selectedCategory, debouncedQuery, sort]);

    return {
        categories,
        selectedCategory,
        setSelectedCategory,
        sort,
        setSort,
        query,
        setQuery,
        filteredProducts,
    };
};
