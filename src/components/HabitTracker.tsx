"use client";

import { useState, useEffect } from 'react';

interface Habit {
  _id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  completed: number;
  streak: number;
  longestStreak: number;
  isActive: boolean;
  tracking?: Record<string, boolean>;
  createdAt: string;
}

interface HabitFormData {
  title: string;
  description: string;
  category: string;
  frequency: string;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [formData, setFormData] = useState<HabitFormData>({
    title: '',
    description: '',
    category: 'health',
    frequency: 'daily'
  });

  // Get last 7 days for tracking
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  };

  const days = getLast7Days();

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits');
      const data = await response.json();
      
      if (data.success) {
        setHabits(data.habits);
      } else {
        setError(data.error || 'Failed to fetch habits');
      }
    } catch (error) {
      console.error('Fetch habits error:', error);
      setError('Failed to fetch habits');
    } finally {
      setIsLoading(false);
    }
  };

  const createHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (habits.length >= 3) {
      setError('Maximum 3 habits allowed');
      return;
    }

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setHabits(prev => [...prev, data.habit]);
        setShowForm(false);
        setFormData({
          title: '',
          description: '',
          category: 'health',
          frequency: 'daily'
        });
        setError('');
      } else {
        setError(data.error || 'Failed to create habit');
      }
    } catch (error) {
      console.error('Create habit error:', error);
      setError('Failed to create habit');
    }
  };

  const trackHabit = async (habitId: string, date: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/habits/${habitId}/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, completed }),
      });

      const data = await response.json();

      if (data.success) {
        // Update the habit in state
        setHabits(prev => prev.map(habit => 
          habit._id === habitId 
            ? { 
                ...habit, 
                completed: data.habit.completed,
                streak: data.habit.streak,
                longestStreak: data.habit.longestStreak,
                tracking: data.habit.tracking
              }
            : habit
        ));
      } else {
        setError(data.error || 'Failed to track habit');
      }
    } catch (error) {
      console.error('Track habit error:', error);
      setError('Failed to track habit');
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      health: 'bg-green-100 text-green-800',
      productivity: 'bg-blue-100 text-blue-800',
      learning: 'bg-purple-100 text-purple-800',
      social: 'bg-pink-100 text-pink-800',
      mindfulness: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.other;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading habits...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Habit Tracker</h2>
        {habits.length < 3 && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {showForm ? 'Cancel' : 'Add Habit'}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Add Habit Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Create New Habit</h3>
          <form onSubmit={createHabit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Habit Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Exercise for 30 minutes"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional description..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="health">Health</option>
                  <option value="productivity">Productivity</option>
                  <option value="learning">Learning</option>
                  <option value="social">Social</option>
                  <option value="mindfulness">Mindfulness</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency *
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>


            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Create Habit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Habits List */}
      {habits.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No habits created yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Create Your First Habit
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {habits.map((habit) => (
            <div key={habit._id} className="bg-white rounded-lg border shadow-sm p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{habit.title}</h3>
                  {habit.description && (
                    <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(habit.category)}`}>
                      {habit.category}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {habit.frequency}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-lg font-bold text-blue-600">
                    {habit.completed} completed
                  </p>
                  <p className="text-xs text-gray-500">
                    {habit.streak} day streak
                  </p>
                </div>
              </div>

              {/* Daily Tracking */}
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Last 7 Days</h4>
                <div className="grid grid-cols-7 gap-2">
                  {days.map((date) => {
                    const isCompleted = habit.tracking?.[date] || false;
                    return (
                      <div key={date} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          {formatDate(date)}
                        </div>
                        <button
                          onClick={() => trackHabit(habit._id, date, !isCompleted)}
                          className={`w-8 h-8 rounded-full border-2 transition-colors ${
                            isCompleted
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-300'
                          }`}
                        >
                          {isCompleted ? '✓' : ''}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 