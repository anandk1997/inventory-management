import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { useAuth } from "src/hooks/useAuth";
import { useAppSelector } from "src/store";

export function PublicContext() {
  const { user } = useAuth();
  const userData = useAppSelector((state) => state.storeData.user);

  if (user.isPending) return <Spinner />;
  if (userData) return <Navigate to="/" />;

  return <Outlet />;
}
