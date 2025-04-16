
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";
import { Goal } from "@/services/goalService";

interface AddMoneyFormProps {
  goal: Goal;
  onSubmit: (goalId: string, amount: number) => void;
}

const AddMoneyForm = ({ goal, onSubmit }: AddMoneyFormProps) => {
  const [amount, setAmount] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && parseFloat(amount) > 0) {
      onSubmit(goal.id, parseFloat(amount));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div>
          <p className="mb-2">Add money to your <strong>{goal.name}</strong> goal</p>
          <p className="text-sm text-muted-foreground mb-4">
            Current progress: {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% (₹{goal.currentAmount} of ₹{goal.targetAmount})
          </p>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="amount" className="text-right">
            Amount
          </Label>
          <div className="col-span-3 flex items-center">
            <span className="mr-2"><IndianRupee size={16} /></span>
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          style={{ backgroundColor: goal.color, color: "#0F1721" }}
        >
          Add Money
        </Button>
      </DialogFooter>
    </form>
  );
};

export default AddMoneyForm;
