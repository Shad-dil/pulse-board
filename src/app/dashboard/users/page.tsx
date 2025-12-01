"use client";

import { useState, useRef, useEffect } from "react";
import { useInfiniteUsers } from "@/hooks/useInfiniteUser";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useExportUsers } from "@/hooks/useExportUser";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import UserDetailsModal from "@/components/users/UserDetailsModal";

export default function UsersPage() {
  const [productTitle, setProductTitle] = useState("Loading...");

  useEffect(() => {
    document.title = "PulseBoard || Users";
  }, []);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");

  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const tableRef = useRef<HTMLDivElement | null>(null);
  const exporter = useExportUsers();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteUsers({
      search,
      role,
      sortBy,
      order,
      limit: 10,
    });

  useInfiniteScroll(tableRef, () => {
    if (hasNextPage) fetchNextPage();
  });

  const users = data?.pages.flatMap((p: any) => p.users) ?? [];

  const toggleSort = (field: string) => {
    if (sortBy === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSortBy(field);
      setOrder("asc");
    }
  };

  const sortArrow =
    order === "asc" ? (
      <span className="text-xs ml-1">▲</span>
    ) : (
      <span className="text-xs ml-1">▼</span>
    );

  return (
    <div className="space-y-6 w-full">
      <h2 className="text-2xl font-semibold">Users</h2>

      {/* ⬆️ SEARCH + FILTER + EXPORT */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <input
          type="text"
          placeholder="Search users..."
          className="border p-2 rounded dark:bg-neutral-900 w-full md:w-auto flex-1"
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex gap-3 w-full md:w-auto">
          <select
            className="border p-2 rounded dark:bg-neutral-900 w-full md:w-auto"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
            <option value="MODERATOR">Moderator</option>
          </select>

          <Button
            onClick={() => exporter.exportCSV({ search, role, sortBy, order })}
            className="whitespace-nowrap"
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* ⬇️ RESPONSIVE TABLE WRAPPER */}
      <div
        ref={tableRef}
        className="
          h-[480px]
          overflow-y-auto 
          border rounded-lg dark:bg-neutral-900
          overflow-x-auto
          w-full
        "
      >
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <table className="min-w-[600px] w-full text-sm">
            <thead className="bg-gray-100 dark:bg-neutral-800 sticky top-0 z-10">
              <tr>
                <th
                  className="p-3 text-left cursor-pointer whitespace-nowrap"
                  onClick={() => toggleSort("name")}
                >
                  Name {sortBy === "name" && sortArrow}
                </th>

                <th
                  className="p-3 text-left cursor-pointer whitespace-nowrap"
                  onClick={() => toggleSort("email")}
                >
                  Email {sortBy === "email" && sortArrow}
                </th>

                <th
                  className="p-3 text-left cursor-pointer whitespace-nowrap"
                  onClick={() => toggleSort("role")}
                >
                  Role {sortBy === "role" && sortArrow}
                </th>

                <th
                  className="p-3 text-left cursor-pointer whitespace-nowrap"
                  onClick={() => toggleSort("createdAt")}
                >
                  Joined {sortBy === "createdAt" && sortArrow}
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className="
                    border-t dark:border-neutral-700 
                    hover:bg-gray-50 dark:hover:bg-neutral-800 
                    cursor-pointer transition
                  "
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3 break-all">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3 whitespace-nowrap">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {isFetchingNextPage && (
          <div className="p-3 text-center text-sm text-gray-500">
            Loading more...
          </div>
        )}

        {!hasNextPage && users.length > 0 && (
          <div className="p-3 text-center text-xs text-gray-400">
            End of results
          </div>
        )}
      </div>

      {/* ⬇️ MODAL (with full mobile responsiveness) */}
      <UserDetailsModal
        userId={selectedUserId}
        open={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
      />
    </div>
  );
}
