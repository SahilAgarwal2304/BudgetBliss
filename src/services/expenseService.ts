
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { addUserIdToData, getCurrentUserId } from "@/utils/authHelpers";

export type ExpenseCategory = 
  | "Food" 
  | "Transportation" 
  | "Housing" 
  | "Utilities" 
  | "Entertainment" 
  | "Shopping" 
  | "Health" 
  | "Education" 
  | "Travel" 
  | "Investments" 
  | "Personal Care" 
  | "Gifts" 
  | "Subscriptions" 
  | "Insurance" 
  | "Taxes" 
  | "Miscellaneous";

export const expenseCategories: ExpenseCategory[] = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Travel",
  "Investments",
  "Personal Care",
  "Gifts",
  "Subscriptions",
  "Insurance",
  "Taxes",
  "Miscellaneous"
];

export const categoryColors: Record<ExpenseCategory, string> = {
  "Food": "#FF9500",
  "Transportation": "#007AFF",
  "Housing": "#5856D6",
  "Utilities": "#FF2D55",
  "Entertainment": "#AF52DE",
  "Shopping": "#FF9500",
  "Health": "#4CD964",
  "Education": "#5AC8FA",
  "Travel": "#007AFF",
  "Investments": "#4CD964",
  "Personal Care": "#FF2D55",
  "Gifts": "#FF9500",
  "Subscriptions": "#5856D6",
  "Insurance": "#FF2D55",
  "Taxes": "#FF3B30",
  "Miscellaneous": "#8E8E93"
};

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  user_id?: string;
}

export const fetchExpenses = async (): Promise<Expense[]> => {
  try {
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (error) throw error;

    return data.map(expense => ({
      id: expense.id,
      amount: Number(expense.amount),
      category: expense.category as ExpenseCategory,
      description: expense.description,
      date: expense.date,
      user_id: expense.user_id
    }));
  } catch (error: any) {
    toast.error(error.message || "Failed to fetch expenses");
    return [];
  }
};

export const createExpense = async (expenseData: Omit<Expense, "id">): Promise<Expense | null> => {
  try {
    // Add user ID to expense data
    const expenseWithUserId = await addUserIdToData(expenseData);
    
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        amount: expenseWithUserId.amount,
        category: expenseWithUserId.category,
        description: expenseWithUserId.description,
        date: expenseWithUserId.date,
        user_id: expenseWithUserId.user_id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      amount: Number(data.amount),
      category: data.category as ExpenseCategory,
      description: data.description,
      date: data.date,
      user_id: data.user_id
    };
  } catch (error: any) {
    toast.error(error.message || "Failed to create expense");
    return null;
  }
};

export const updateExpense = async (id: string, expenseData: Partial<Omit<Expense, "id">>): Promise<Expense | null> => {
  try {
    const { data, error } = await supabase
      .from("expenses")
      .update(expenseData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      amount: Number(data.amount),
      category: data.category as ExpenseCategory,
      description: data.description,
      date: data.date,
      user_id: data.user_id
    };
  } catch (error: any) {
    toast.error(error.message || "Failed to update expense");
    return null;
  }
};

export const deleteExpense = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return true;
  } catch (error: any) {
    toast.error(error.message || "Failed to delete expense");
    return false;
  }
};
