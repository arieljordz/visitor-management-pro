import React from "react";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import AdminCard from "../ui/AdminCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select"; // adjust path if needed

const SystemSettings: React.FC = () => {
  return (
    <AdminCard title="System Settings" icon={faDatabase} className="lg:col-span-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Database */}
        <div className="space-y-4">
          <h4 className="font-semibold">Database</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto Backup</Label>
              <p className="text-sm text-muted-foreground">Automatically backup database</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="backup-frequency">Backup Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger id="backup-frequency" className="mt-1">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" className="w-full">
            Backup Now
          </Button>
        </div>

        {/* Performance */}
        <div className="space-y-4">
          <h4 className="font-semibold">Performance</h4>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cache Enabled</Label>
              <p className="text-sm text-muted-foreground">Enable application caching</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div>
            <Label htmlFor="cache-duration">Cache Duration (hours)</Label>
            <Input
              id="cache-duration"
              type="number"
              defaultValue="24"
              min="1"
              max="168"
            />
          </div>
          <Button variant="outline" className="w-full">
            Clear Cache
          </Button>
        </div>
      </div>
    </AdminCard>
  );
};

export default SystemSettings;
