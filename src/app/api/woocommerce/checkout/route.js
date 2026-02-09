import { NextResponse } from "next/server";

async function safeJson(res) {
  const contentType = res.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("WC order API returned non-JSON:", text.slice(0, 200));
    return null;
  }

  return res.json();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { customer, items } = body;

    if (
      !customer ||
      !customer.firstName ||
      !customer.email ||
      !customer.phone ||
      !customer.address ||
      !items ||
      !items.length
    ) {
      return NextResponse.json(
        { error: "Invalid checkout data" },
        { status: 400 }
      );
    }

    const orderPayload = {
      payment_method: "cod",
      payment_method_title: "Cash on Delivery",
      set_paid: false,

      billing: {
        first_name: customer.firstName,
        last_name: customer.lastName || "",
        address_1: customer.address,
        city: customer.city || "",
        state: customer.state || "",
        postcode: customer.pincode || "",
        country: "IN",
        email: customer.email,
        phone: customer.phone,
      },

      shipping: {
        first_name: customer.firstName,
        last_name: customer.lastName || "",
        address_1: customer.address,
        city: customer.city || "",
        state: customer.state || "",
        postcode: customer.pincode || "",
        country: "IN",
      },

      line_items: items.map((item) => ({
        product_id: item.id,
        quantity: item.qty,
      })),
    };

    const auth =
      "Basic " +
      Buffer.from(
        `${process.env.WC_CONSUMER_KEY}:${process.env.WC_CONSUMER_SECRET}`
      ).toString("base64");

    const res = await fetch(
      `${process.env.WC_API_URL}/orders`,
      {
        method: "POST",
        headers: {
          Authorization: auth,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const data = await safeJson(res);

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.message || "Order failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
