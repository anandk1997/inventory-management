import { User } from "@supabase/supabase-js";

interface UserData {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: User;
}

interface SupabaseAuthResponse {
  user: UserData | null;
}

export const initialState: SupabaseAuthResponse = {
  user: null,
};
