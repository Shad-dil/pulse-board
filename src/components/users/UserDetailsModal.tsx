"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUser,
  useUserActivities,
  useUpdateUser,
  useDeleteUser,
  useRestoreUser,
  useUpdateSettings,
} from "@/hooks/useUser";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

type Props = {
  userId: string | null;
  open: boolean;
  onClose: () => void;
};

export default function UserDetailsModal({ userId, open, onClose }: Props) {
  const { data: user, isLoading } = useUser(userId || undefined);
  const { data: activities } = useUserActivities(userId || undefined);

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const restoreUser = useRestoreUser();
  const updateSettings = useUpdateSettings();

  const [edit, setEdit] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "USER",
  });

  const [settings, setSettings] = useState({
    theme: "light",
    emailNotifications: true,
    weeklyReports: false,
  });

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      if (user.settings) {
        setSettings({
          theme: user.settings.theme,
          emailNotifications: user.settings.emailNotifications,
          weeklyReports: user.settings.weeklyReports,
        });
      }
    }
  }, [user]);

  if (!open) return null;

  const handleSaveProfile = async () => {
    if (!userId) return;
    await updateUser.mutateAsync({ id: userId, payload: profile });
    setEdit(false);
  };

  const handleSaveSettings = async () => {
    if (!userId) return;
    await updateSettings.mutateAsync({ id: userId, payload: settings });
  };

  const handleDelete = async () => {
    if (!userId) return;
    await deleteUser.mutateAsync(userId);
    toast.success(`${user.name} is Deleted Successfully`);
    onClose();
  };

  const handleRestore = async () => {
    if (!userId) return;
    await restoreUser.mutateAsync(userId);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="
      fixed 
      left-1/2 top-1/2 
      -translate-x-1/2 -translate-y-1/2
      w-[95vw] max-w-lg md:max-w-2xl lg:max-w-3xl
      max-h-[90vh]
      overflow-hidden 
      rounded-xl
      z-9999
    "
      >
        <div
          className="
      flex 
      flex-col
      max-h-[90vh] 
      md:max-h-[80vh]
    "
        >
          {/* HEADER */}
          <DialogHeader className="p-6 pb-3">
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Manage profile, activity logs & settings
            </DialogDescription>
          </DialogHeader>

          {/* TABS WRAPPER (scrolls independently) */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <Tabs defaultValue="profile" className="w-full">
              {/* Sticky Tabs List */}
              <TabsList
                className="
            grid grid-cols-3 
            w-full 
            sticky 
            top-0 
            bg-neutral-900/90 
            backdrop-blur-md 
            z-10
            border-b 
            border-neutral-700
          "
              >
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              {/* --- PROFILE TAB --- */}
              <TabsContent value="profile" className="mt-4 space-y-4">
                {!edit ? (
                  <div className="space-y-3">
                    <p>
                      <strong>Name:</strong> {user?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                      <strong>Role:</strong> {user?.role}
                    </p>
                    <p>
                      <strong>Joined:</strong>{" "}
                      {new Date(user?.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Last Login:</strong>{" "}
                      {user?.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "Never"}
                    </p>

                    <Button className="mt-3" onClick={() => setEdit(true)}>
                      Edit Profile
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Input
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      placeholder="Full Name"
                    />

                    <Input
                      value={profile.email}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      placeholder="Email"
                    />

                    <select
                      className="border p-2 rounded dark:bg-neutral-900 w-full"
                      value={profile.role}
                      onChange={(e) =>
                        setProfile({ ...profile, role: e.target.value })
                      }
                    >
                      <option value="USER">User</option>
                      <option value="ADMIN">Admin</option>
                      <option value="MODERATOR">Moderator</option>
                    </select>

                    <div className="flex gap-2">
                      <Button onClick={handleSaveProfile}>Save</Button>
                      <Button variant="outline" onClick={() => setEdit(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-4 border-t">
                  {user?.deletedAt ? (
                    <Button onClick={handleRestore}>Restore User</Button>
                  ) : (
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete User
                    </Button>
                  )}
                </div>
              </TabsContent>

              {/* --- ACTIVITY TAB --- */}
              <TabsContent value="activity" className="mt-4">
                <div className="space-y-3">
                  {activities?.length ? (
                    activities.map((a: any) => (
                      <div
                        key={a.id}
                        className="p-3 border rounded dark:border-neutral-700"
                      >
                        <p>{a.message}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(a.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No activity found.</p>
                  )}
                </div>
              </TabsContent>

              {/* --- SETTINGS TAB --- */}
              <TabsContent value="settings" className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Theme</Label>
                  <select
                    className="border p-2 rounded dark:bg-neutral-900"
                    value={settings.theme}
                    onChange={(e) =>
                      setSettings({ ...settings, theme: e.target.value })
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(v) =>
                      setSettings({ ...settings, emailNotifications: v })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Weekly Reports</Label>
                  <Switch
                    checked={settings.weeklyReports}
                    onCheckedChange={(v) =>
                      setSettings({ ...settings, weeklyReports: v })
                    }
                  />
                </div>

                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
