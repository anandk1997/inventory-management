import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { useAuth } from "src/hooks/useAuth";
import { useAppSelector } from "src/store";

export function PublicContext() {
  const { user } = useAuth();
  const userData = useAppSelector((state) => state.storeData.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData && !user.isPending) navigate("/");
  }, [userData, user.isPending, navigate]);

  if (user.isPending) return <Spinner />;
  if (userData) return <Spinner />;

  return <Outlet />;
}
