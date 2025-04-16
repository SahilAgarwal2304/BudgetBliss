
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4 py-12">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-8xl font-bold text-budget-teal mb-6">404</h1>
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">Oops! Page not found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="flex justify-center pt-4">
              <Button 
                asChild
                className="bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
                size="lg"
              >
                <Link to="/" className="flex items-center gap-2">
                  <Home size={18} />
                  Return to Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
