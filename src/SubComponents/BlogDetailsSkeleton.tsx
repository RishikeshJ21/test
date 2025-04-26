"use client";

import { motion } from 'framer-motion';

export default function BlogDetailsSkeleton() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex flex-col">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
          <div className="mb-10 text-left">
            {/* Title skeleton */}
            <div className="h-12 bg-gray-200 rounded-md w-3/4 mb-4 animate-pulse"></div>

            {/* Tags skeleton */}
            <div className="flex items-center mt-4">
              <div className="flex flex-wrap gap-2">
                <div className="h-6 w-16 bg-purple-100 rounded-full animate-pulse"></div>
                <div className="h-6 w-20 bg-purple-100 rounded-full animate-pulse"></div>
                <div className="h-6 w-14 bg-purple-100 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          <div>
            {/* Image skeleton */}
            <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] mb-8 rounded-lg overflow-hidden bg-gray-200 animate-pulse"></div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}