import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { supabase } from "src/lib/supabase";
import { storeUserData } from "src/store/reducers/sd";
import bcrypt from "bcryptjs";

export const useAuth = () => {
  const dispatch = useDispatch();

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  const getExistingUser = async (email: string) => {
    const user = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    return user;
  };

  const signUp = async (email: string, password: string) => {
    const { data: existingUser } = await getExistingUser(email);

    if (!!existingUser) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) throw error;

    const { error: dbError } = await supabase.from("users").insert([
      {
        email: user?.user?.email,
        user_id: user?.user?.id,
        password: hashedPassword,
      },
    ]);

    if (dbError) throw dbError;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const addUser = async (userEmail: string, provider: string, id: string) => {
    if (
      userEmail &&
      provider === "google" &&
      window.location.pathname !== "/reset-password"
    ) {
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id")
        .eq("email", userEmail);

      if (fetchError) {
        console.error("Error fetching user from DB:", fetchError.message);
        return null;
      }

      if (!!existingUser.length) {
        console.info("User already exists in DB, skipping insert.");
      } else {
        const { error: insertError } = await supabase.from("users").insert({
          id,
          user_id: id,
          email: userEmail,
        });

        if (insertError) {
          console.error("Error saving user in DB:", insertError.message);
          return null;
        }

        // Send password reset to the user's email
        const { error: sendPasswordError } =
          await supabase.auth.resetPasswordForEmail(userEmail);

        if (sendPasswordError) {
          console.error(
            "Error sending password reset email:",
            sendPasswordError.message,
          );
          return null;
        }

        console.info(
          "User saved in DB successfully and temporary password sent to email.",
        );
      }
    }
  };

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();

    if (window.location.pathname === "/reset-password") return null;

    dispatch(storeUserData(data.session));

    const userId = data?.session?.user.id;
    const userEmail = data?.session?.user.email;
    const provider = data.session?.user.app_metadata.provider;

    await addUser(userEmail!, provider!, userId!);

    return data.session;
  };

  const user = useQuery({ queryKey: ["session"], queryFn: getSession });

  return {
    signIn,
    signUp,
    signOut,
    user,
    getSession,
    getExistingUser,
  };
};
