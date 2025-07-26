import HabitTracker from '@/components/HabitTracker';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function HabitsPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              ✅ Habit Tracker
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Build positive habits and track your daily progress with beautiful insights
            </p>
          </div>
          
          <HabitTracker />
          
          <div className="text-center mt-12">
            <a 
              href="/"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 underline transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </a>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
} 