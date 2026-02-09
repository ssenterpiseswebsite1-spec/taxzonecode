import { NextResponse } from "next/server";

async function safeJson(res) {
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("Search API returned non-JSON:", text.slice(0, 200));
    return [];
  }

  return res.json();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const res = await fetch(
    `${process.env.WC_STORE_URL}/wp-json/wc/store/products?search=${query}&per_page=8`,
    {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    }
  );

  const data = await safeJson(res);

  if (!res.ok) {
    return NextResponse.json([]);
  }

  return NextResponse.json(data);
}
