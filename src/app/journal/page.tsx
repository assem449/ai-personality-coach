"use client";

import JournalForm from '@/components/JournalForm';

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Journal</h1>
          <p className="text-gray-600">Reflect on your day and get AI-powered insights about your mood and motivation</p>
        </div>
        
        <JournalForm />
        
        <div className="text-center mt-8">
          <a 
            href="/"
            className="text-purple-600 hover:text-purple-700 underline"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  );
} 