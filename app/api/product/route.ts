import { connection, NextResponse } from "next/server";
import { PRODUCT } from "@/lib/product";

export async function GET() {
  // Ensure this handler runs per request so PRODUCT_API_MODE is respected.
  await connection();

  const mode = process.env.PRODUCT_API_MODE;

  if (mode === "error") {
    return NextResponse.json({ error: "unavailable" }, { status: 500 });
  }

  if (mode === "slow") {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  return NextResponse.json(PRODUCT);
}
