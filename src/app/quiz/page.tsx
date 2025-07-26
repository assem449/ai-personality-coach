"use client";

export default function QuizPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-pink-100 to-pink-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-pink-700">MBTI Quiz</h1>
        <p className="text-gray-700 mb-6">Answer the following questions to discover your MBTI personality type.</p>
        {/* TODO: Implement quiz form */}
        <div className="border border-dashed border-pink-400 p-6 rounded bg-pink-50 text-pink-600">Quiz form coming soon!</div>
      </div>
    </main>
  );
} 