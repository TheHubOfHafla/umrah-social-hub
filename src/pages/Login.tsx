
import { useState } from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import LoginForm from "@/components/auth/LoginForm";
import GoogleSignIn from "@/components/auth/GoogleSignIn";
import RoleSelector from "@/components/auth/RoleSelector";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [preferredRole, setPreferredRole] = useState<'attendee' | 'organizer'>('attendee');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-background to-background/90">
      <div className="w-full max-w-md space-y-8 bg-card rounded-lg shadow-lg p-8 border border-border">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary">HaflaHub</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        <LoginForm />

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <RoleSelector 
              value={preferredRole} 
              onChange={(value: 'attendee' | 'organizer') => setPreferredRole(value)} 
            />

            <GoogleSignIn 
              preferredRole={preferredRole} 
              isLoading={isLoading}
              onError={(error) => setAuthError(error)}
            />
          </div>
        </div>

        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
