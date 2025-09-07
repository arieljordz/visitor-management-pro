import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserCheck, faUserTimes } from "@fortawesome/free-solid-svg-icons";

interface UserStatsProps {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
}

const UserStats: React.FC<UserStatsProps> = ({ totalUsers, activeUsers, inactiveUsers }) => {
  const stats = [
    { icon: faUsers, color: "text-primary", label: "Total Users", value: totalUsers },
    { icon: faUserCheck, color: "text-success", label: "Active", value: activeUsers },
    { icon: faUserTimes, color: "text-destructive", label: "Inactive", value: inactiveUsers },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

const StatCard: React.FC<{ icon: any; color: string; label: string; value: number }> = ({
  icon,
  color,
  label,
  value,
}) => (
  <div className="rounded-lg border bg-card p-4">
    <div className="flex items-center">
      <FontAwesomeIcon icon={icon} className={`h-5 w-5 mr-2 ${color}`} />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default UserStats;
