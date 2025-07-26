"use client";

import { useState, useEffect } from 'react';
import GeminiBadge from '@/components/GeminiBadge';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  isPrivate: boolean;
  date: string;
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative';
    motivationLevel: number;
    summary: string;
    insights: string[];
    moodKeywords: string[];
  };
}

interface JournalFormData {
  title: string;
  content: string;
  mood: string;
  tags: string;
  isPrivate: boolean;
}

const MOOD_OPTIONS = [
  { value: 'happy', label: '😊 Happy', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'excited', label: '🎉 Excited', color: 'bg-orange-100 text-orange-800' },
  { value: 'calm', label: '😌 Calm', color: 'bg-blue-100 text-blue-800' },
  { value: 'grateful', label: '🙏 Grateful', color: 'bg-green-100 text-green-800' },
  { value: 'content', label: '😐 Content', color: 'bg-gray-100 text-gray-800' },
  { value: 'sad', label: '😢 Sad', color: 'bg-blue-100 text-blue-800' },
  { value: 'anxious', label: '😰 Anxious', color: 'bg-red-100 text-red-800' },
  { value: 'frustrated', label: '😤 Frustrated', color: 'bg-red-100 text-red-800' },
  { value: 'stressed', label: '😰 Stressed', color: 'bg-purple-100 text-purple-800' },
  { value: 'other', label: '🤔 Other', color: 'bg-gray-100 text-gray-800' },
];

export default function JournalForm() {
  const [formData, setFormData] = useState<JournalFormData>({
    title: '',
    content: '',
    mood: 'content',
    tags: '',
    isPrivate: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [recentEntry, setRecentEntry] = useState<JournalEntry | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in both title and content');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecentEntry(data.entry);
        setShowAnalysis(true);
        setSuccess('Journal entry created successfully!');
        
        // Reset form
        setFormData({
          title: '',
          content: '',
          mood: 'content',
          tags: '',
          isPrivate: false,
        });
      } else {
        setError(data.error || 'Failed to create journal entry');
      }
    } catch (error) {
      console.error('Journal submission error:', error);
      setError('Failed to create journal entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMotivationColor = (level: number) => {
    if (level >= 4) return 'text-green-600';
    if (level >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMotivationText = (level: number) => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Moderate';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Unknown';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Daily Journal</h2>
        <p className="text-gray-600">Reflect on your day and get AI-powered insights</p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* AI Analysis Display */}
      {showAnalysis && recentEntry?.aiAnalysis && (
        <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-lg font-semibold text-purple-800">🤖 AI Analysis</h3>
            <GeminiBadge />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Sentiment</h4>
              <p className={`text-lg font-semibold ${getSentimentColor(recentEntry.aiAnalysis.sentiment)}`}>
                {recentEntry.aiAnalysis.sentiment.charAt(0).toUpperCase() + recentEntry.aiAnalysis.sentiment.slice(1)}
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Motivation Level</h4>
              <p className={`text-lg font-semibold ${getMotivationColor(recentEntry.aiAnalysis.motivationLevel)}`}>
                {recentEntry.aiAnalysis.motivationLevel}/5 - {getMotivationText(recentEntry.aiAnalysis.motivationLevel)}
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
            <p className="text-gray-800">{recentEntry.aiAnalysis.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Insights</h4>
              <ul className="space-y-1">
                {recentEntry.aiAnalysis.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Mood Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {recentEntry.aiAnalysis.moodKeywords.map((keyword, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journal Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border shadow-sm p-6">
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="What's on your mind today?"
              required
            />
          </div>

          {/* Mood Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How are you feeling? *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.mood === mood.value
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg mb-1">{mood.label.split(' ')[0]}</div>
                    <div className="text-xs text-gray-600">{mood.label.split(' ')[1]}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Reflection *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              rows={8}
              placeholder="Write about your day, thoughts, feelings, or anything you'd like to reflect on..."
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (optional)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="work, family, goals, etc. (comma separated)"
            />
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPrivate"
              checked={formData.isPrivate}
              onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isPrivate" className="ml-2 block text-sm text-gray-700">
              Make this entry private
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing with AI...
              </div>
            ) : (
              'Save Entry & Get AI Insights'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 