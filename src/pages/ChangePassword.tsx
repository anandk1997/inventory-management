import { supabase } from "src/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { Package } from "lucide-react";
import { FormEvent, useState } from "react";
import classNames from "classnames";
import { useAppSelector } from "src/store";
import { CircularProgress } from "@mui/material";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [currPassword, setCurrPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const user = useAppSelector((state) => state.storeData.user?.user);

  const updatePassword = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: user?.email!,
      password: currPassword,
    });

    if (error) throw new Error(error.message);

    const { data, error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) throw new Error(updateError.message);

    return data;
  };

  const { mutate, isPending } = useMutation({
    mutationFn: updatePassword,
    onSuccess: () => {
      setPassword("");
      setCurrPassword("");
      setRePassword("");
      setSuccess("Password changed successfully");
    },
    onError: (error: Error) => setError(`Error: ${error.message}`),
  });

  async function changePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== rePassword)
      return setError("New and Confirm password should be same");

    setSuccess("");
    setError("");

    mutate();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Password{" "}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={changePassword}>
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
              <label htmlFor="current-password" className="sr-only">
                Current Password
              </label>
              <input
                id="current-password"
                type="password"
                value={currPassword}
                onChange={(e) => setCurrPassword(e.target.value)}
                placeholder="Enter current password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="new-password" className="sr-only">
                Email address
              </label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className={classNames(
                  "appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm",
                )}
              />
            </div>

            <div>
              <label htmlFor="re-password" className="sr-only">
                Re-enter Password
              </label>
              <input
                id="re-password"
                type="password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Confirm new password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative w-full h-10 flex justify-center items-center gap-2 py-2 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-indigo-600 hover:bg-white hover:!text-indigo-600 hover:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              {isPending ? (
                <CircularProgress
                  className="!text-white group-hover:!text-indigo-600"
                  sx={{
                    scale: ".5",
                  }}
                />
              ) : (
                <>
                  Update Password
                  <Package size={15} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
