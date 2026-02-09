import { NextResponse } from "next/server";

const WC_CART_URL =
  "https://taxzone.store/wp/wp-json/wc/store/cart";

async function safeJson(res) {
  const contentType = res.headers.get("content-type") || "";

  // 🛑 agar JSON nahi hai, crash mat karo
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("WC Cart returned non-JSON:", text.slice(0, 200));
    return null;
  }

  return res.json();
}

export async function GET(req) {
  const cookie = req.headers.get("cookie") || "";

  const res = await fetch(WC_CART_URL, {
    headers: {
      Cookie: cookie,
    },
    credentials: "include",
  });

  const data = await safeJson(res);

  const response = NextResponse.json(data ?? {});

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export async function POST(req) {
  const cookie = req.headers.get("cookie") || "";
  const body = await req.json();

  const res = await fetch(`${WC_CART_URL}/add-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    credentials: "include",
    body: JSON.stringify({
      id: body.product_id,
      quantity: body.quantity || 1,
    }),
  });

  const data = await safeJson(res);

  const response = NextResponse.json(data ?? {});

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}
