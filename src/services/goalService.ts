
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addUserIdToData, getCurrentUserId } from "@/utils/authHelpers";

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
  user_id?: string;
}

export const fetchGoals = async (): Promise<Goal[]> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Map database fields to our frontend model
    return data.map(goal => ({
      id: goal.id,
      name: goal.name,
      targetAmount: Number(goal.target_amount),
      currentAmount: Number(goal.current_amount),
      deadline: goal.deadline,
      color: goal.color,
      user_id: goal.user_id
    }));
  } catch (error: any) {
    toast.error(error.message || "Failed to fetch goals");
    return [];
  }
};

export const createGoal = async (goalData: Omit<Goal, "id">): Promise<Goal | null> => {
  try {
    // Add user ID to goal data
    const goalWithUserId = await addUserIdToData(goalData);
    
    // Map our frontend model to database fields
    const { data, error } = await supabase
      .from("goals")
      .insert({
        name: goalWithUserId.name,
        target_amount: goalWithUserId.targetAmount,
        current_amount: goalWithUserId.currentAmount,
        deadline: goalWithUserId.deadline,
        color: goalWithUserId.color,
        user_id: goalWithUserId.user_id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      deadline: data.deadline,
      color: data.color,
      user_id: data.user_id
    };
  } catch (error: any) {
    toast.error(error.message || "Failed to create goal");
    return null;
  }
};

export const updateGoal = async (id: string, goalData: Partial<Omit<Goal, "id">>): Promise<Goal | null> => {
  try {
    // Convert frontend model to database fields
    const dbData: any = {};
    if (goalData.name !== undefined) dbData.name = goalData.name;
    if (goalData.targetAmount !== undefined) dbData.target_amount = goalData.targetAmount;
    if (goalData.currentAmount !== undefined) dbData.current_amount = goalData.currentAmount;
    if (goalData.deadline !== undefined) dbData.deadline = goalData.deadline;
    if (goalData.color !== undefined) dbData.color = goalData.color;

    const { data, error } = await supabase
      .from("goals")
      .update(dbData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      deadline: data.deadline,
      color: data.color,
      user_id: data.user_id
    };
  } catch (error: any) {
    toast.error(error.message || "Failed to update goal");
    return null;
  }
};

export const deleteGoal = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("goals")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to delete goal");
    return false;
  }
};

export const addMoneyToGoal = async (id: string, amount: number): Promise<Goal | null> => {
  try {
    // First get the current goal to calculate the new amount
    const { data: goal, error: fetchError } = await supabase
      .from("goals")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const newAmount = Number(goal.current_amount) + amount;

    // Then update the goal with the new amount
    const { data, error } = await supabase
      .from("goals")
      .update({ current_amount: newAmount, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      targetAmount: Number(data.target_amount),
      currentAmount: Number(data.current_amount),
      deadline: data.deadline,
      color: data.color,
      user_id: data.user_id
    };
  } catch (error: any) {
    toast.error(error.message || "Failed to add money to goal");
    return null;
  }
};
