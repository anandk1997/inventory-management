import Navbar from "src/components/Navbar";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { useAuth } from "src/hooks/useAuth";
import { useAppSelector } from "src/store";

export function AuthProvider() {
  const { user } = useAuth();
  const userData = useAppSelector((state) => state.storeData.user);

  if (user.isPending) return <Spinner />;
  if (!userData) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
