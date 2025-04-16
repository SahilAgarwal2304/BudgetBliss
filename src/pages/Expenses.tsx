
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { PlusCircle, Search } from "lucide-react";
import { mockExpenses, ExpenseCategory, categoryColors } from "@/utils/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Expenses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | "All">("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    amount: "",
    category: "Food" as ExpenseCategory,
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Filter expenses based on search query and selected category
  const filteredExpenses = mockExpenses.filter((expense) => {
    const matchesSearch = expense.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group expenses by date
  const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
    const date = expense.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(expense);
    return groups;
  }, {} as Record<string, typeof mockExpenses>);

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedExpenses).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  // Calculate total for each date
  const dateTotals = sortedDates.reduce((totals, date) => {
    const expenses = groupedExpenses[date];
    totals[date] = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    return totals;
  }, {} as Record<string, number>);

  const handleAddExpense = () => {
    // In a real app, this would add the expense to the database
    console.log("Adding expense:", newExpense);
    setIsDialogOpen(false);
    // Reset form
    setNewExpense({
      amount: "",
      category: "Food",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  return (
    <Layout>
      <div className="budget-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage your expenses
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 md:mt-0 bg-budget-teal text-budget-navy hover:bg-budget-teal/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
                <DialogDescription>
                  Enter the details of your expense below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={newExpense.category}
                    onValueChange={(value) =>
                      setNewExpense({
                        ...newExpense,
                        category: value as ExpenseCategory,
                      })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Housing">Housing</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Utilities">Utilities</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="What did you spend on?"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({
                        ...newExpense,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={handleAddExpense}
                  className="bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
                >
                  Add Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value as ExpenseCategory | "All")}
              >
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                  <SelectItem value="Housing">Housing</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Shopping">Shopping</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs defaultValue="list">
              <TabsList className="mb-6">
                <TabsTrigger value="list">List View</TabsTrigger>
                <TabsTrigger value="summary">Summary View</TabsTrigger>
              </TabsList>

              <TabsContent value="list">
                {sortedDates.length > 0 ? (
                  sortedDates.map((date) => (
                    <div key={date} className="mb-8 last:mb-0">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">{formatDate(date)}</h3>
                        <div className="text-sm text-muted-foreground">
                          Total: ${dateTotals[date].toFixed(2)}
                        </div>
                      </div>
                      <div className="space-y-3">
                        {groupedExpenses[date].map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center p-3 rounded-lg border border-border hover:bg-card transition-colors"
                          >
                            <div
                              className="mr-4 h-10 w-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: categoryColors[expense.category] }}
                            >
                              <span className="text-xs font-bold text-budget-navy">
                                {expense.category.substring(0, 1)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{expense.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {expense.category}
                              </div>
                            </div>
                            <div className="font-medium text-right">
                              -${expense.amount.toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No expenses found. Add your first expense!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="summary">
                <Card>
                  <CardHeader>
                    <CardTitle>Expenses Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(
                        filteredExpenses.reduce((categories, expense) => {
                          if (!categories[expense.category]) {
                            categories[expense.category] = 0;
                          }
                          categories[expense.category] += expense.amount;
                          return categories;
                        }, {} as Record<string, number>)
                      )
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, amount]) => (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className="mr-3 h-6 w-6 rounded-full"
                                style={{ backgroundColor: categoryColors[category as ExpenseCategory] }}
                              />
                              <span>{category}</span>
                            </div>
                            <span className="font-medium">${amount.toFixed(2)}</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Expenses;
