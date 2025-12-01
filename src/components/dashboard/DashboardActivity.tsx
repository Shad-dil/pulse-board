"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

type ActivityItem = {
  id: string;
  message: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function DashboardActivity({
  activity,
}: {
  activity: ActivityItem[];
}) {
  if (!activity || activity.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-sm text-gray-500">
          No recent activity.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[400px] overflow-y-scroll hover:dark:border hover:dark:border-green-900 cursor-pointer">
      <CardContent className="p-4 space-y-4">
        <h3 className="font-semibold text-lg mb-2">Recent Activity</h3>

        <div className="space-y-4">
          {activity.map((item) => {
            const icon = getActivityIcon(item.message);
            const timeAgo = formatDistanceToNow(new Date(item.createdAt), {
              addSuffix: true,
            });

            return (
              <div key={item.id} className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{getInitials(item.user.name)}</AvatarFallback>
                </Avatar>

                {/* Text Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{item.user.name}</p>
                    <span className="text-xs text-gray-500">{timeAgo}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-300 mt-1">
                    <span className="text-lg">{icon}</span>
                    <p>{item.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/* ---------------- HELPERS ---------------- */

function getInitials(name: string = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getActivityIcon(message: string) {
  const text = message.toLowerCase();

  if (text.includes("login") || text.includes("logged")) return "🔑";
  if (text.includes("signup") || text.includes("signed")) return "🆕";
  if (text.includes("password")) return "🔐";
  if (text.includes("updated") || text.includes("changed")) return "⚙️";
  if (text.includes("created") || text.includes("added")) return "➕";
  if (text.includes("deleted") || text.includes("removed")) return "🗑️";
  if (text.includes("error") || text.includes("failed")) return "❗";

  return "📌"; // default icon
}
