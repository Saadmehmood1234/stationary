// app/global-error.tsx
"use client";

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error caught:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-[#171E21] via-[#171E21] to-slate-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl font-black text-red-500 mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Something went wrong!
            </h1>
            <p className="text-gray-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={reset}
              className="bg-gradient-to-r from-[#D5D502] to-yellow-500 text-slate-900 px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}