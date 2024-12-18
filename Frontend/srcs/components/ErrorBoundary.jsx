import React from 'react';
import { useRouteError } from 'react-router-dom';

function ErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl p-8 text-center bg-white shadow-xl rounded-lg">
        <h1 className="mb-4 text-4xl font-bold text-red-600">Oops!</h1>
        <p className="mb-2 text-gray-600">Something went wrong.</p>
        {error && (
          <pre className="mt-4 p-4 bg-gray-100 rounded text-sm text-gray-700 overflow-auto">
            {error.message || 'Unknown error occurred'}
          </pre>
        )}
        <button
          onClick={() => window.location.href = '/'}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
