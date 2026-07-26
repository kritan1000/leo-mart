"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Upload, Camera } from "lucide-react";
import { createProductAction } from "@/lib/actions/product-action";
import { LeoMartLogo } from "../../../(auth)/_components/type/AuthComponent";

export default function CreateProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [stockStatus, setStockStatus] = useState("in-stock");
  const [minBulkQty, setMinBulkQty] = useState("");
  const [bulkPrice, setBulkPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!name.trim() || !description.trim() || !price.trim() || !category.trim() || !brand.trim()) {
      setErrorMsg("All fields except bulk constraints are required");
      return;
    }

    if (!imageFile) {
      setErrorMsg("Product image is required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("stockStatus", stockStatus);
    formData.append("image", imageFile); // File upload field matches backend upload.single("image")

    if (minBulkQty) {
      formData.append("minBulkQty", minBulkQty);
    }
    if (bulkPrice) {
      formData.append("bulkPrice", bulkPrice);
    }

    try {
      const res = await createProductAction(formData);

      if (res.success) {
        setSuccessMsg("Product created successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard?tab=products");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(res.message || "Failed to create product");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col text-black font-sans">
      <header className="bg-white border-b border-purple-100 py-4 px-6 flex items-center justify-between shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="transition hover:opacity-90">
            <LeoMartLogo size={24} />
          </Link>
          <nav className="flex items-center gap-2 text-sm font-medium text-gray-500">
            <Link href="/admin/dashboard?tab=products" className="hover:text-purple-600 transition">
              Admin Dashboard
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-purple-600 font-semibold">Add Product</span>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard?tab=products"
            className="flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-600">
            <ShoppingBag size={24} />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              Add New Product
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Fill in the details to publish a new product to the marketplace catalog.
          </p>
        </div>

        <div className="bg-white border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/5 p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errorMsg && (
              <div className="text-xs bg-red-50 text-red-500 border border-red-200 px-3 py-2.5 rounded-lg text-center font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-2.5 rounded-lg text-center font-medium">
                {successMsg}
              </div>
            )}

            {/* Product Image Selection */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative group">
                <div className="w-40 h-40 border border-purple-100 bg-purple-50/20 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Upload className="text-purple-400" size={32} />
                  )}
                </div>
                <label
                  htmlFor="product-image-upload"
                  className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transition shadow-md"
                >
                  <Camera size={16} />
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
              <span className="text-xs text-gray-400 mt-2">Upload product photo</span>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Product Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Premium Basmati Rice"
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product details, package weight, ingredients, etc."
                rows={4}
                className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                  <option value="">Select Category</option>
                  <option value="Noodles & Pasta">Noodles & Pasta</option>
                  <option value="Rice & Grains">Rice & Grains</option>
                  <option value="Flour & Baking">Flour & Baking</option>
                  <option value="Lentils & Pulses">Lentils & Pulses</option>
                  <option value="Spices & Masala">Spices & Masala</option>
                  <option value="Cooking Oil & Ghee">Cooking Oil & Ghee</option>
                  <option value="Tea & Coffee">Tea & Coffee</option>
                  <option value="Dairy Products">Dairy Products</option>
                  <option value="Beverages & Drinks">Beverages & Drinks</option>
                  <option value="Snacks & Chips">Snacks & Chips</option>
                  <option value="Biscuits & Cookies">Biscuits & Cookies</option>
                  <option value="Bread & Bakery">Bread & Bakery</option>
                  <option value="Ready to Eat">Ready to Eat</option>
                  <option value="Cleaning & Household">Cleaning & Household</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Baby Care">Baby Care</option>
                  <option value="Dry Fruits & Nuts">Dry Fruits & Nuts</option>
                  <option value="Pickles & Chutneys">Pickles & Chutneys</option>
                  <option value="Sugar & Sweeteners">Sugar & Sweeteners</option>
                  <option value="Salt & Condiments">Salt & Condiments</option>
                </select>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Royal Harvest"
                  className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Retail Price (Rs.)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 1500"
                  className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stock Status
                </label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                >
                  <option value="in-stock">In Stock</option>
                  <option value="bulk-deal">Bulk Deal</option>
                  <option value="low-stock">Low Stock</option>
                </select>
              </div>
            </div>

            {/* Wholesale/Bulk Section */}
            <div className="border-t border-purple-50 pt-4 space-y-4">
              <h3 className="text-sm font-bold text-purple-700">Bulk & Wholesale Pricing (Optional)</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Min Bulk Qty
                  </label>
                  <input
                    type="number"
                    value={minBulkQty}
                    onChange={(e) => setMinBulkQty(e.target.value)}
                    placeholder="e.g. 20 bags"
                    className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Bulk Price per unit (Rs.)
                  </label>
                  <input
                    type="number"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    placeholder="e.g. 1350"
                    className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <Link
                href="/admin/dashboard?tab=products"
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-purple-600 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm shadow-md hover:shadow-lg hover:shadow-purple-500/10 active:scale-95 transition"
              >
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
