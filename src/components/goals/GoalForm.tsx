
import React from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee } from "lucide-react";
import { Goal } from "@/services/goalService";

type GoalFormValues = Omit<Goal, 'id' | 'user_id'>;

interface GoalFormProps {
  initialValues: GoalFormValues;
  onSubmit: (values: GoalFormValues) => void;
  isEditing?: boolean;
}

const GoalForm = ({ initialValues, onSubmit, isEditing = false }: GoalFormProps) => {
  const [values, setValues] = React.useState<GoalFormValues>(initialValues);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: name.includes('Amount') ? Number(value) : value });
  };

  const handleColorSelect = (color: string) => {
    setValues({ ...values, color });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Goal Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Emergency Fund"
            value={values.name}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="targetAmount" className="text-right">
            Target Amount
          </Label>
          <div className="col-span-3 flex items-center">
            <span className="mr-2"><IndianRupee size={16} /></span>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              placeholder="0.00"
              value={values.targetAmount}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="currentAmount" className="text-right">
            Current Amount
          </Label>
          <div className="col-span-3 flex items-center">
            <span className="mr-2"><IndianRupee size={16} /></span>
            <Input
              id="currentAmount"
              name="currentAmount"
              type="number"
              placeholder="0.00"
              value={values.currentAmount}
              onChange={handleChange}
              className="w-full"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deadline" className="text-right">
            Deadline
          </Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            value={values.deadline}
            onChange={handleChange}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="color" className="text-right">
            Color
          </Label>
          <div className="flex gap-2 col-span-3">
            {["#3CDFB4", "#4CD964", "#007AFF", "#FF9500", "#FF2D55", "#5856D6"].map(
              (color) => (
                <button
                  key={color}
                  type="button"
                  className={`h-8 w-8 rounded-full ${
                    values.color === color
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorSelect(color)}
                />
              )
            )}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
        >
          {isEditing ? "Update" : "Create"} Goal
        </Button>
      </DialogFooter>
    </form>
  );
};

export default GoalForm;
