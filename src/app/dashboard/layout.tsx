"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="h-screen w-full flex overflow-hidden">
        {/* FIXED SIDEBAR */}
        <aside className="fixed left-0 top-0 h-full w-64 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-40">
          <Sidebar />
        </aside>

        {/* MAIN AREA (Shifted Right) */}
        <div className="flex-1 flex flex-col ml-64">
          {/* FIXED HEADER */}
          <header className="fixed top-0 left-64 right-0 h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-30">
            <Header />
          </header>

          {/* SCROLLABLE CONTENT */}
          <main className="mt-16 h-[calc(100vh-4rem)] overflow-y-auto p-6 bg-neutral-50 dark:bg-neutral-900">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
