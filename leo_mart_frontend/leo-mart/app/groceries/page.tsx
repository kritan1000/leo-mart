import React from "react";
import { fetchProductsAction } from "@/lib/actions/product-action";
import CatalogClient from "./_components/CatalogClient";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function GroceriesCatalogPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "100", 10);
  const search = resolvedParams.search || "";
  const category = resolvedParams.category || "";
  const brand = resolvedParams.brand || "";
  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;

  // Fetch products server side with filters
  const res = await fetchProductsAction({
    page,
    size,
    search,
    category,
    brand,
    minPrice,
    maxPrice,
  });

  const productsData = res.success && res.data ? res.data : { data: [], total: 0, totalPages: 0 };

  return (
    <CatalogClient
      initialProducts={productsData.data || []}
      total={productsData.total || 0}
      totalPages={productsData.totalPages || 0}
      currentPage={page}
      pageSize={size}
      initialSearch={search}
      initialCategory={category}
      initialBrand={brand}
      initialMinPrice={resolvedParams.minPrice || ""}
      initialMaxPrice={resolvedParams.maxPrice || ""}
    />
  );
}
