"use client";

import { useUser } from '@auth0/nextjs-auth0/client';

export default function AuthButton() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="px-6 py-2 bg-gray-400 text-white rounded">Loading...</div>;
  }

  if (user) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-blue-800">Welcome back, {user.name || user.email}!</p>
        </div>
        <a href="/api/auth/logout" className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
          Logout
        </a>
      </div>
    );
  }

  return (
    <a href="/api/auth/login" className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      Login
    </a>
  );
} 