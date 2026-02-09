export async function getCategoryIdBySlug(slug) {
  if (!slug) return null;

  const res = await fetch(
    `${process.env.WC_API_URL}/products/categories?slug=${slug}&consumer_key=${process.env.WC_CONSUMER_KEY}&consumer_secret=${process.env.WC_CONSUMER_SECRET}`,
    { cache: "no-store" }
  );

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch (err) {
    console.error("Category API returned non-JSON:", text.slice(0, 200));
    return null;
  }

  if (!Array.isArray(data) || data.length === 0) {
    console.error("Category slug not found:", slug, data);
    return null;
  }

  return data[0].id;
}
