import { supabase } from "../lib/supabase";
import { AlertTriangle, Package, History } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const getProducts = async () => {
    const { count: totalProducts, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) throw new Error(error.message);

    return totalProducts;
  };

  const { data: totalProducts } = useQuery({
    queryKey: ["totalProducts"],
    queryFn: getProducts,
  });

  const getLowStocks = async () => {
    const { count: lowStockItems, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .lt("quantity", 5);

    if (error) throw new Error(error.message);

    return lowStockItems;
  };

  const { data: lowStockItems } = useQuery({
    queryKey: ["lowStockItems"],
    queryFn: getLowStocks,
  });

  const getRecentTransactions = async () => {
    const { count: recentTransactions, error } = await supabase
      .from("inventory_transactions")
      .select("*", { count: "exact", head: true })
      .gte(
        "created_at",
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      );

    if (error) throw new Error(error.message);

    return recentTransactions;
  };

  const { data: recentTransactions } = useQuery({
    queryKey: ["recentTransactions"],
    queryFn: getRecentTransactions,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Products
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalProducts}
              </p>
            </div>
            <Package className="h-8 w-8 text-indigo-600" />
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Low Stock Items
              </p>
              <p className="text-2xl font-semibold text-red-600">
                {lowStockItems}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                24h Transactions
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {recentTransactions}
              </p>
            </div>
            <History className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
