"use client";

import { motion } from 'framer-motion';

interface BlogCardSkeletonProps {
  index: number;
}

export default function BlogCardSkeleton({ index }: BlogCardSkeletonProps) {
  return (
    <motion.article
      className="bg-white rounded-xl overflow-hidden shadow-sm transition-shadow duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="block h-52 md:h-60 overflow-hidden relative bg-gray-200 animate-pulse">
        <div className="absolute top-4 left-4">
          <div className="px-3 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded-full w-16 h-5"></div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 rounded bg-gray-200 animate-pulse"></div>
          </div>
        </div>

        <div className="block">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse mb-4"></div>

          <div className="inline-flex items-center h-5 w-24 bg-gray-200 rounded animate-pulse">
          </div>
        </div>
      </div>
    </motion.article>
  );
}