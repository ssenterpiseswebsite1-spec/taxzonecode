"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const delay = setTimeout(async () => {
            setLoading(true);
            const res = await fetch(`/api/woocommerce/search?q=${query}`);
            const text = await res.text();
            setResults(data || []);
            setLoading(false);
        }, 300);

        return () => clearTimeout(delay);
    }, [query]);

    // 🔍 SEARCH ACTION
    const handleSearch = () => {
        if (!query.trim()) return;
        setResults([]);
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="relative w-full md:max-w-[500px]">

            {/* INPUT + ICON */}
            <div className="flex items-center border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-black w-full">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search for products..."
                    className="!w-full px-4 py-2 outline-none"
                />

                <button
                    onClick={handleSearch}
                    className="px-4 py-3 h-full bg-black text-white hover:bg-gray-800 transition"
                >
                    <Search size={18} />
                </button>
            </div>

            {/* DROPDOWN SUGGESTIONS */}
            {query.length >= 2 && (
                <div className="absolute z-50 bg-white border w-full mt-1 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {loading && (
                        <p className="p-4 text-sm text-gray-500">Searching...</p>
                    )}

                    {!loading && results.length === 0 && (
                        <p className="p-4 text-sm text-gray-500">
                            No products found
                        </p>
                    )}

                    {!loading &&
                        results.map((p) => (
                            <Link
                                key={p.id}
                                href={`/product/${p.slug}`}
                                className="flex items-center gap-3 p-3 hover:bg-gray-100"
                                onClick={() => setQuery("")}
                            >
                                <Image
                                    src={p.images?.[0]?.src || "/placeholder.png"}
                                    alt={p.name}
                                    width={40}
                                    height={40}
                                    className="rounded object-cover"
                                />
                                <div>
                                    <p className="text-sm font-medium">{p.name}</p>
                                    <p
                                        className="text-xs text-green-600"
                                        dangerouslySetInnerHTML={{
                                            __html: p.price_html,
                                        }}
                                    />
                                </div>
                            </Link>
                        ))}
                </div>
            )}
        </div>
    );
}
