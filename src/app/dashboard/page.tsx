export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-green-100 to-green-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-4 text-green-700">User Dashboard</h1>
        
        <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full border-2 border-green-300 bg-green-200 flex items-center justify-center">
              <span className="text-green-600 text-xl">👤</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-green-800 mb-2">
            Welcome to your Dashboard!
          </h2>
          <p className="text-green-600">Please login to see your profile information</p>
        </div>

        <p className="text-gray-700 mb-6">Here you can view your MBTI results, track your progress, and more.</p>
        
        <div className="border border-dashed border-green-400 p-6 rounded bg-green-50 text-green-600 mb-4">
          User stats and MBTI results coming soon!
        </div>
        
        <div className="flex gap-4 justify-center">
          <a 
            href="/api/auth/login" 
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Login
          </a>
          <a 
            href="/" 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Home
          </a>
        </div>
      </div>
    </main>
  );
} 