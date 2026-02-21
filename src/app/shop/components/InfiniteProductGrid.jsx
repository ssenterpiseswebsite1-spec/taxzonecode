"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "../../home-content/component/products/ProductCard";

export default function InfiniteProductGrid({
  initialProducts,
  totalPages,
  selectedCategory,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          page < totalPages
        ) {
          setLoading(true);

          const nextPage = page + 1;

          const res = await fetch(
            `/api/load-more?page=${nextPage}${
              selectedCategory
                ? `&category=${selectedCategory}`
                : ""
            }`
          );

          const data = await res.json();

          setProducts((prev) => [...prev, ...data.products]);
          setPage(nextPage);
          setLoading(false);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [page, totalPages, loading, selectedCategory]);

  return (
    <>
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
          gap-5
        "
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {page < totalPages && (
        <div
          ref={loaderRef}
          className="flex justify-center py-10 text-gray-400"
        >
          Loading more products...
        </div>
      )}
    </>
  );
}