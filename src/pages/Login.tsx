import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/SupabaseAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Phone, Mail, Lock, User } from "lucide-react";

const Login = () => {
  // Email login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Phone login states
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await signIn(email, password);
    } catch (error) {
      console.error(error);
      // Error is already handled in the signIn function
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      // Placeholder for future OTP implementation
      toast.success("OTP sent successfully!");
      setOtpSent(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    try {
      // Placeholder for future OTP verification implementation
      toast.error("OTP login not implemented yet");
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Banner Image Section */}
      <div className="hidden lg:block lg:w-1/2 bg-budget-navy">
        <div className="h-full flex items-center justify-center p-12">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold text-white mb-6">Welcome to BudgetBliss</h1>
            <p className="text-lg text-gray-300 mb-8">Take control of your finances with our intuitive budget tracking tools.</p>
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/6316d6e5-fe80-458d-aef5-74d157056054.png" 
                alt="Financial Management" 
                className="rounded-lg shadow-xl max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Login Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <Link to="/">
                <img 
                  src="/lovable-uploads/a8310e08-f714-4e01-8a60-59ff570560df.png" 
                  alt="BudgetBliss Logo" 
                  className="h-12 w-12"
                />
              </Link>
            </div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>Enter your credentials to log in to your account</CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="johndoe@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-sm text-budget-teal hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </Button>
                  <div className="text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-budget-teal hover:underline">
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="phone">
              {!otpSent ? (
                <form onSubmit={handleSendOTP}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending OTP..." : "Send OTP"}
                    </Button>
                    <div className="text-center text-sm">
                      Don't have an account?{" "}
                      <Link to="/signup" className="text-budget-teal hover:underline">
                        Sign up
                      </Link>
                    </div>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <div className="flex justify-center py-4">
                        <InputOTP maxLength={4} value={otp} onChange={setOtp}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <p className="text-center text-sm text-muted-foreground mt-2">
                        Didn't receive the code?{" "}
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-budget-teal"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.preventDefault();
                            handleSendOTP(e);
                          }}
                        >
                          Resend OTP
                        </Button>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button 
                      type="submit" 
                      className="w-full bg-budget-teal text-budget-navy hover:bg-budget-teal/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify & Login"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setOtpSent(false)}
                      className="w-full"
                    >
                      Change Phone Number
                    </Button>
                  </CardFooter>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
