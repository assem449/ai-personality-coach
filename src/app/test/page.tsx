"use client";

import { useState } from 'react';

export default function TestPage() {
  const [dbStatus, setDbStatus] = useState<string>('');
  const [simpleStatus, setSimpleStatus] = useState<string>('');
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [connectionInfo, setConnectionInfo] = useState<any>(null);
  const [testUser, setTestUser] = useState<any>(null);

  const testConnectionFormat = async () => {
    try {
      const response = await fetch('/api/test-connection');
      const data = await response.json();
      setConnectionInfo(data.connectionInfo);
    } catch (error) {
      console.error('Connection format test error:', error);
    }
  };

  const testSimpleConnection = async () => {
    try {
      const response = await fetch('/api/simple-test');
      const data = await response.json();
      setSimpleStatus(data.success ? '✅ Simple Connected' : '❌ Simple Failed');
      if (!data.success) {
        console.error('Simple connection error:', data.message);
      }
    } catch (error) {
      setSimpleStatus('❌ Simple Error');
      console.error('Simple test error:', error);
    }
  };

  const testDatabase = async () => {
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setDbStatus(data.success ? '✅ Connected' : '❌ Failed');
      if (!data.success) {
        console.error('Database error details:', data.details);
        console.error('Guidance:', data.guidance);
      }
    } catch (error) {
      setDbStatus('❌ Error');
      console.error('Database test error:', error);
    }
  };

  const getDatabaseInfo = async () => {
    try {
      const response = await fetch('/api/db-status');
      const data = await response.json();
      if (data.success) {
        setDbInfo(data.database);
      }
    } catch (error) {
      console.error('Database info error:', error);
    }
  };

  const createTestUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0Id: 'test-auth0-id',
          email: 'test@example.com',
          name: 'Test User',
          picture: 'https://via.placeholder.com/150',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setTestUser(data.user);
      }
    } catch (error) {
      console.error('Create user error:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-100 to-gray-300">
      <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Database Test Page</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Connection String Format</h2>
            <button 
              onClick={testConnectionFormat}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              Test Connection Format
            </button>
            {connectionInfo && (
              <div className="mt-4 p-4 bg-purple-50 rounded border text-left">
                <h3 className="font-semibold">Connection Info:</h3>
                <p>Has URI: {connectionInfo.hasUri ? '✅' : '❌'}</p>
                <p>Valid Format: {connectionInfo.isValidFormat ? '✅' : '❌'}</p>
                <p>Has Credentials: {connectionInfo.hasCredentials ? '✅' : '❌'}</p>
                <p>Has Cluster: {connectionInfo.hasCluster ? '✅' : '❌'}</p>
                <p>URI Length: {connectionInfo.uriLength}</p>
                <p>Start: {connectionInfo.uriStart}</p>
                <p>End: {connectionInfo.uriEnd}</p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Simple Connection Test</h2>
            <button 
              onClick={testSimpleConnection}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
            >
              Test Simple Connection
            </button>
            {simpleStatus && (
              <p className="mt-2 text-sm">{simpleStatus}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Database Connection</h2>
            <button 
              onClick={testDatabase}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Test Connection
            </button>
            {dbStatus && (
              <p className="mt-2 text-sm">{dbStatus}</p>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Database Info</h2>
            <button 
              onClick={getDatabaseInfo}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Get Database Info
            </button>
            {dbInfo && (
              <div className="mt-4 p-4 bg-indigo-50 rounded border text-left">
                <h3 className="font-semibold">Database Status:</h3>
                <p>Name: {dbInfo.name}</p>
                <p>Collections: {dbInfo.collections.length}</p>
                <p>Connection State: {dbInfo.connectionState}</p>
                <p className="text-sm text-gray-600">
                  Collections: {dbInfo.collections.join(', ')}
                </p>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">User Creation</h2>
            <button 
              onClick={createTestUser}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Create Test User
            </button>
            {testUser && (
              <div className="mt-4 p-4 bg-green-50 rounded border">
                <h3 className="font-semibold">User Created:</h3>
                <p>Name: {testUser.name}</p>
                <p>Email: {testUser.email}</p>
                <p>ID: {testUser.id}</p>
              </div>
            )}
          </div>

          <div>
            <a 
              href="/"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
} 