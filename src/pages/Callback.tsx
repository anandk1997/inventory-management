import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "src/components/Loader";
import { supabase } from "src/lib/supabase";

const AuthCallback = () => {
  const history = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Error during callback:", error.message);
      } else {
        console.warn("User authenticated:", data);
        history("/");
      }
    };

    handleAuthCallback();
  }, [history]);

  return <Spinner />;
};

export default AuthCallback;
