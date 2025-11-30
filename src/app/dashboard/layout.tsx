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
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main */}
        <div className="flex-1 flex flex-col">
          <Header />

          <main className="p-6 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
