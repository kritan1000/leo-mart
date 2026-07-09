import React from "react";
import Link from "next/link";
import { Users, UserPlus, Shield, UserCheck, ShoppingBag, Plus, Sparkles } from "lucide-react";
import { fetchUsersAction } from "@/lib/actions/user-action";
import { fetchProductsAction } from "@/lib/actions/product-action";
import UserTable from "../users/_components/UserTable";
import ProductTable from "../products/_components/ProductTable";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";
import LogoutButton from "../_components/LogoutButton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
    tab?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  // Await searchParams as required in Next.js 15+
  const resolvedParams = await searchParams;

  const tab = resolvedParams.tab || "users"; // default to users
  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "10", 10);
  const search = resolvedParams.search || "";

  // Call API depending on selected tab
  let usersData = { data: [], total: 0, totalPages: 0 };
  let productsData = { data: [], total: 0, totalPages: 0 };

  if (tab === "products") {
    const res = await fetchProductsAction({ page, size, search });
    if (res.success && res.data) {
      productsData = res.data;
    }
  } else {
    const res = await fetchUsersAction({ page, size, search });
    if (res.success && res.data) {
      usersData = res.data;
    }
  }

  // Always fetch total users/products to show on the header stats
  const totalUsersRes = await fetchUsersAction({ page: 1, size: 1 });
  const totalUsers = totalUsersRes.success && totalUsersRes.data ? totalUsersRes.data.total : 0;

  const totalProductsRes = await fetchProductsAction({ page: 1, size: 1 });
  const totalProducts = totalProductsRes.success && totalProductsRes.data ? totalProductsRes.data.total : 0;

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <span className="text-purple-600 font-semibold">Admin Dashboard</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <LogoutButton />
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Console</h1>
            <p className="text-sm text-gray-500">Manage user authorization and product inventory catalogs.</p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex gap-4">
            <div className="bg-white border border-purple-100/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <Users className="text-purple-600" size={20} />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Users</span>
                <span className="text-sm font-bold text-gray-800">{totalUsers}</span>
              </div>
            </div>
            <div className="bg-white border border-purple-100/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <ShoppingBag className="text-purple-600" size={20} />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Products</span>
                <span className="text-sm font-bold text-gray-800">{totalProducts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-100/60">
          <Link
            href="/admin/dashboard?tab=users"
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              tab === "users"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Users size={16} />
            System Users
          </Link>
          <Link
            href="/admin/dashboard?tab=products"
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              tab === "products"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <ShoppingBag size={16} />
            Product Inventory
          </Link>
        </div>

        {/* Table Content Render */}
        <div className="space-y-4">
          {tab === "products" ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">Products</h2>
                <Link
                  href="/admin/products/create"
                  className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
                >
                  <Plus size={16} />
                  Add Product
                </Link>
              </div>
              <ProductTable
                products={productsData.data || []}
                total={productsData.total || 0}
                totalPages={productsData.totalPages || 0}
                currentPage={page}
                pageSize={size}
                initialSearch={search}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 tracking-tight">System Users</h2>
                <Link
                  href="/admin/users/create"
                  className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
                >
                  <UserPlus size={16} />
                  Add User
                </Link>
              </div>
              <UserTable
                users={usersData.data || []}
                total={usersData.total || 0}
                totalPages={usersData.totalPages || 0}
                currentPage={page}
                pageSize={size}
                initialSearch={search}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
