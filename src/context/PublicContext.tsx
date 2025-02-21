import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { useAppSelector } from "src/store";

export function PublicContext() {
  const userData = useAppSelector((state) => state.storeData.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData) navigate("/");
  }, [userData, navigate]);

  if (userData) return <Spinner />;

  return <Outlet />;
}
