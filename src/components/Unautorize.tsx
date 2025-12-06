export default function Unauthorized() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-500">Unauthorized</h1>
      <p className="text-gray-500 mt-2">You do not have access to this page.</p>
    </div>
  );
}
