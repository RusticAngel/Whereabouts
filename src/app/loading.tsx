export default function Loading() {
  return (
    <main className="flex flex-col min-h-dvh items-center justify-center bg-black text-white gap-4 p-6">
      <div className="w-10 h-10 rounded-full border-2 border-gray-700 border-t-yellow-400 animate-spin" />
      <p className="text-gray-500 text-sm">Tracing the signal...</p>
    </main>
  );
}
