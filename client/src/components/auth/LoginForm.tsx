// src/components/auth/LoginForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "@/hooks/use-toast";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormType = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const { login, googleLogin } = useUserStore();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    // defaultValues: { email: "jordzdevelopment@gmail.com", password: "P@ssw0rd" },
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      await login(data.email, data.password);
      toast({ title: "Welcome!", description: "Logged in successfully." });
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "Check credentials",
        variant: "destructive",
      });
    }
  };

  const handleGoogleLogin = async (response: any) => {
    try {
      await googleLogin(response.credential);
      toast({ title: "Welcome!", description: "Logged in with Google." });
    } catch (err: any) {
      toast({
        title: "Google login failed",
        description: err.message || "Try again",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="email">Email address</Label>{" "}
        <div className="relative">
          {" "}
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />{" "}
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="pl-10"
            autoComplete="email"
            {...register("email")}
          />{" "}
        </div>{" "}
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}{" "}
      </div>{" "}
      <div className="space-y-2">
        {" "}
        <Label htmlFor="password">Password</Label>{" "}
        <div className="relative">
          {" "}
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />{" "}
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            className="pl-10 pr-10"
            autoComplete="current-password"
            {...register("password")}
          />{" "}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {" "}
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}{" "}
          </button>{" "}
        </div>{" "}
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}{" "}
      </div>{" "}
      <Button type="submit" variant="default" size="lg" className="w-full">
        Sign In
      </Button>{" "}
      <div className="flex items-center my-4">
        {" "}
        <div className="flex-grow border-t border-border"></div>{" "}
        <span className="px-2 text-xs text-muted-foreground">or</span>{" "}
        <div className="flex-grow border-t border-border"></div>{" "}
      </div>{" "}
      <div className="flex justify-center">
        {" "}
        <GoogleLogin
          onSuccess={handleGoogleLogin}
          onError={() =>
            toast({
              title: "Google Login Failed",
              description: "Unable to authenticate.",
              variant: "destructive",
            })
          }
        />{" "}
      </div>{" "}
    </form>
  );
};
