// components/common/PageHeader.tsx
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, className }) => {
  return (
    <div className={`mb-6 ${className ?? ""}`}>
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {description && (
        <p className="text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

export default PageHeader;
