"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivity } from "@/hooks/useActivity";
import { tr } from "@faker-js/faker";
import { useState } from "react";

export default function ActivityPage() {
  const [filters, setFilters] = useState({});
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const { data, isLoading } = useActivity(filters, page);

  const activities = data?.activities ?? [];
  const totalPages = data?.totalPages ?? 1;
  const handleClear = () => {
    setFilters({});
    setFromDate("");
    setToDate("");
    setPage(1);
  };
  return (
    <div className="space-y-6">
      {/* ---- Filters section ---- */}
      <div className="p-4 flex gap-4 items-center border-b">
        <input
          type="date"
          value={fromDate}
          className="border p-2 rounded dark:bg-neutral-800"
          onChange={(e) => {
            setFromDate(e.target.value);
            setFilters({ ...filters, from: e.target.value });
          }}
        />

        <input
          type="date"
          value={toDate}
          className="border p-2 rounded dark:bg-neutral-800"
          onChange={(e) => {
            setFromDate(e.target.value);
            setFilters({ ...filters, to: e.target.value });
          }}
        />
        <Button variant={"destructive"} onClick={handleClear}>
          Clear Filter
        </Button>
      </div>

      {/* ---- Table ---- */}
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100 dark:bg-neutral-800">
          <tr>
            <th className="p-3 text-left">User</th>

            <th className="p-3 text-left">Message</th>
            <th className="p-3 text-left">Time</th>
          </tr>
        </thead>

        <tbody>
          {isLoading
            ? [...Array(10)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b">
                  <td className="p-3 text-gray-500">
                    <Skeleton className="w-full h-6" />
                  </td>
                  <td className="p-3 text-gray-500">
                    <Skeleton className="w-full h-6" />
                  </td>
                  <td className="p-3 text-gray-500">
                    <Skeleton className="w-full h-6" />
                  </td>
                </tr>
              ))
            : activities.map((a) => (
                <tr key={a.id} className="border-b">
                  <td className="p-3">{a.user.email}</td>

                  <td className="p-3">{a.message}</td>

                  <td className="p-3">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {/* ---- Pagination Buttons ---- */}
      <div className="flex justify-center items-center gap-3 py-4">
        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>

        <span className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </span>

        <button
          className="px-3 py-2 border rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
