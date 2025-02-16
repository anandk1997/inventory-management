import Navbar from "src/components/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { useAuth } from "src/hooks/useAuth";
import { useAppSelector } from "src/store";
import { useEffect } from "react";

export function AuthProvider() {
  const { user } = useAuth();
  const userData = useAppSelector((state) => state.storeData.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userData && !user.isPending) navigate("/login");
  }, [userData, user.isPending, navigate]);

  if (user.isPending) return <Spinner />;
  if (!userData) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Outlet />
      </div>
    </div>
  );
}
