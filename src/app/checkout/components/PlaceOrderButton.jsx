"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function PlaceOrderButton({ customer }) {
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function placeOrder() {
    if (!items.length) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/woocommerce/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer,
          items,
        }),
      });

      const text = await res.text();

      if (!res.ok) throw new Error(data.error);

      clearCart();
      router.push(`/order-success?order=${data.orderId}`);
    } catch (err) {
      alert(err.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={placeOrder}
      disabled={loading}
      className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition"
    >
      {loading ? "Placing order…" : "Place Order"}
    </button>
  );
}
