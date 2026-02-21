"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "../../../../store/cartStore";
import { useState } from "react";

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(false);

  const image =
    product.images?.[0]?.src ||
    "https://via.placeholder.com/600";

  const regularPrice = parseFloat(product.regular_price || 0);
  const salePrice = parseFloat(product.sale_price || 0);
  const discount =
    regularPrice && salePrice
      ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
      : null;

  function handleAdd() {
    setLoading(true);

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image,
    });

    setTimeout(() => setLoading(false), 400);
  }

  return (
    <div
      className="
        group
        bg-white
        border border-gray-100
        hover:shadow-lg
        hover:-translate-y-1
        transition-all duration-300
        flex flex-col
        rounded-2xl
        overflow-hidden
        will-change-transform
      "
    >
      {/* Clickable Area */}
      <Link
        href={`/product/${product.slug}`}
        className="flex flex-col flex-1"
      >
        {/* Image */}
        <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 90vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          {/* Optional Discount Badge */}
          {discount && (
            <span className="absolute top-3 left-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-md">
              {discount}% OFF
            </span>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 py-3 flex flex-col flex-1">
          {/* Title */}
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-5 mb-1 min-h-[40px]">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-600 text-white text-xs px-2 py-[2px] rounded font-medium">
              4.2 ★
            </span>
            <span className="text-xs text-gray-500">(120)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-2">
            {salePrice ? (
              <>
                <span className="text-base font-semibold text-gray-900">
                  ₹{salePrice}
                </span>
                <span className="text-xs text-gray-500 line-through">
                  ₹{regularPrice}
                </span>
                {discount && (
                  <span className="text-xs text-green-600 font-medium">
                    {discount}% off
                  </span>
                )}
              </>
            ) : (
              <span className="text-base font-semibold text-gray-900">
                ₹{regularPrice || product.price}
              </span>
            )}
          </div>

          {/* Short Description */}
          <p className="text-xs text-gray-500 line-clamp-2 flex-1">
            {product.short_description
              ?.replace(/(<([^>]+)>)/gi, "")
              .slice(0, 80) ||
              "Premium quality protection for durability and all-weather performance."}
          </p>
        </div>
      </Link>

      {/* Add To Cart */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAdd}
          disabled={loading}
          className={`
            w-full py-2.5 rounded-xl text-sm font-medium
            transition-all duration-300
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#c1420e] hover:bg-[#92300a] active:scale-[0.98]"
            }
            text-white
          `}
        >
          {loading ? "Adding…" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}