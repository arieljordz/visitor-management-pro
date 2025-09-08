import React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../ui/AdminCard";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"; // adjust import path if needed

const ApplicationSettings: React.FC = () => {
  return (
    <AdminCard title="Application Settings" icon={faCog}>
      <div className="space-y-4">
        {[
          {
            label: "Dark Mode",
            desc: "Switch between light and dark themes",
          },
          {
            label: "Auto-save",
            desc: "Automatically save changes",
            checked: true,
          },
          {
            label: "Analytics",
            desc: "Help improve the application",
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
            {i < 2 && <Separator />}
          </React.Fragment>
        ))}

        <Separator />

        {/* Language Dropdown using your custom Select */}
        <div>
          <Label htmlFor="language">Language</Label>
          <Select defaultValue="en">
            <SelectTrigger id="language" className="mt-1">
              <SelectValue placeholder="Select a language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </AdminCard>
  );
};

export default ApplicationSettings;
