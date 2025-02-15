import { CircularProgress } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { FormEvent, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "src/hooks/useAuth";
import { supabase } from "src/lib/supabase";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { getExistingUser } = useAuth();

  const forgot = async () => {
    const { data: existingUser } = await getExistingUser(email);

    if (!existingUser) throw new Error("User not found");

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });

    if (error) throw new Error(error.message);
    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: forgot,
    onSuccess: () => setSuccess("Password reset email sent successfully."),
    onError: (error) => setError(error.message),
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot Password
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {success && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{success}</span>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                id="email-address"
                name="email"
                autoComplete="email"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group h-10 relative w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isPending ? (
                <CircularProgress sx={{ scale: ".5", color: "white" }} />
              ) : (
                <>
                  Forgot Password
                  <Package size={15} />
                </>
              )}
            </button>
          </div>

          <div className="text-center">
            <NavLink
              to="/login"
              type="button"
              onClick={() => {}}
              className="text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
