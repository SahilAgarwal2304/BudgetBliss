
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, BarChart3, PiggyBank, History, Target, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/SupabaseAuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const handleLogout = () => {
    signOut();
  };

  // Helper to get user's display name from user metadata
  const getUserDisplayName = () => {
    if (!user) return "";
    return user.user_metadata?.name || user.email?.split("@")[0] || "";
  };

  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur">
      <div className="budget-container">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-budget-teal rounded-full overflow-hidden">
                <AvatarImage 
                  src={`${import.meta.env.BASE_URL}lovable-uploads/a8310e08-f714-4e01-8a60-59ff570560df.png`}
                  alt="BudgetBliss Logo"
                  className="object-cover" 
                  onError={(e) => {
                    console.error("Logo failed to load:", e);
                    e.currentTarget.src = `${import.meta.env.BASE_URL}placeholder.svg`;
                  }}
                />
                <AvatarFallback className="bg-budget-teal text-budget-navy font-bold">BB</AvatarFallback>
              </Avatar>
              <span className="font-bold text-budget-teal text-xl hidden sm:inline-block">
                BudgetBliss
              </span>
            </Link>
          </div>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/dashboard" className="text-foreground/80 hover:text-budget-teal transition-colors">
                Dashboard
              </Link>
              <Link to="/expenses" className="text-foreground/80 hover:text-budget-teal transition-colors">
                Expenses
              </Link>
              <Link to="/goals" className="text-foreground/80 hover:text-budget-teal transition-colors">
                Goals
              </Link>
              <Link to="/history" className="text-foreground/80 hover:text-budget-teal transition-colors">
                History
              </Link>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <div className="hidden sm:block">
                  <span className="text-sm text-muted-foreground mr-2">Hi, {getUserDisplayName()}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="hidden sm:flex"
                >
                  <LogOut size={18} />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  className="hidden sm:flex"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
                  onClick={handleSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden" 
              onClick={toggleMenu}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="space-y-1 px-4 py-3">
            {isAuthenticated ? (
              <>
                <div className="py-2 border-b border-border/40 mb-2">
                  <div className="flex items-center gap-2 py-2">
                    <User size={18} />
                    <span>{getUserDisplayName()}</span>
                  </div>
                </div>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BarChart3 size={18} />
                  Dashboard
                </Link>
                <Link 
                  to="/expenses" 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <PiggyBank size={18} />
                  Expenses
                </Link>
                <Link 
                  to="/goals" 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Target size={18} />
                  Goals
                </Link>
                <Link 
                  to="/history" 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <History size={18} />
                  History
                </Link>
                <button 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal w-full text-left"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <button 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal w-full text-left"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Sign In
                </button>
                <button 
                  className="flex items-center gap-2 py-2 text-base text-foreground hover:text-budget-teal w-full text-left"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate("/signup");
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
