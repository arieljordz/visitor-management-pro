// src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthForm } from "@/components/AuthForm";
import { useUserStore } from "@/stores/userStore";
import { FullPageSpinner } from "@/components/ui/full-page-spinner";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { isAuthenticated, loadingUser, fetchUser } = useUserStore();

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Redirect after successful login
  useEffect(() => {
    if (!loadingUser && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, loadingUser, navigate]);

  console.log("VITE_BASE_API_URL:", import.meta.env.VITE_BASE_API_URL);
  console.log("VITE_GOOGLE_API_KEY:", import.meta.env.VITE_GOOGLE_API_KEY);

  if (loadingUser) return <FullPageSpinner />;

  return (
    <AuthForm
      title="VMS Pro"
      subtitle={activeTab === "login" ? "Sign in to your account" : "Create your account"}
    >
      <div className="flex border-b border-border mb-4">
        <button
          className={`flex-1 py-2 text-center font-medium ${activeTab === "login" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${activeTab === "register" ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"}`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {activeTab === "login" && <LoginForm />}
      {activeTab === "register" && <RegisterForm onSuccess={() => setActiveTab("login")} />}
    </AuthForm>
  );
}
