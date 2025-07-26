'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { user, loading, isAuthenticated, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-teal-50">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              <span className="text-xl font-bold text-slate-900">Personality Coach</span>
            </div>
            <div className="flex items-center space-x-4">
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-slate-600">Welcome! {user?.name}</span>
                      <Button variant="outline" size="sm" onClick={logout}>
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <Button variant="ghost" size="sm" onClick={login}>
                        Sign In
                      </Button>
                      <Button variant="gradient" size="sm" onClick={login}>
                        Get Started
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Discover Your
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {" "}True Self
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Unlock your personality insights with AI-powered MBTI analysis, 
            personalized journaling, and habit tracking designed for your unique traits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" variant="gradient" className="text-lg px-8 py-4" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" variant="gradient" className="text-lg px-8 py-4" onClick={login}>
                Start Your Journey
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything You Need to Thrive
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our comprehensive platform combines personality insights with practical tools 
            to help you understand yourself better and build lasting positive habits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* MBTI Quiz */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mb-4 group-hover:bg-indigo-200 transition-colors">
                <span className="text-2xl">🧠</span>
              </div>
              <CardTitle>Personality Assessment</CardTitle>
              <CardDescription>
                Take our scientifically-backed MBTI quiz to discover your unique personality type 
                and understand your strengths, preferences, and potential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/quiz" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                Take the Quiz
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>

          {/* Journaling */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                <span className="text-2xl">📝</span>
              </div>
              <CardTitle>AI-Powered Journaling</CardTitle>
              <CardDescription>
                Reflect on your day with intelligent journaling that analyzes your mood, 
                motivation, and provides personalized insights and prompts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/journal" className="inline-flex items-center text-teal-600 hover:text-teal-700 font-medium">
                Start Journaling
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>

          {/* Habit Tracking */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <span className="text-2xl">✅</span>
              </div>
              <CardTitle>Smart Habit Tracker</CardTitle>
              <CardDescription>
                Build lasting habits with our intelligent tracking system that adapts to your 
                personality type and provides personalized motivation and insights.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/habits" className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium">
                Track Habits
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>

          {/* Dashboard */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:bg-slate-200 transition-colors">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>Personal Dashboard</CardTitle>
              <CardDescription>
                View your progress with beautiful charts, track your mood trends, 
                and get AI-powered recommendations tailored to your personality.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/dashboard" className="inline-flex items-center text-slate-600 hover:text-slate-700 font-medium">
                View Dashboard
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>

          {/* Personalized Insights */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                <span className="text-2xl">✨</span>
              </div>
              <CardTitle>Personalized Insights</CardTitle>
              <CardDescription>
                Discover your unique path with AI-powered recommendations for habits, 
                career paths, and personal growth based on your personality type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/recommendations" className="inline-flex items-center text-amber-600 hover:text-amber-700 font-medium">
                Get Insights
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>

          {/* Community */}
          <Card className="group hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <span className="text-2xl">🌟</span>
              </div>
              <CardTitle>Personal Growth</CardTitle>
              <CardDescription>
                Embark on a journey of self-discovery with tools designed to help you 
                understand yourself better and unlock your full potential.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <a href="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
                Start Growing
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Discover Your True Self?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who have transformed their lives through 
            self-awareness and personalized growth strategies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => window.location.href = '/dashboard'}>
                Go to Dashboard
              </Button>
            ) : (
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={login}>
                Start Free Assessment
              </Button>
            )}
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white hover:bg-white hover:text-indigo-600">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p>&copy; 2025 Personality Coach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
