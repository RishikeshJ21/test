import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Article {
  id?: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date: string;
  category?: string;
}

interface RecommendedArticlesProps {
  articles: Article[];
  title?: string;
}

const RecommendedArticles = ({ articles, title = "Recommended Articles" }: RecommendedArticlesProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check if scrolling is possible
  const checkScrollability = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth - 10
      );
    }
  };

  // Initialize scroll state
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, [articles]);

  // Handle scroll events
  const handleScroll = () => {
    checkScrollability();
  };

  // Scroll left/right button handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="py-10 px-0 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full ${canScrollLeft 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2 rounded-full ${canScrollRight 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        className="flex overflow-x-auto pb-4 space-x-5 scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.id || article.slug}
            className="min-w-[300px] max-w-[300px] bg-white rounded-xl shadow-md overflow-hidden flex-shrink-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Link 
              to={`/blog/${article.slug}${article.id ? `?id=${article.id}` : ''}`} 
              className="block h-full"
            >
              {article.image && (
                <div className="h-36 w-full bg-gray-200 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  {article.category && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full mr-2 font-medium">
                      {article.category}
                    </span>
                  )}
                  <span>{article.date}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="mt-3 text-purple-600 text-sm font-medium flex items-center">
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default RecommendedArticles; 