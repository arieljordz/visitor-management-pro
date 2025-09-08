import React from "react";
import PageHeader from "@/components/common/PageHeader";
import ProfileSettings from "@/components/settings/ProfileSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import ApplicationSettings from "@/components/settings/ApplicationSettings";
import SystemSettings from "@/components/settings/SystemSettings";

const Settings: React.FC = () => {
  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader
        title="Settings"
        description="Manage your application settings and preferences."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSettings />
        <NotificationSettings />
        <SecuritySettings />
        <ApplicationSettings />
        <SystemSettings />
      </div>
    </div>
  );
};

export default Settings;
