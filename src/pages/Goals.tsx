
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import GoalCard from "@/components/goals/GoalCard";
import GoalForm from "@/components/goals/GoalForm";
import AddMoneyForm from "@/components/goals/AddMoneyForm";
import { useToast } from "@/hooks/use-toast";
import { Goal, fetchGoals, createGoal, updateGoal, deleteGoal, addMoneyToGoal } from "@/services/goalService";
import { useAuth } from "@/context/SupabaseAuthContext";

const Goals = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddMoneyDialogOpen, setIsAddMoneyDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch goals from the database
  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: fetchGoals,
    enabled: !!user, // Only run if user is authenticated
  });

  // Mutations for CRUD operations
  const createGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsAddDialogOpen(false);
      toast({
        title: "Goal Created",
        description: "Your goal has been created successfully.",
      });
    }
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Goal, "id">> }) => 
      updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsEditDialogOpen(false);
      setSelectedGoal(null);
      toast({
        title: "Goal Updated",
        description: "Your goal has been updated successfully.",
      });
    }
  });

  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: "Goal Deleted",
        description: "Your goal has been deleted.",
      });
    }
  });

  const addMoneyMutation = useMutation({
    mutationFn: ({ id, amount }: { id: string, amount: number }) => 
      addMoneyToGoal(id, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      setIsAddMoneyDialogOpen(false);
      setSelectedGoal(null);
      toast({
        title: "Money Added",
        description: "Money has been added to your goal.",
      });
    }
  });

  const initialGoalValues = {
    name: "",
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date().toISOString().split('T')[0],
    color: "#3CDFB4",
  };

  const handleAddGoal = (values: Omit<Goal, 'id'>) => {
    createGoalMutation.mutate(values);
  };

  const handleEditGoal = (values: Omit<Goal, 'id'>) => {
    if (!selectedGoal) return;
    updateGoalMutation.mutate({ 
      id: selectedGoal.id, 
      data: values
    });
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoalMutation.mutate(id);
  };

  const handleAddMoney = (goalId: string, amount: number) => {
    addMoneyMutation.mutate({ id: goalId, amount });
  };

  const openEditDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  const openAddMoneyDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddMoneyDialogOpen(true);
  };

  return (
    <Layout>
      <div className="budget-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
            <p className="text-muted-foreground mt-1">
              Set and track your financial goals
            </p>
          </div>
          
          {/* Add Goal Dialog */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-budget-teal text-budget-navy hover:bg-budget-teal/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Savings Goal</DialogTitle>
                <DialogDescription>
                  Set up a new financial goal to track your progress.
                </DialogDescription>
              </DialogHeader>
              <GoalForm 
                initialValues={initialGoalValues}
                onSubmit={handleAddGoal}
              />
            </DialogContent>
          </Dialog>
          
          {/* Edit Goal Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Savings Goal</DialogTitle>
                <DialogDescription>
                  Update your financial goal details.
                </DialogDescription>
              </DialogHeader>
              {selectedGoal && (
                <GoalForm 
                  initialValues={selectedGoal}
                  onSubmit={handleEditGoal}
                  isEditing={true}
                />
              )}
            </DialogContent>
          </Dialog>
          
          {/* Add Money Dialog */}
          <Dialog open={isAddMoneyDialogOpen} onOpenChange={setIsAddMoneyDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Money to Goal</DialogTitle>
                <DialogDescription>
                  Add money to your savings goal.
                </DialogDescription>
              </DialogHeader>
              {selectedGoal && (
                <AddMoneyForm 
                  goal={selectedGoal}
                  onSubmit={handleAddMoney}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p>Loading your goals...</p>
          </div>
        ) : goals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <p className="text-muted-foreground mb-4">You don't have any savings goals yet.</p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Goal
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={openEditDialog}
                onDelete={handleDeleteGoal}
                onAddMoney={openAddMoneyDialog}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Goals;
