import { createBrowserRouter } from "react-router-dom";

import { AuthProvider } from "src/context/AuthContext";

import { lazy } from "react";

import { PublicContext } from "src/context/PublicContext";
import AuthCallback from "src/pages/Callback";
import { NotFound } from "src/components/NotFound";

const Dashboard = lazy(() => import("src/pages/Dashboard"));
const Products = lazy(() => import("src/pages/Products"));
const Categories = lazy(() => import("src/pages/Categories"));
const Transactions = lazy(() => import("src/pages/Transactions"));
const ChangePassword = lazy(() => import("src/pages/ChangePassword"));

const Login = lazy(() => import("src/pages/Login"));
const ForgotPassword = lazy(() => import("src/pages/forgot/Forgot"));
const ResetPassword = lazy(() => import("src/pages/forgot/Reset"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthProvider />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "products", element: <Products /> },
      { path: "categories", element: <Categories /> },
      { path: "transactions", element: <Transactions /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "*", element: <NotFound /> },
    ],
  },

  {
    path: "/",
    element: <PublicContext />,
    children: [
      { path: "login", element: <Login /> },
      { path: "forgot", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "auth/callback", element: <AuthCallback /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
