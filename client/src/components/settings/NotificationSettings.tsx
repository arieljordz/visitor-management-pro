import React from "react";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../ui/AdminCard";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

const NotificationSettings: React.FC = () => {
  return (
    <AdminCard title="Notification Settings" icon={faBell}>
      <div className="space-y-4">
        {[
          {
            label: "Email Notifications",
            desc: "Receive notifications via email",
            checked: true,
          },
          {
            label: "Push Notifications",
            desc: "Receive push notifications",
          },
          {
            label: "Marketing Emails",
            desc: "Receive marketing and promotional emails",
          },
          {
            label: "Security Alerts",
            desc: "Receive security-related notifications",
            checked: true,
          },
        ].map(({ label, desc, checked }, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center justify-between">
              <div>
                <Label>{label}</Label>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <Switch defaultChecked={checked} />
            </div>
            {i < 3 && <Separator />}
          </React.Fragment>
        ))}
      </div>
    </AdminCard>
  );
};

export default NotificationSettings;
