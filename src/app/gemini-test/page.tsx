"use client";

import { useState } from 'react';
import GeminiBadge from '@/components/GeminiBadge';

export default function GeminiTestPage() {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('general');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch('/api/gemini/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      const data = await res.json();

      if (data.success) {
        if (type === 'json') {
          setResponse(JSON.stringify(data.response, null, 2));
        } else {
          setResponse(data.response);
        }
      } else {
        setError(data.error || 'Failed to generate response');
      }
    } catch (error) {
      console.error('Test error:', error);
      setError('Failed to generate response');
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = {
    general: "Explain quantum computing in simple terms",
    creative: "Write a short story about a robot learning to paint",
    analytical: "Analyze the benefits and drawbacks of remote work",
    json: "Create a JSON object with 3 motivational quotes, each with author and category"
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <GeminiBadge />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Gemini AI Test</h1>
          <p className="text-gray-600">Test the various Gemini AI functions</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Response Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General Text</option>
                <option value="creative">Creative Text</option>
                <option value="analytical">Analytical Text</option>
                <option value="json">JSON Response</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Enter your prompt here..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPrompt(examplePrompts[type as keyof typeof examplePrompts])}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                Load Example
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Response'
                )}
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {response && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Response</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              {type === 'json' ? (
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">{response}</pre>
              ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{response}</p>
              )}
            </div>
          </div>
        )}

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