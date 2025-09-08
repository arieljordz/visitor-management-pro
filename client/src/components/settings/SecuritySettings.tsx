import React from "react";
import { faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../ui/AdminCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

const SecuritySettings: React.FC = () => {
  return (
    <AdminCard title="Security Settings" icon={faShieldAlt}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="current-password">Current Password</Label>
          <Input id="current-password" type="password" placeholder="Enter current password" />
        </div>
        <div>
          <Label htmlFor="new-password">New Password</Label>
          <Input id="new-password" type="password" placeholder="Enter new password" />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input id="confirm-password" type="password" placeholder="Confirm new password" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label>Two-Factor Authentication</Label>
            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Switch />
        </div>
        <Button className="w-full">Update Password</Button>
      </div>
    </AdminCard>
  );
};

export default SecuritySettings;
