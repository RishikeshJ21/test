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
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 relative">
          {title}
          <span className="absolute -bottom-2 left-0 w-20 h-1 bg-purple-600 rounded-full"></span>
        </h2>
        
        <div className="flex space-x-3">
          <button 
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`p-2.5 rounded-full transition-all duration-200 ${canScrollLeft 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-sm' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`p-2.5 rounded-full transition-all duration-200 ${canScrollRight 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-200 shadow-sm' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {articles.map((article, index) => (
          <motion.div
            key={article.id || article.slug}
            className="min-w-[320px] max-w-[320px] bg-white rounded-xl shadow-lg overflow-hidden flex-shrink-0 border border-gray-100 hover:border-purple-200 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ y: -8, boxShadow: '0 10px 25px -5px rgba(124, 58, 237, 0.1)', transition: { duration: 0.2 } }}
          >
            <Link 
              to={`/blog/${article.slug}${article.id ? `?id=${article.id}` : ''}`} 
              className="block h-full"
            >
              {article.image && (
                <div className="h-44 w-full bg-gray-200 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              )}
              
              <div className="p-5">
                <div className="flex items-center text-xs text-gray-500 mb-3">
                  {article.category && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full mr-2 font-medium">
                      {article.category}
                    </span>
                  )}
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {article.date}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 text-lg">
                  {article.title}
                </h3>
                
                {article.excerpt && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="mt-4 text-purple-600 text-sm font-medium flex items-center group">
                  <span className="group-hover:mr-2 transition-all duration-300">Read Article</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <style>
        {`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
    </div>
  );
};

export default RecommendedArticles; 