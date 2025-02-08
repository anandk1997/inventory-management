import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { AlertTriangle, Package, History } from "lucide-react";

interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  recentTransactions: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    recentTransactions: 0,
  });

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Get total products
        const { count: totalProducts } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Get low stock items
        const { count: lowStockItems } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("quantity", "min_quantity");

        // Get recent transactions count (last 24 hours)
        const { count: recentTransactions } = await supabase
          .from("inventory_transactions")
          .select("*", { count: "exact", head: true })
          .gte(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          );

        setStats({
          totalProducts: totalProducts || 0,
          lowStockItems: lowStockItems || 0,
          recentTransactions: recentTransactions || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    }

    fetchDashboardStats();
  }, []);

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
                {stats.totalProducts}
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
                {stats.lowStockItems}
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
                {stats.recentTransactions}
              </p>
            </div>
            <History className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
