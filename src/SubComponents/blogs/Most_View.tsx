import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  imageSrc: string;
}

interface MostViewProps {
  relatedPosts: RelatedPost[];
}

const MostView: React.FC<MostViewProps> = ({ relatedPosts }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < relatedPosts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Most View</h2>
        <div className="flex">
          <button
            onClick={handlePrev}
            className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md mr-2 ${currentIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md ${currentIndex >= relatedPosts.length - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            disabled={currentIndex >= relatedPosts.length - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="space-y-4 max-h-[400px] overflow-y-auto">
        {relatedPosts.map((post, index) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="flex items-start space-x-4 group py-2 hover:bg-gray-50 rounded-md px-2"
          >
            <div className="relative flex-shrink-0">
              <img
                src={post.imageSrc}
                alt={post.title}
                className="w-20 h-20 object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <span className="text-purple-600 text-xs font-medium mr-2">
                  {post.tags?.[0] || 'General'}
                </span>
                <span className="text-gray-500 text-xs">
                  {post.date}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-purple-700 transition-colors">
                {post.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MostView;