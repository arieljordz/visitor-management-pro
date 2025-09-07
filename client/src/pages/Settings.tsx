import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCog, 
  faUser, 
  faBell, 
  faShieldAlt, 
  faDatabase,
  faPalette
} from '@fortawesome/free-solid-svg-icons';
import AdminCard from '../components/ui/AdminCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <AdminCard title="Profile Settings" icon={faUser}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" defaultValue="John Doe" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
            </div>
            <div>
              <Label htmlFor="company">Company</Label>
              <Input id="company" placeholder="Acme Inc." defaultValue="Acme Inc." />
            </div>
            <Button className="w-full">Save Changes</Button>
          </div>
        </AdminCard>

        {/* Notification Settings */}
        <AdminCard title="Notification Settings" icon={faBell}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive push notifications</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive marketing and promotional emails</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Security Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive security-related notifications</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </AdminCard>

        {/* Security Settings */}
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

        {/* Application Settings */}
        <AdminCard title="Application Settings" icon={faCog}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-save</Label>
                <p className="text-sm text-muted-foreground">Automatically save changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Analytics</Label>
                <p className="text-sm text-muted-foreground">Help improve the application</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div>
              <Label htmlFor="language">Language</Label>
              <select className="w-full mt-1 p-2 border rounded-md bg-background">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        </AdminCard>

        {/* System Settings */}
        <AdminCard title="System Settings" icon={faDatabase} className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <select id="backup-frequency" className="w-full mt-1 p-2 border rounded-md bg-background">
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <Button variant="outline" className="w-full">
                <FontAwesomeIcon icon={faDatabase} className="mr-2 h-4 w-4" />
                Backup Now
              </Button>
            </div>

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
                <Input id="cache-duration" type="number" defaultValue="24" min="1" max="168" />
              </div>
              <Button variant="outline" className="w-full">
                Clear Cache
              </Button>
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
};

export default Settings;