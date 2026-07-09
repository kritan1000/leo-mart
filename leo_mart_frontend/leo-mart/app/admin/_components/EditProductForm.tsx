"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, Camera } from "lucide-react";
import { updateProductAction } from "@/lib/actions/product-action";

interface EditProductFormProps {
  product: {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    brand: string;
    stockStatus: string;
    minBulkQty?: number;
    bulkPrice?: number;
  };
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [brand, setBrand] = useState(product.brand);
  const [stockStatus, setStockStatus] = useState(product.stockStatus);
  const [minBulkQty, setMinBulkQty] = useState(String(product.minBulkQty || ""));
  const [bulkPrice, setBulkPrice] = useState(String(product.bulkPrice || ""));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product.image);

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

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("brand", brand);
    formData.append("stockStatus", stockStatus);

    if (imageFile) {
      formData.append("image", imageFile);
    }

    formData.append("minBulkQty", minBulkQty || "0");
    formData.append("bulkPrice", bulkPrice || "0");

    try {
      const res = await updateProductAction(product._id, formData);

      if (res.success) {
        setSuccessMsg("Product updated successfully!");
        setTimeout(() => {
          router.push("/admin/dashboard?tab=products");
          router.refresh();
        }, 1500);
      } else {
        setErrorMsg(res.message || "Failed to update product");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
          <span className="text-xs text-gray-400 mt-2">Change product photo</span>
        </div>

        <div className="flex flex-col space-y-1">
          <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Product Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
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
            placeholder="Product Description"
            rows={4}
            className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="w-full border border-purple-100 px-4 py-2.5 rounded-lg text-sm text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Brand
            </label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand"
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
              placeholder="Price"
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
          <h3 className="text-sm font-bold text-purple-700">Bulk & Wholesale Pricing</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Min Bulk Qty
              </label>
              <input
                type="number"
                value={minBulkQty}
                onChange={(e) => setMinBulkQty(e.target.value)}
                placeholder="Min Qty"
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
                placeholder="Bulk Price"
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
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
