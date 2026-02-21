import { NextResponse } from "next/server";

const WC_API = process.env.WC_API_URL;
const KEY = process.env.WC_CONSUMER_KEY;
const SECRET = process.env.WC_CONSUMER_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || 1;
  const category = searchParams.get("category");

  let url = `${WC_API}/products?per_page=24&page=${page}&status=publish`;

  if (category) {
    url += `&category=${category}`;
  }

  url += `&consumer_key=${KEY}&consumer_secret=${SECRET}`;

  const res = await fetch(url);

  const products = await res.json();

  return NextResponse.json({ products });
}