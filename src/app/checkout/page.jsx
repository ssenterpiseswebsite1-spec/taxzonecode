"use client";

import { useCartStore } from "@/store/cartStore";
import { useState } from "react";
import Image from "next/image";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (!items.length) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold">Your cart is empty 🛒</h1>
      </div>
    );
  }

  const total = items.reduce(
    (sum, i) => sum + Number(i.price) * i.qty,
    0
  );

  function handleChange(e) {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  }

  async function placeOrder() {
    // 🔒 Validation
    for (let key in customer) {
      if (!customer[key]) {
        alert("Please fill all required fields");
        return;
      }
    }

    setLoading(true);

    const res = await fetch("/api/woocommerce/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        items,
      }),
    });

    const text = await res.text();

    if (res.ok) {
      clearCart();
      alert("Order placed successfully 🎉");
    } else {
      alert(data.error || "Checkout failed");
    }

    setLoading(false);
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT – FORM */}
      <div className="lg:col-span-2 bg-white border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">
          Delivery Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="firstName" placeholder="First Name" onChange={handleChange} className="input" />
          <input name="lastName" placeholder="Last Name" onChange={handleChange} className="input" />
          <input name="email" placeholder="Email" onChange={handleChange} className="input" />
          <input name="phone" placeholder="Phone" onChange={handleChange} className="input" />
          <input name="address" placeholder="Address" onChange={handleChange} className="input md:col-span-2" />
          <input name="city" placeholder="City" onChange={handleChange} className="input" />
          <input name="state" placeholder="State" onChange={handleChange} className="input" />
          <input name="pincode" placeholder="Pincode" onChange={handleChange} className="input" />
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
          <p className="font-semibold">
            Payment Method
          </p>
          <p className="text-sm text-gray-600">
            Cash on Delivery (COD)
          </p>
        </div>
      </div>

      {/* RIGHT – SUMMARY */}
      <div className="bg-white border rounded-xl p-6 h-fit">
        <h2 className="text-lg font-bold mb-4">
          Order Summary
        </h2>

        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <Image
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                width={70}
                height={70}
                className="rounded border"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  Qty: {item.qty}
                </p>
              </div>

              <p className="font-semibold">
                ₹{item.price * item.qty}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t mt-6 pt-4 flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Placing Order…" : "Place Order"}
        </button>
      </div>

      {/* Tailwind input style */}
      <style jsx>{`
        .input {
          border: 1px solid #e5e7eb;
          padding: 12px;
          border-radius: 8px;
          width: 100%;
        }
        .input:focus {
          outline: none;
          border-color: black;
        }
      `}</style>
    </div>
  );
}
