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
        <aside className="md:fixed md:left-0 md:top-0 md:h-full md:w-64 md:border-r md:border-neutral-200 md:dark:border-neutral-800 md:bg-white dark:bg-neutral-900 md:z-40">
          <Sidebar />
        </aside>

        {/* Main */}
        <div className="flex-1 flex flex-col md:ml-64">
          <header className="md:fixed md:top-0 md:left-64 md:right-0 md:h-16 md:border-b md:border-neutral-200 md:dark:border-neutral-800 md:bg-white dark:bg-neutral-900 md:z-30">
            <Header />
          </header>

          <main className="p-6 bg-neutral-50 dark:bg-neutral-900 min-h-screen md:mt-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto ">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
