// pages/Auth.tsx
import React, { useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{isLogin ? "Welcome Back" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Sign in to your visitor management account"
              : "Join our visitor management system"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLogin ? <LoginForm /> : <RegisterForm />}

          {/* Switch link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="px-0"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>

          {/* Forgot password (only login) */}
          {isLogin && (
            <div className="mt-4 text-center">
              <Button variant="link" className="px-0 text-sm">
                Forgot your password?
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
