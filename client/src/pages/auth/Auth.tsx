// src/pages/Auth.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { AuthForm } from "@/components/common/AuthForm";
import { useUserStore } from "@/stores/userStore";
import { FullPageSpinner } from "@/components/ui/full-page-spinner";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { isAuthenticated, loadingUser, fetchUser, role } = useUserStore();

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Redirect after successful login based on role
  useEffect(() => {
    if (!loadingUser && isAuthenticated) {
      switch (role) {
        case "admin":
          navigate("/dashboard", { replace: true });
          break;
        case "user":
          navigate("/appointments", { replace: true });
          break;
        case "staff":
          navigate("/reports", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }
  }, [isAuthenticated, loadingUser, role, navigate]);

  if (loadingUser) return <FullPageSpinner />;

  return (
    <AuthForm
      title="VMS Pro"
      subtitle={
        activeTab === "login"
          ? "Sign in to your account"
          : "Create your account"
      }
    >
      <div className="flex border-b border-border mb-4">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "login"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === "register"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      {activeTab === "login" && <LoginForm />}
      {activeTab === "register" && (
        <RegisterForm onSuccess={() => setActiveTab("login")} />
      )}
    </AuthForm>
  );
}
