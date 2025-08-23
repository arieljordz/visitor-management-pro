import React, { ReactNode } from "react";
import { Building2 } from "lucide-react";

interface AuthFormProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const AuthForm: React.FC<AuthFormProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface-secondary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
        </div>
        <div className="card-elevated p-6 space-y-4">{children}</div>
      </div>
    </div>
  );
};
