
import { useState, useMemo } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, BarChart4 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockExpenses, categoryColors, ExpenseCategory } from "@/utils/mockData";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const History = () => {
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | "All">("All");

  // Filter expenses by selected month and category
  const filteredExpenses = useMemo(() => {
    if (!month) return [];
    
    return mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const sameMonth = expenseDate.getMonth() === month.getMonth();
      const sameYear = expenseDate.getFullYear() === month.getFullYear();
      const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
      
      return sameMonth && sameYear && matchesCategory;
    });
  }, [month, selectedCategory]);

  // Calculate total for the month
  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Group expenses by day for the bar chart
  const dailyExpenseData = useMemo(() => {
    if (!month) return [];
    
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const data = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      amount: 0,
    }));
    
    filteredExpenses.forEach(expense => {
      const day = new Date(expense.date).getDate();
      data[day - 1].amount += expense.amount;
    });
    
    return data;
  }, [filteredExpenses, month]);

  // Group expenses by category for the summary
  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {};
    
    filteredExpenses.forEach(expense => {
      if (!summary[expense.category]) {
        summary[expense.category] = 0;
      }
      summary[expense.category] += expense.amount;
    });
    
    return Object.entries(summary).map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / totalAmount) * 100,
    }));
  }, [filteredExpenses, totalAmount]);

  return (
    <Layout>
      <div className="budget-container py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Expense History</h1>
            <p className="text-muted-foreground mt-1">
              Review your past spending patterns
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal",
                    !month && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {month ? format(month, "MMMM yyyy") : "Select month"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={month}
                  onSelect={setMonth}
                  initialFocus
                  month={month}
                />
              </PopoverContent>
            </Popover>

            <Select
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ExpenseCategory | "All")}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
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
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {filteredExpenses.length} transactions in {month ? format(month, "MMMM yyyy") : ""}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${month ? (totalAmount / new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()).toFixed(2) : "0.00"}
              </div>
              <p className="text-xs text-muted-foreground">
                Based on the entire month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Top Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySummary.length > 0 ? (
                <>
                  <div className="text-2xl font-bold">
                    {categorySummary.sort((a, b) => b.amount - a.amount)[0].category}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ${categorySummary.sort((a, b) => b.amount - a.amount)[0].amount.toFixed(2)} (
                    {categorySummary.sort((a, b) => b.amount - a.amount)[0].percentage.toFixed(0)}%)
                  </p>
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">
                    No data available
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-7 mb-8">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Daily Spending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {dailyExpenseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyExpenseData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                      <XAxis
                        dataKey="day"
                        stroke="#8A94A6"
                        fontSize={12}
                        tickFormatter={(value) => String(value)}
                      />
                      <YAxis
                        stroke="#8A94A6"
                        fontSize={12}
                        tickFormatter={(value) => `$${value}`}
                      />
                      <Tooltip
                        formatter={(value) => [`$${value}`, 'Amount']}
                        labelFormatter={(value) => `Day ${value}`}
                        contentStyle={{
                          backgroundColor: '#1A2430',
                          borderColor: '#2D3748',
                        }}
                      />
                      <Bar dataKey="amount" fill="#3CDFB4" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <BarChart4 className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
                      <p className="mt-2 text-muted-foreground">
                        No data available for the selected month
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {categorySummary.length > 0 ? (
                <div className="space-y-4">
                  {categorySummary
                    .sort((a, b) => b.amount - a.amount)
                    .map(({ category, amount, percentage }) => (
                      <div key={category} className="flex flex-col">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center">
                            <div
                              className="h-3 w-3 rounded-full mr-2"
                              style={{ backgroundColor: categoryColors[category as ExpenseCategory] }}
                            ></div>
                            <span>{category}</span>
                          </div>
                          <span>${amount.toFixed(2)}</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: categoryColors[category as ExpenseCategory],
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-muted-foreground text-right mt-1">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-muted-foreground">
                    No data available for the selected filters
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExpenses.length > 0 ? (
              <div className="rounded-md border border-border">
                <div className="grid grid-cols-5 gap-4 p-4 border-b border-border font-medium text-sm">
                  <div>Date</div>
                  <div className="col-span-2">Description</div>
                  <div>Category</div>
                  <div className="text-right">Amount</div>
                </div>
                <div className="divide-y divide-border">
                  {filteredExpenses
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((expense) => (
                      <div key={expense.id} className="grid grid-cols-5 gap-4 p-4 text-sm items-center">
                        <div>{new Date(expense.date).toLocaleDateString()}</div>
                        <div className="col-span-2 font-medium">{expense.description}</div>
                        <div>
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${categoryColors[expense.category]}33`,
                              color: categoryColors[expense.category],
                            }}
                          >
                            {expense.category}
                          </span>
                        </div>
                        <div className="text-right font-medium">
                          ${expense.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  No transactions found for the selected filters.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default History;
