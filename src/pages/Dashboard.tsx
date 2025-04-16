import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, PieChart, Bar, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PlusCircle, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockBudgets, mockExpenses, mockGoals, monthlySpendingData, categorySpendingData, categoryColors, ExpenseCategory } from "@/utils/mockData";

const Dashboard = () => {
  const [timeframe, setTimeframe] = useState<"daily" | "weekly" | "monthly">("monthly");
  
  // Calculate total budget, total spent and balance
  const totalBudget = mockBudgets.reduce((total, budget) => total + budget.limit, 0);
  const totalSpent = mockBudgets.reduce((total, budget) => total + budget.spent, 0);
  const balance = totalBudget - totalSpent;
  
  // Calculate recent expenses (latest 5)
  const recentExpenses = [...mockExpenses].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  ).slice(0, 5);

  // Helper function to determine progress bar color based on budget usage
  const getProgressColorClass = (spent: number, limit: number) => {
    if (spent > limit) return "bg-budget-red";
    if (spent > limit * 0.8) return "bg-budget-yellow";
    return "bg-budget-green";
  };

  return (
    <Layout>
      <div className="budget-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's an overview of your finances.
            </p>
          </div>
          <Button className="mt-4 md:mt-0 bg-budget-teal text-budget-navy hover:bg-budget-teal/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalBudget.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                For this {timeframe} period
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {((totalSpent / totalBudget) * 100).toFixed(1)}% of your budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Remaining Balance</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {((balance / totalBudget) * 100).toFixed(1)}% remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graphs & Analytics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-8">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
              <Tabs defaultValue="monthly" onValueChange={(value) => setTimeframe(value as "daily" | "weekly" | "monthly")}>
                <TabsList>
                  <TabsTrigger value="daily">Daily</TabsTrigger>
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlySpendingData}>
                  <XAxis dataKey="name" stroke="#8A94A6" fontSize={12} />
                  <YAxis 
                    stroke="#8A94A6" 
                    fontSize={12} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Amount']}
                    contentStyle={{ 
                      backgroundColor: '#1A2430', 
                      borderColor: '#2D3748' 
                    }}
                  />
                  <Bar 
                    dataKey="amount" 
                    radius={[4, 4, 0, 0]}
                    fill="#3CDFB4" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categorySpendingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categorySpendingData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={categoryColors[entry.name as ExpenseCategory]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`$${value}`, 'Amount']}
                    contentStyle={{ 
                      backgroundColor: '#1A2430', 
                      borderColor: '#2D3748' 
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Budget Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockBudgets.map((budget) => {
                  const colorClass = getProgressColorClass(budget.spent, budget.limit);
                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{budget.category}</div>
                        <div className="text-sm text-muted-foreground">
                          ${budget.spent} / ${budget.limit}
                        </div>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`absolute h-full transition-all ${colorClass}`}
                          style={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentExpenses.map((expense) => (
                  <div 
                    key={expense.id} 
                    className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center">
                      <div 
                        className="mr-4 h-8 w-8 rounded-full flex items-center justify-center" 
                        style={{ backgroundColor: categoryColors[expense.category] }}
                      >
                        <span className="text-xs font-bold text-budget-navy">
                          {expense.category.substring(0, 1)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-xs text-muted-foreground">
                          {expense.category} • {new Date(expense.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="font-medium">
                      -${expense.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Savings Goals */}
        <div className="mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Savings Goals</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {mockGoals.map((goal) => (
                  <div 
                    key={goal.id}
                    className="budget-card"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{goal.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ${goal.currentAmount} / ${goal.targetAmount}
                        </div>
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
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <div>
                          {((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% complete
                        </div>
                        <div>
                          Due by {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
