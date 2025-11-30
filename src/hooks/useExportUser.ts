export function useExportUsers() {
  const exportCSV = async (params: any = {}) => {
    const url = new URL("/api/users/export", window.location.origin);
    Object.entries(params).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, String(v));
    });

    const res = await fetch(url.toString());
    const blob = await res.blob();
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";

    link.click();
  };

  return { exportCSV };
}
