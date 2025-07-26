import HabitTracker from '@/components/HabitTracker';

export default function HabitsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Habit Tracker</h1>
          <p className="text-gray-600">Build positive habits and track your daily progress</p>
        </div>
        
        <HabitTracker />
        
        <div className="text-center mt-8">
          <a 
            href="/"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
} 