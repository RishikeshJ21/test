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
    <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-bold text-gray-900">Related Articles</h2>
        <div className="flex">
          <button
            onClick={handlePrev}
            className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg mr-2 transition-all ${currentPage === 0 ? 'text-gray-300 bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'}`}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className={`w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg transition-all ${currentPage >= totalPages - 1 ? 'text-gray-300 bg-gray-50' : 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm'}`}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={containerRef} className="space-y-3">
        {currentPosts.map((post) => (
          <Link
            key={post.id || post.slug}
            to={`/blog/${post.slug}`}
            className="flex items-start space-x-4 group py-2.5 hover:bg-gray-50 rounded-lg px-1 transition-all border border-transparent hover:border-gray-100 hover:shadow-sm"
          >
            <div className="relative flex-shrink-0">
              <img
                src={post.image || '/placeholder-image.jpg'}
                alt={post.title}
                className="w-16 h-16 object-cover rounded-lg shadow-sm"
              />
            </div>
            <div className="flex-grow">
              <div className="flex items-center mb-1.5">
                <span className="text-purple-600 text-xs font-semibold mr-2 bg-purple-50 px-2 py-0.5 rounded-full">
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
          <div className="py-10 text-center text-gray-500 border border-dashed border-gray-200 rounded-lg bg-gray-50">
            <p className="font-medium">No other articles in this category</p>
          </div>
        )}
      </div>
      
      {/* Page indicator */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            Page {currentPage + 1} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
};

export default RelatedArticles;