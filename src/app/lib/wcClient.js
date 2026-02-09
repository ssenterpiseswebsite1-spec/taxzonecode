export async function wcRequest(endpoint) {
  const url = `${process.env.WP_URL}/wp-json/wc/v3/${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.WC_KEY}:${process.env.WC_SECRET}`
        ).toString("base64"),
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type");

  
  if (!contentType || !contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error("WC returned non-JSON: " + text.slice(0, 100));
  }

  return res.json();
}
