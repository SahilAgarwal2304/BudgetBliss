
# BudgetBliss - Personal Finance Tracker

BudgetBliss is a comprehensive personal finance management application built with React, TypeScript, and Supabase. It helps users track expenses, set budgets, manage savings goals, and gain insights into their financial health.

## Features

- **User Authentication**: Secure login and signup functionality
- **Dashboard**: Overview of financial health with charts and summaries
- **Expense Tracking**: Add, edit, and categorize expenses
- **Budget Management**: Set and track budgets by category
- **Savings Goals**: Create and monitor progress towards financial goals
- **Transaction History**: View and filter past transactions
- **Profile Management**: Update personal information and preferences

## Technology Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **State Management**: React Query (TanStack Query)
- **Authentication & Database**: Supabase
- **Routing**: React Router
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/budget-bliss.git
   cd budget-bliss
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory with the following:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your financial summary and recent transactions
3. **Expenses**: Add new expenses and categorize them
4. **Budgets**: Create budgets for different spending categories
5. **Goals**: Set savings goals with target amounts and deadlines
6. **History**: Review past transactions and spending patterns
7. **Profile**: Manage your account settings and preferences

## Project Structure

```
src/
├── components/         # Reusable UI components
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions and helpers
├── pages/              # Application pages/routes
├── services/           # API service methods
└── utils/              # Helper functions and types
```

## Deployment

This application can be deployed using any static site hosting service like Vercel, Netlify, or GitHub Pages.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Shadcn UI for the component library
- Tailwind CSS for styling
- Supabase for backend services
- Recharts for data visualization
