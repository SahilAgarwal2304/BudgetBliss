
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to check if a user is logged in
 * @returns A promise resolving to a boolean value
 */
export const checkAuthentication = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Authentication error:", error.message);
      return false;
    }
    
    return !!data.session;
  } catch (error) {
    console.error("Failed to check authentication status:", error);
    return false;
  }
};

/**
 * Helper function to handle logout
 */
export const handleLogout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast.error("Error signing out: " + error.message);
      return;
    }
    
    toast.success("Successfully signed out");
    window.location.href = "/login";
  } catch (error) {
    console.error("Failed to log out:", error);
    toast.error("Failed to log out. Please try again.");
  }
};

/**
 * Get the current user's ID
 * @returns A promise resolving to the user ID or null
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return null;
    }
    
    return data.session.user.id;
  } catch (error) {
    console.error("Failed to get current user ID:", error);
    return null;
  }
};

/**
 * Ensure user ID is included in data operations
 * This helper adds the current user's ID to any data object
 * @param data The data object to add the user ID to
 * @returns The data object with the user ID added
 */
export const addUserIdToData = async <T extends object>(data: T): Promise<T & { user_id: string }> => {
  const userId = await getCurrentUserId();
  
  if (!userId) {
    throw new Error("User is not authenticated");
  }
  
  return {
    ...data,
    user_id: userId
  };
};
