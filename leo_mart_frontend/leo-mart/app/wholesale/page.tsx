import React from "react";
import { fetchProductsAction } from "@/lib/actions/product-action";
import WholesaleClient from "./_components/WholesaleClient";

export default async function WholesalePage() {
  const res = await fetchProductsAction({ page: 1, size: 6 });
  const products = res.success && res.data ? res.data.data : [];

  return <WholesaleClient products={products} />;
}
