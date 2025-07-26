export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to AI Personality Coach</h1>
        <p className="text-lg text-gray-700 mb-6">Discover your MBTI type, journal your thoughts, and unlock your personal growth journey.</p>
        
        <div className="flex flex-col gap-4 items-center">
          <a href="/quiz" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Take the MBTI Quiz</a>
          <a href="/dashboard" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">Go to Dashboard</a>
          <a href="/habits" className="px-6 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition">Habit Tracker</a>
          <a href="/journal" className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition">Daily Journal</a>
          
          <div className="flex gap-4">
            <a href="/api/auth/login" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">Login</a>
            <a href="/api/auth/logout" className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Logout</a>
          </div>
        </div>
      </div>
    </main>
  );
}
