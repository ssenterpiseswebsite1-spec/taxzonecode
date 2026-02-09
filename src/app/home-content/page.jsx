import ProductGrid from "./component/products/ProductGrid";

export default function HomePage() {
  return (
    <>
    
      <div className="min-h-[100vh]">
        <ProductGrid
        title="🔥 Best Sellers"
        slug="best-seller"
      />

      <ProductGrid
        title="🆕 New Launch"
        slug="new-launch-trending-best-seller-recommended"
      />

      <ProductGrid
        title="📈 Trending Now"
        slug="trending-now"
      />

      <ProductGrid
        title="⭐ Recommended For You"
        slug="recommended"
      />
      <div className="bg-red-600 text-white text-4xl p-10">
  Tailwind is working
</div>

      </div>
    </>
  );
}
