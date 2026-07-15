export function CorrectFeedback() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="bg-green-900/90 text-green-400 px-6 sm:px-8 py-4 rounded-2xl border border-green-700 animate-fade-in">
        <p className="text-xl sm:text-2xl font-bold">✓ Correct!</p>
      </div>
    </div>
  );
}
