"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import SearchBar from "./SearchBar";

export default function MainHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const items = useCartStore((state) => state.items);

  const count = items.reduce((t, i) => t + i.qty, 0);
  const total = items.reduce((t, i) => t + i.qty * i.price, 0);

 useEffect(() => {
  const token = localStorage.getItem("token"); 
  setLoggedIn(!!token);

  const handleScroll = () => {
    setIsSticky(window.scrollY > 120);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "Track Order", href: "/track-order" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="w-full bg-white border-b">

      {/* TOP HEADER (Logo + Search + Cart) */}
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between gap-6 py-4">

          {/* LOGO */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="https://backend.taxzone.store/wp/wp-content/uploads/2026/02/cropped-WhatsApp-Image-2026-01-28-at-22.09.44-removebg-preview.png"
              alt="TaxZone"
              width={170}
              height={50}
              priority
              className="object-contain"
            />
          </Link>

          {/* SEARCH */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <SearchBar />
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">

            {!loggedIn && (
              <Link
                href="/login"
                className="hidden lg:flex flex-col text-sm"
              >
                <span className="text-xs text-gray-500">HELLO</span>
                <span className="font-semibold hover:text-orange-600 transition">
                  Sign In / Register
                </span>
              </Link>
            )}

            {/* CART */}
            <Link
              href="/cart"
              className="flex items-center gap-2 relative group"
            >
              <div className="relative">
                <ShoppingCart
                  size={26}
                  className={`transition ${
                    isActive("/cart")
                      ? "text-orange-600"
                      : "text-gray-700 group-hover:text-orange-600"
                  }`}
                />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex flex-col text-sm leading-tight">
                <span className="text-gray-500">Shopping Cart</span>
                <span className="font-semibold text-gray-800">
                  Rs. {total.toFixed(2)}
                </span>
              </div>
            </Link>

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="pb-4 md:hidden">
          <SearchBar />
        </div>
      </div>

      {/* STICKY NAVIGATION ONLY */}
      <div
        className={`w-full bg-white transition-all duration-300 ${
          isSticky
            ? "fixed top-0 left-0 shadow-md z-50"
            : "relative"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <nav className="hidden lg:flex items-center justify-center gap-6 py-3">

            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${
                      active
                        ? "bg-orange-600 text-white shadow"
                        : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-[260px] bg-white shadow-lg z-50 transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setMobileOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <div className="flex flex-col p-4 gap-4">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-md font-medium transition
                  ${
                    active
                      ? "bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
