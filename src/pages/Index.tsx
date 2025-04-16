
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { ChevronRight, BarChart3, PiggyBank, Target, Clock, CheckCircle2 } from "lucide-react";

const Index = () => {
  const features = [
    {
      title: "Budget Tracking",
      description: "Set daily, weekly, and monthly spending limits to keep your finances in check.",
      icon: <BarChart3 className="h-10 w-10 text-budget-teal" />,
    },
    {
      title: "Expense Categorization",
      description: "Easily categorize your expenses to understand where your money is going.",
      icon: <PiggyBank className="h-10 w-10 text-budget-teal" />,
    },
    {
      title: "Goal Setting",
      description: "Set savings goals and track your progress towards achieving them.",
      icon: <Target className="h-10 w-10 text-budget-teal" />,
    },
    {
      title: "Expense History",
      description: "View your past transactions with detailed breakdowns by category.",
      icon: <Clock className="h-10 w-10 text-budget-teal" />,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="budget-container relative z-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-20 items-center">
            <div className="animate-fade-up">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
                Simplify your <span className="text-budget-teal">finances</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-lg">
                BudgetBliss helps you take control of your money with easy expense tracking, budget management, and goal setting.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-budget-teal text-budget-navy hover:bg-budget-teal/90">
                  <Link to="/dashboard">
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/about">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:block animate-fade-in">
              <img
                src={`${import.meta.env.BASE_URL}lovable-uploads/6316d6e5-fe80-458d-aef5-74d157056054.png`}
                alt="BudgetBliss Dashboard Preview"
                className="rounded-xl shadow-2xl border border-border"
                onError={(e) => {
                  console.error("Image failed to load:", e);
                  e.currentTarget.src = `${import.meta.env.BASE_URL}placeholder.svg`;
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-budget-navy-light">
        <div className="budget-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Key Features
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your personal finances effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="budget-card group relative overflow-hidden transition-all hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="budget-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              BudgetBliss makes financial management simple and intuitive.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-budget-teal text-budget-navy mb-4">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Set Your Budget</h3>
                <p className="text-muted-foreground">
                  Define your spending limits for different categories and time periods.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-budget-teal text-budget-navy mb-4">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Track Expenses</h3>
                <p className="text-muted-foreground">
                  Log your expenses and categorize them to maintain accurate records.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-budget-teal text-budget-navy mb-4">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-medium mb-2">Achieve Goals</h3>
                <p className="text-muted-foreground">
                  Set financial goals and watch your progress as you save towards them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="budget-container">
          <div className="rounded-xl bg-gradient-primary p-8 md:p-12 lg:p-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-budget-navy mb-6">
              Start Your Financial Journey Today
            </h2>
            <p className="text-lg text-budget-navy/80 max-w-2xl mx-auto mb-8">
              Join BudgetBliss and take the first step towards financial freedom and peace of mind.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-budget-navy text-budget-teal hover:bg-budget-navy/90">
                <Link to="/dashboard">
                  Get Started For Free
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-budget-navy text-budget-navy hover:bg-budget-navy/10">
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
