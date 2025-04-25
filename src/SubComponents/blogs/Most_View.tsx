import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RelatedPost {
  id?: string;
  title: string;
  slug: string;
  date: string;
  category?: string;
  excerpt?: string;
  image?: string;
}

interface RelatedArticlesProps {
  relatedPosts: RelatedPost[];
  currentCategory?: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ relatedPosts, currentCategory }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Number of posts to display per page
  const postsPerPage = 3;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(relatedPosts.length / postsPerPage);
  
  // Get current page posts
  const currentPosts = relatedPosts.slice(
    currentPage * postsPerPage, 
    (currentPage + 1) * postsPerPage
  );

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Related Articles</h2>
        <div className="flex">
          <button
            onClick={handlePrev}
            className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md mr-2 ${currentPage === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md ${currentPage >= totalPages - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'}`}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="space-y-3">
        {currentPosts.map((post) => (
          <Link
            key={post.id || post.slug}
            to={`/blog/${post.slug}`}
            className="flex items-start space-x-4 group py-2 hover:bg-gray-50 rounded-md px-2"
          >
            <div className="relative flex-shrink-0">
              <img
                src={post.image || '/placeholder-image.jpg'}
                alt={post.title}
                className="w-16 h-16 object-cover rounded"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-1">
                <span className="text-purple-600 text-xs font-medium mr-2">
                  {post.category || 'General'}
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
        
        {/* Show empty state if no posts */}
        {currentPosts.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No other articles in this category
          </div>
        )}
      </div>
      
      {/* Page indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="text-xs text-gray-500">
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedArticles;