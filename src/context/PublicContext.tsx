import { Suspense, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { useAppSelector } from "src/store";

export function PublicContext() {
  const userData = useAppSelector((state) => state.storeData.user);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (userData) navigate("/");
  }, [userData, navigate]);

  if (userData) return <Spinner />;

  return (
    <Suspense key={location.key} fallback={<Spinner />}>
      <Outlet />
    </Suspense>
  );
}
