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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-slate-500 py-8">
        <p className="mb-3">{error}</p>
        <button 
          onClick={fetchSentimentData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Retry
        </button>
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
      case 'positive': return '#10B981'; // emerald
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
        borderColor: '#6366F1', // indigo
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: sentimentColors,
        pointBorderColor: sentimentColors,
        pointRadius: 8,
        pointHoverRadius: 12,
        pointBorderWidth: 2,
      },
    ],
  };

  const entryCountChartData = {
    labels,
    datasets: [
      {
        label: 'Journal Entries',
        data: entryCountData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)', // emerald
        borderColor: '#10B981',
        borderWidth: 1,
        borderRadius: 6,
        borderSkipped: false,
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
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
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
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
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
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 14,
            weight: 'bold' as const,
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    },
  };

  const totalEntries = sentimentData.reduce((sum, item) => sum + item.entryCount, 0);
  const avgMotivation = sentimentData.length > 0 
    ? (sentimentData.reduce((sum, item) => sum + item.motivationLevel, 0) / sentimentData.length).toFixed(1)
    : '0';

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-3xl font-bold mb-2">{totalEntries}</div>
          <div className="text-indigo-100 text-sm font-medium">Total Entries</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-3xl font-bold mb-2">{avgMotivation}</div>
          <div className="text-emerald-100 text-sm font-medium">Avg Motivation</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="text-3xl font-bold mb-2">{sentimentData.filter(item => item.entryCount > 0).length}</div>
          <div className="text-purple-100 text-sm font-medium">Active Days</div>
        </div>
      </div>

      {/* Motivation Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Motivation Level Trend</h3>
        <div className="h-80">
          <Line data={motivationChartData} options={chartOptions} />
        </div>
        <p className="text-sm text-slate-600 mt-4 text-center">
          Point colors indicate daily sentiment: 🟢 Positive, 🔴 Negative, ⚪ Neutral
        </p>
      </div>

      {/* Entry Count Chart */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Daily Journal Entries</h3>
        <div className="h-80">
          <Bar data={entryCountChartData} options={barOptions} />
        </div>
      </div>
    </div>
  );
} 