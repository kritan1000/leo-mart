import React from "react";
import Link from "next/link";
import { Users, UserPlus, Shield, UserCheck, ShoppingBag, Plus, Sparkles, MessageSquare, Package, Building2 } from "lucide-react";
import { fetchUsersAction } from "@/lib/actions/user-action";
import { fetchProductsAction } from "@/lib/actions/product-action";
import { fetchQuotationsAction } from "@/lib/actions/quotation-action";
import { fetchAllOrdersAction } from "@/lib/actions/order-action";
import { fetchBusinessAccountsAction } from "@/lib/actions/user-action";
import UserTable from "../users/_components/UserTable";
import ProductTable from "../products/_components/ProductTable";
import QuotationTable from "../quotations/_components/QuotationTable";
import OrderTable from "../orders/_components/OrderTable";
import BusinessAccountTable from "../business-accounts/_components/BusinessAccountTable";
import { LeoMartLogo } from "../../(auth)/_components/type/AuthComponent";
import LogoutButton from "../_components/LogoutButton";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    search?: string;
    tab?: string;
    orderStatus?: string;
    baStatus?: string;
  }>;
}

export default async function AdminDashboardPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;

  const tab = resolvedParams.tab || "users";
  const page = parseInt(resolvedParams.page || "1", 10);
  const size = parseInt(resolvedParams.size || "10", 10);
  const search = resolvedParams.search || "";
  const orderStatus = resolvedParams.orderStatus || "";
  const baStatus = resolvedParams.baStatus || "";

  let usersData = { data: [], total: 0, totalPages: 0 };
  let productsData = { data: [], total: 0, totalPages: 0 };
  let quotationsData = { data: [], total: 0, totalPages: 0 };
  let ordersData: any = { data: [], meta: { total: 0, totalPages: 0 } };
  let businessAccountsData: any = { data: [], total: 0, totalPages: 0 };

  if (tab === "products") {
    const res = await fetchProductsAction({ page, size, search });
    if (res.success && res.data) productsData = res.data;
  } else if (tab === "quotes") {
    const res = await fetchQuotationsAction({ page, size });
    if (res.success && res.data) quotationsData = res.data;
  } else if (tab === "orders") {
    const res = await fetchAllOrdersAction(page, size, orderStatus || undefined);
    if (res.success) ordersData = res;
  } else if (tab === "business-accounts") {
    const res = await fetchBusinessAccountsAction({ page, size, status: baStatus || undefined });
    if (res.success && res.data) businessAccountsData = res.data;
  } else {
    const res = await fetchUsersAction({ page, size, search });
    if (res.success && res.data) usersData = res.data;
  }

  const totalUsersRes = await fetchUsersAction({ page: 1, size: 1 });
  const totalUsers = totalUsersRes.success && totalUsersRes.data ? totalUsersRes.data.total : 0;

  const totalProductsRes = await fetchProductsAction({ page: 1, size: 1 });
  const totalProducts = totalProductsRes.success && totalProductsRes.data ? totalProductsRes.data.total : 0;

  const totalQuotesRes = await fetchQuotationsAction({ page: 1, size: 1 });
  const totalQuotes = totalQuotesRes.success && totalQuotesRes.data ? totalQuotesRes.data.total : 0;

  const totalOrdersRes = await fetchAllOrdersAction(1, 1);
  const totalOrders = totalOrdersRes.success && totalOrdersRes.meta ? totalOrdersRes.meta.total : 0;

  const totalBARes = await fetchBusinessAccountsAction({ page: 1, size: 1 });
  const totalBA = totalBARes.success && totalBARes.data ? totalBARes.data.total : 0;

  const tabs = [
    { id: "users", label: "System Users", icon: Users },
    { id: "products", label: "Product Inventory", icon: ShoppingBag },
    { id: "orders", label: "Orders", icon: Package },
    { id: "business-accounts", label: "Business Accounts", icon: Building2 },
    { id: "quotes", label: "Wholesale Quotes", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
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

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Console</h1>
            <p className="text-sm text-gray-500">Manage users, products, orders, business accounts, and quotations.</p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <div className="bg-white border border-purple-100/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <Users className="text-purple-600" size={18} />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Users</span>
                <span className="text-sm font-bold text-gray-800">{totalUsers}</span>
              </div>
            </div>
            <div className="bg-white border border-purple-100/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <ShoppingBag className="text-purple-600" size={18} />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Products</span>
                <span className="text-sm font-bold text-gray-800">{totalProducts}</span>
              </div>
            </div>
            <div className="bg-white border border-purple-100/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <Package className="text-purple-600" size={18} />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Orders</span>
                <span className="text-sm font-bold text-gray-800">{totalOrders}</span>
              </div>
            </div>
            <div className="bg-white border border-purple-100/60 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
              <Building2 className="text-purple-600" size={18} />
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase block">B2B Apps</span>
                <span className="text-sm font-bold text-gray-800">{totalBA}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-purple-100/60 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                href={`/admin/dashboard?tab=${t.id}`}
                className={`px-5 py-3 text-sm font-semibold border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
                  tab === t.id
                    ? "border-purple-600 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon size={16} />
                {t.label}
              </Link>
            );
          })}
        </div>

        {/* Table Content */}
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
          ) : tab === "orders" ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Orders</h2>
              <OrderTable
                orders={ordersData.data || []}
                total={ordersData.meta?.total || 0}
                totalPages={ordersData.meta?.totalPages || 0}
                currentPage={page}
                pageSize={size}
                currentStatus={orderStatus}
              />
            </>
          ) : tab === "business-accounts" ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">Business Account Applications</h2>
              <BusinessAccountTable
                users={businessAccountsData.data || []}
                total={businessAccountsData.total || 0}
                totalPages={businessAccountsData.totalPages || 0}
                currentPage={page}
                pageSize={size}
                currentFilter={baStatus}
              />
            </>
          ) : tab === "quotes" ? (
            <QuotationTable
              quotations={quotationsData.data || []}
              total={quotationsData.total || 0}
              totalPages={quotationsData.totalPages || 0}
              currentPage={page}
              pageSize={size}
            />
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
