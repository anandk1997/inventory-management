import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, List, History, LogOut } from "lucide-react";
import { useAuth } from "src/hooks/useAuth";
import classNames from "classnames";
import { useAppSelector } from "src/store";
import { Spinner } from "./Loader";

export default function Navbar() {
  const user = useAppSelector((state) => state.storeData.user);

  const { signoutMutation } = useAuth();

  const { pathname } = useLocation();

  const handleSignOut = async () => signoutMutation.mutate();

  const active = (path: string) => ({ "text-indigo-600": pathname === path });

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {signoutMutation.isPending && <Spinner />}

          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <Package className="h-6 w-6 text-indigo-600" />
              <span className="font-bold text-xl">Inventory Pro</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={classNames(
                  "flex items-center space-x-1 text-gray-700 hover:text-indigo-600",
                  active("/"),
                )}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/products"
                className={classNames(
                  "flex items-center space-x-1 text-gray-700 hover:text-indigo-600",
                  active("/products"),
                )}
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link
                to="/categories"
                className={classNames(
                  "flex items-center space-x-1 text-gray-700 hover:text-indigo-600",
                  active("/categories"),
                )}
              >
                <List className="h-5 w-5" />
                <span>Categories</span>
              </Link>
              <Link
                to="/transactions"
                className={classNames(
                  "flex items-center space-x-1 text-gray-700 hover:text-indigo-600",
                  active("/transactions"),
                )}
              >
                <History className="h-5 w-5" />
                <span>Transactions</span>
              </Link>
              <Link
                to="/change-password"
                className={classNames(
                  "flex items-center space-x-1 text-gray-700 hover:text-indigo-600",
                  active("/change-password"),
                )}
              >
                <History className="h-5 w-5" />
                <span>Change Password</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className={classNames(
                "flex items-center space-x-1 text-gray-700 hover:text-indigo-600 cursor-pointer",
              )}
            >
              <LogOut className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
