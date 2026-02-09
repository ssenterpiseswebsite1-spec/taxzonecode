import { NextResponse } from "next/server";

const API = process.env.WC_API_URL;
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

// 🔁 SLUG → CATEGORY ID MAP
const CATEGORY_MAP = {
  "best-sellers": 15,
  "new-launch": 16,
  "trending-now": 17,
  "recommended-for-you": 18,
};

async function safeJson(res) {
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("WC products API returned non-JSON:", text.slice(0, 200));
    return [];
  }

  return res.json();
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const orderby = searchParams.get("orderby") || "date";

    let query = `?orderby=${orderby}&per_page=8`;

    if (categorySlug && CATEGORY_MAP[categorySlug]) {
      query += `&category=${CATEGORY_MAP[categorySlug]}`;
    }

    const res = await fetch(`${API}/products${query}`, {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(`${KEY}:${SECRET}`).toString("base64"),
      },
    });

    const data = await safeJson(res);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 400 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
