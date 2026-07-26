import React from "react";
import { notFound } from "next/navigation";
import { fetchProductByIdAction } from "@/lib/actions/product-action";
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await fetchProductByIdAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <ProductDetailClient product={res.data} />;
}
