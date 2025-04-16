export type ExpenseCategory = 
  | 'Food' 
  | 'Transport' 
  | 'Housing' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Utilities' 
  | 'Healthcare' 
  | 'Education' 
  | 'Travel'
  | 'Gifts'
  | 'Personal'
  | 'Investments'
  | 'Taxes'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limit: number;
  spent: number;
  period: 'daily' | 'weekly' | 'monthly';
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  color: string;
}

export const mockExpenses: Expense[] = [
  {
    id: '1',
    amount: 35.50,
    category: 'Food',
    description: 'Grocery shopping',
    date: '2025-04-10',
  },
  {
    id: '2',
    amount: 12.99,
    category: 'Entertainment',
    description: 'Movie ticket',
    date: '2025-04-09',
  },
  {
    id: '3',
    amount: 42.00,
    category: 'Transport',
    description: 'Fuel',
    date: '2025-04-08',
  },
  {
    id: '4',
    amount: 120.00,
    category: 'Utilities',
    description: 'Electricity bill',
    date: '2025-04-07',
  },
  {
    id: '5',
    amount: 65.75,
    category: 'Shopping',
    description: 'New shoes',
    date: '2025-04-06',
  },
  {
    id: '6',
    amount: 28.50,
    category: 'Food',
    description: 'Restaurant lunch',
    date: '2025-04-05',
  },
];

export const mockBudgets: Budget[] = [
  {
    id: '1',
    category: 'Food',
    limit: 400,
    spent: 250,
    period: 'monthly',
  },
  {
    id: '2',
    category: 'Transport',
    limit: 200,
    spent: 150,
    period: 'monthly',
  },
  {
    id: '3',
    category: 'Entertainment',
    limit: 150,
    spent: 50,
    period: 'monthly',
  },
  {
    id: '4',
    category: 'Shopping',
    limit: 300,
    spent: 150,
    period: 'monthly',
  },
  {
    id: '5',
    category: 'Utilities',
    limit: 250,
    spent: 200,
    period: 'monthly',
  },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 2500,
    deadline: '2025-09-01',
    color: '#3CDFB4',
  },
  {
    id: '2',
    name: 'New Laptop',
    targetAmount: 1500,
    currentAmount: 800,
    deadline: '2025-06-15',
    color: '#4CD964',
  },
  {
    id: '3',
    name: 'Vacation',
    targetAmount: 3000,
    currentAmount: 1200,
    deadline: '2025-12-20',
    color: '#FFCC00',
  },
];

export const monthlySpendingData = [
  { name: 'Jan', amount: 1200 },
  { name: 'Feb', amount: 1400 },
  { name: 'Mar', amount: 1100 },
  { name: 'Apr', amount: 1300 },
  { name: 'May', amount: 1500 },
  { name: 'Jun', amount: 1250 },
];

export const categorySpendingData = [
  { name: 'Food', value: 400 },
  { name: 'Transport', value: 300 },
  { name: 'Housing', value: 800 },
  { name: 'Entertainment', value: 200 },
  { name: 'Shopping', value: 300 },
  { name: 'Utilities', value: 250 },
];

export const categoryColors: Record<ExpenseCategory, string> = {
  Food: '#3CDFB4',
  Transport: '#4CD964',
  Housing: '#007AFF',
  Entertainment: '#FF9500',
  Shopping: '#FF2D55',
  Utilities: '#5856D6',
  Healthcare: '#AF52DE',
  Education: '#34C759',
  Travel: '#FF9500',
  Gifts: '#FF2D55',
  Personal: '#FF6B6B',
  Investments: '#4CD964',
  Taxes: '#8A94A6',
  Other: '#8A94A6',
};

export const CURRENCY_SYMBOL = '₹';
