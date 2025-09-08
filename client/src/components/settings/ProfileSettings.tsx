import React from "react";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../ui/AdminCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const ProfileSettings: React.FC = () => {
  return (
    <AdminCard title="Profile Settings" icon={faUser}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
        </div>
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            defaultValue="john@example.com"
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Acme Inc." defaultValue="Acme Inc." />
        </div>
        <Button className="w-full">Save Changes</Button>
      </div>
    </AdminCard>
  );
};

export default ProfileSettings;
