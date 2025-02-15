import React, { useState } from "react";
import { X } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useQuery, useMutation } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [formData, setFormData] = useState({
    product_id: "",
    type: "IN",
    quantity: 1,
    notes: "",
  });
  const [error, setError] = useState("");

  const {
    data: products,
    isPending: isProductsLoading,
    error: productsError,
  } = useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, sku, quantity")
        .order("name");
      if (error) throw error;
      return data || [];
    },
  });

  const selectedProduct =
    products?.find((p) => p.id === formData.product_id) || null;

  const transactionMutation = useMutation({
    mutationFn: async (transaction: {
      product_id: string;
      type: string;
      quantity: number;
      notes: string;
    }) => {
      const { error } = await supabase
        .from("inventory_transactions")
        .insert([transaction]);
      if (error) throw error;
      return transaction;
    },
    onSuccess: () => {
      onSave();
      onClose();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    if (
      formData.type === "OUT" &&
      formData.quantity > selectedProduct.quantity
    ) {
      setError("Insufficient stock for this transaction");
      return;
    }

    transactionMutation.mutate(formData);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">New Transaction</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {(error || (productsError as Error)?.message) && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">
              {error || (productsError as Error).message}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product
            </label>
            <select
              required
              value={formData.product_id}
              onChange={(e) =>
                setFormData({ ...formData, product_id: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a product</option>
              {isProductsLoading ? (
                <option disabled>Loading products...</option>
              ) : (
                products?.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} ({product.sku}) - Stock: {product.quantity}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: parseInt(e.target.value) })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {selectedProduct && formData.type === "OUT" && (
              <p className="mt-1 text-sm text-gray-500">
                Available stock: {selectedProduct.quantity}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={transactionMutation.isPending}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {transactionMutation.isPending ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
