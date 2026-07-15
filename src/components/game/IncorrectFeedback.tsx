interface IncorrectFeedbackProps {
  correctAnswer: string;
}

export function IncorrectFeedback({ correctAnswer }: IncorrectFeedbackProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-red-900/90 text-red-400 px-6 sm:px-8 py-4 rounded-2xl border border-red-700 text-center">
        <p className="text-xl sm:text-2xl font-bold mb-1">✗ Incorrect</p>
        <p className="text-sm text-red-300">That was: {correctAnswer}</p>
      </div>
    </div>
  );
}
