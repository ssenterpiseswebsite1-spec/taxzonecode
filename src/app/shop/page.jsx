import ProductCard from "../home-content/component/products/ProductCard";
import InfiniteProductGrid from "./components/InfiniteProductGrid";
import Link from "next/link";
import { Suspense } from "react";

const WC_API = process.env.WC_API_URL;
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

/* ---------------- FETCH PRODUCTS ---------------- */

async function getProducts({ page = 1, category = null }) {
  try {
    let url = `${WC_API}/products?per_page=24&page=${page}&status=publish`;

    if (category) url += `&category=${category}`;

    url += `&consumer_key=${KEY}&consumer_secret=${SECRET}`;

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch products");

    const totalPages = Number(res.headers.get("x-wp-totalpages")) || 1;
    const totalProducts = Number(res.headers.get("x-wp-total")) || 0;
    const products = await res.json();

    return {
      products: Array.isArray(products) ? products : [],
      totalPages,
      totalProducts,
    };
  } catch {
    return { products: [], totalPages: 1, totalProducts: 0 };
  }
}

/* ---------------- FETCH CATEGORIES ---------------- */

async function getCategories() {
  try {
    const res = await fetch(
      `${WC_API}/products/categories?per_page=100&hide_empty=true&consumer_key=${KEY}&consumer_secret=${SECRET}`,
      { next: { revalidate: 300 } }
    );

    if (!res.ok) throw new Error("Failed");

    return await res.json();
  } catch {
    return [];
  }
}

/* ---------------- SKELETON ---------------- */

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
      {[...Array(12)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl border animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-t-xl" />
          <div className="p-4 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- SHOP CONTENT ---------------- */

async function ShopContent({ selectedCategory }) {
  const categories = await getCategories();

  const categoryId = selectedCategory
    ? categories.find((c) => c.slug === selectedCategory)?.id
    : null;

  const { products, totalPages, totalProducts } =
    await getProducts({
      page: 1,
      category: categoryId,
    });

  return (
    <>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">
            Shop <span className="text-orange-600">Products</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalProducts.toLocaleString()} products available
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="sticky top-0 bg-gray-50 z-20 pb-4">
        <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">

          <Link
            href="/shop"
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
              ${
                !selectedCategory
                  ? "bg-orange-600 text-white"
                  : "bg-white border"
              }`}
          >
            All
          </Link>

          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap
                ${
                  selectedCategory === cat.slug
                    ? "bg-orange-600 text-white"
                    : "bg-white border"
                }`}
            >
              {cat.name}
            </Link>
          ))}

        </div>
      </div>

      {/* PRODUCTS */}
      <div className="mt-8">
        {products.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            No products found.
          </div>
        ) : (
          <InfiniteProductGrid
            initialProducts={products}
            totalPages={totalPages}
            selectedCategory={categoryId}
          />
        )}
      </div>
    </>
  );
}

/* ---------------- SHOP PAGE ---------------- */

export default function ShopPage({ searchParams }) {
  const selectedCategory = searchParams?.category || null;

  return (
    <section className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-10">

        <Suspense fallback={<ProductGridSkeleton />}>
          <ShopContent selectedCategory={selectedCategory} />
        </Suspense>

      </div>
    </section>
  );
}