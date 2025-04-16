
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Goal } from "@/services/goalService";
import { IndianRupee, Target, Edit, Trash2 } from "lucide-react";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAddMoney: (goal: Goal) => void;
}

const GoalCard = ({ goal, onEdit, onDelete, onAddMoney }: GoalCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateDaysRemaining = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const differenceInTime = deadlineDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
  };

  return (
    <Card className="overflow-hidden">
      <div
        className="h-2"
        style={{ backgroundColor: goal.color }}
      ></div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{goal.name}</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onEdit(goal)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => onDelete(goal.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground text-sm">Progress</span>
              <span className="text-muted-foreground text-sm">
                {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="absolute h-full transition-all"
                style={{ 
                  width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%`,
                  backgroundColor: goal.color 
                }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-muted-foreground text-sm">Current</div>
              <div className="text-xl font-bold flex items-center">
                <IndianRupee className="h-4 w-4 mr-1" />
                {goal.currentAmount}
              </div>
            </div>
            <div>
              <div className="text-muted-foreground text-sm">Target</div>
              <div className="text-xl font-bold flex items-center">
                <IndianRupee className="h-4 w-4 mr-1" />
                {goal.targetAmount}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-2 border-t border-border">
            <div>
              <div className="text-muted-foreground text-sm">Deadline</div>
              <div>{formatDate(goal.deadline)}</div>
            </div>
            <div className="text-right">
              <div className="text-muted-foreground text-sm">Days Left</div>
              <div>{calculateDaysRemaining(goal.deadline)}</div>
            </div>
          </div>
          
          <div className="pt-3">
            <Button 
              className="w-full" 
              style={{ backgroundColor: goal.color, color: "#0F1721" }}
              onClick={() => onAddMoney(goal)}
            >
              <Target className="mr-2 h-4 w-4" />
              Add Money
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;
