"use client";

import Image from "next/image";
import Link from "next/link";

export default function CommonBanner({
  imageUrl = "https://taxzone.store/wp/wp-content/uploads/2026/02/banner-sample.jpg",
  title = "Shop the Latest Collections",
  subtitle = "Discover premium products handpicked for you",
  ctaText = "Shop Now",
  ctaLink = "/shop",
}) {
  return (
    <div className="w-full flex justify-center px-4 md:px-8 lg:px-12">
      <div className="relative w-full max-w-7xl rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
        
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover "
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Content */}
        <div className="relative flex flex-col justify-center h-[400px] sm:h-[500px] lg:h-[600px] px-6 sm:px-12 lg:px-16">
          <h2 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h2>
          {subtitle && (
            <p className="text-gray-200 text-base sm:text-lg lg:text-xl mb-6 max-w-xl drop-shadow-sm">
              {subtitle}
            </p>
          )}
          {ctaText && (
            <Link
              href={ctaLink}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
