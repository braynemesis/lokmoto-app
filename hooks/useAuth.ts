import { useUser, useAuth as useClerkAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useClerkAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      updateSupabaseToken();
    }
  }, [isLoaded, isSignedIn]);

  const updateSupabaseToken = async () => {
    if (!user) return;
    
    const token = await getToken({ template: "supabase" });
    
    if (token) {
      const { error } = await supabase.auth.setSession({
        access_token: token,
        refresh_token: token,
      });
      
      if (error) {
        console.error("Error updating Supabase session:", error.message);
      }
    }
  };

  return {
    isLoaded,
    isSignedIn,
    user,
  };
}