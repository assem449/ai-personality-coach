'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SentimentData {
  date: string;
  sentiment: string;
  motivationLevel: number;
  entryCount: number;
}

export default function SentimentChart() {
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSentimentData();
  }, []);

  const fetchSentimentData = async () => {
    try {
      const response = await fetch('/api/journal/sentiment');
      const data = await response.json();

      if (data.success) {
        setSentimentData(data.data);
      } else {
        setError(data.error || 'Failed to fetch sentiment data');
      }
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
      setError('Failed to load sentiment data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Journal Sentiment (Last 7 Days)</h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Journal Sentiment (Last 7 Days)</h3>
        <div className="text-center text-gray-500 py-8">
          <p>{error}</p>
          <button 
            onClick={fetchSentimentData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const labels = sentimentData.map(item => {
    const date = new Date(item.date);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const motivationData = sentimentData.map(item => item.motivationLevel);
  const entryCountData = sentimentData.map(item => item.entryCount);

  // Sentiment color mapping
  const sentimentColors = sentimentData.map(item => {
    switch (item.sentiment) {
      case 'positive': return '#10B981'; // green
      case 'negative': return '#EF4444'; // red
      default: return '#6B7280'; // gray
    }
  });

  const motivationChartData = {
    labels,
    datasets: [
      {
        label: 'Motivation Level (1-5)',
        data: motivationData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: sentimentColors,
        pointBorderColor: sentimentColors,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  const entryCountChartData = {
    labels,
    datasets: [
      {
        label: 'Journal Entries',
        data: entryCountData,
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: '#6366F1',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context: any) {
            const index = context.dataIndex;
            const sentiment = sentimentData[index]?.sentiment;
            return `Sentiment: ${sentiment}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const totalEntries = sentimentData.reduce((sum, item) => sum + item.entryCount, 0);
  const avgMotivation = sentimentData.length > 0 
    ? (sentimentData.reduce((sum, item) => sum + item.motivationLevel, 0) / sentimentData.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{totalEntries}</div>
          <div className="text-sm opacity-90">Total Entries</div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{avgMotivation}</div>
          <div className="text-sm opacity-90">Avg Motivation</div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
          <div className="text-2xl font-bold">{sentimentData.filter(item => item.entryCount > 0).length}</div>
          <div className="text-sm opacity-90">Active Days</div>
        </div>
      </div>

      {/* Motivation Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Motivation Level Trend</h3>
        <div className="h-64">
          <Line data={motivationChartData} options={chartOptions} />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Point colors indicate daily sentiment: 🟢 Positive, 🔴 Negative, ⚪ Neutral
        </p>
      </div>

      {/* Entry Count Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Daily Journal Entries</h3>
        <div className="h-64">
          <Bar data={entryCountChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
} 