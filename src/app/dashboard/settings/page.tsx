"use client";

import { useEffect, useState } from "react";
import {
  useSettings,
  useUpdateProfileAndSettings,
  useChangePassword,
} from "@/hooks/useSettings";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsPage() {
  const [productTitle, setProductTitle] = useState("Loading...");

  useEffect(() => {
    // Simulate fetching dynamic data after component mounts
    setTimeout(() => {
      const fetchedTitle = "PulseBoard || Settings";
      setProductTitle(fetchedTitle);

      // Update the page title using the browser API
      document.title = fetchedTitle;
    }, 1000);
  }, []);
  const { data: user, isLoading } = useSettings();
  const update = useUpdateProfileAndSettings();
  const changePassword = useChangePassword();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("light");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setTheme(user.settings?.theme || "light");
      setEmailNotifications(Boolean(user.settings?.emailNotifications));
      setWeeklyReports(Boolean(user.settings?.weeklyReports));
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await update.mutateAsync({
        name,
        email,
        settings: { theme, emailNotifications, weeklyReports },
      });
      alert("Profile & preferences saved.");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to save");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      alert("Password changed successfully.");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Password change failed");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="border rounded-lg p-6 dark:bg-neutral-900 hover:dark:border hover:dark:border-green-900">
        <h3 className="text-lg font-semibold mb-4">Profile</h3>
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
            />
          </div>

          <Button type="submit" className="mt-3">
            Save
          </Button>
        </form>
      </div>

      <div className="border rounded-lg p-6 dark:bg-neutral-900 hover:dark:border-green-900">
        <h3 className="text-lg font-semibold mb-4">Security</h3>
        <form onSubmit={handleChangePassword} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
          </div>

          <Button type="submit" variant="secondary" className="mt-2">
            Update Password
          </Button>
        </form>
      </div>

      <div className="border rounded-lg p-6 dark:bg-neutral-900 hover:dark:border-green-900">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium">
              Enable Email Notifications
            </div>
            <div className="text-xs text-gray-500">
              Receive transactional emails
            </div>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={(v) => setEmailNotifications(Boolean(v))}
          />
        </div>

        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-sm font-medium">Receive Weekly Reports</div>
            <div className="text-xs text-gray-500">
              Weekly summary to your inbox
            </div>
          </div>
          <Switch
            checked={weeklyReports}
            onCheckedChange={(v) => setWeeklyReports(Boolean(v))}
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm mb-1">Theme</label>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="border p-2 rounded dark:bg-neutral-900"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <Button onClick={() => handleSaveProfile(new Event("submit") as any)}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
