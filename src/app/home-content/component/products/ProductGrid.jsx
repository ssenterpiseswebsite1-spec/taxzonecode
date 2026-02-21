import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "../AddToCartButton";
import { getCategoryIdBySlug } from "../../../lib/woocommerce";

export default async function ProductGrid({ title, slug, limit = 8 }) {
  const categoryId = await getCategoryIdBySlug(slug);

  if (!categoryId) {
    return (
      <section className="mb-12 px-4 md:px-0">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-red-600">Category not found: {slug}</p>
      </section>
    );
  }

  const res = await fetch(
    `${process.env.WC_API_URL}/products?category=${categoryId}&per_page=${limit}&status=publish&consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
    { cache: "no-store" }
  );

  const products = await res.json();
  if (!Array.isArray(products) || products.length === 0) return null;

 return (
  <section className="mb-20 bg-[#f1f3f6] py-8 rounded-[32px]">

    <div
      className="
        no-scrollbar
        flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-4
        md:grid md:grid-cols-4 lg:grid-cols-5 md:gap-6 md:overflow-visible md:px-0 max-w-7xl mx-auto
      "
    >
      {products.map((p) => {
        const image =
          p.images?.[0]?.src || "https://via.placeholder.com/600";

        const regularPrice = parseFloat(p.regular_price || 0);
        const salePrice = parseFloat(p.sale_price || 0);
        const discount =
          regularPrice && salePrice
            ? Math.round(
                ((regularPrice - salePrice) / regularPrice) * 100
              )
            : null;

        return (
          <div
            key={p.id}
            className="
              group
              min-w-[80%] sm:min-w-[65%] md:min-w-0
              bg-white
              hover:shadow-md
              transition-all duration-300
              flex flex-col
              !snap-center
              rounded-[32px]
              
            "
          >
            {/* Clickable Area */}
            <Link
              href={`/product/${p.slug}`}
              className="flex flex-col flex-1 rounded-[12px] "
            >
              {/* Image */}
              <div className="relative w-full  aspect-square bg-white rounded-[12px] overflow-hidden">
                <Image
                  src={image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-cover !rounded-[12px] group-hover:scale-105 transition-transform duration-500 p-2"
                />
              </div>

              {/* Product Info */}
              <div className="px-4 py-3 flex flex-col flex-1">

                {/* Title */}
                <h3 className="text-sm text-gray-800 line-clamp-2 leading-5 mb-1">
                  {p.name}
                </h3>

                {/* Rating (Static Style Like Flipkart) */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600 text-white text-xs px-2 py-[2px] rounded-sm font-medium">
                    4.2 ★
                  </span>
                  <span className="text-xs text-gray-500">
                    (120)
                  </span>
                </div>

                {/* Price Section */}
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
                      ₹{regularPrice}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                  {p.short_description
                    ?.replace(/(<([^>]+)>)/gi, "")
                    .slice(0, 80) ||
                    "Premium quality protection for durability and all-weather performance."}
                </p>
              </div>
            </Link>

            {/* Add To Cart */}
            <div className="px-4 pb-4">
              <AddToCartButton product={p} />
            </div>
          </div>
        );
      })}
    </div>
  </section>
);
}
