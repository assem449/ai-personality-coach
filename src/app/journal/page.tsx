"use client";

export default function JournalPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-purple-100 to-purple-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-purple-700">Daily Journal</h1>
        <p className="text-gray-700 mb-6">Reflect on your day and track your personal growth.</p>
        {/* TODO: Implement journal entry form */}
        <div className="border border-dashed border-purple-400 p-6 rounded bg-purple-50 text-purple-600">Journal entry form coming soon!</div>
      </div>
    </main>
  );
} 