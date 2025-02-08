import { useQuery } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { supabase } from "src/lib/supabase";
import { storeUserData } from "src/store/reducers/sd";

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

  const signUp = async (email: string, password: string) => {
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
      },
    ]);

    if (dbError) throw dbError;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();

    dispatch(storeUserData(data.session));

    return data.session;
  };

  const user = useQuery({ queryKey: ["session"], queryFn: getSession });

  return {
    signIn,
    signUp,
    signOut,
    user,
    getSession,
  };
};
