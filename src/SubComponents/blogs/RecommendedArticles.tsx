import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import BlogCard from '../BlogCard';

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
  if (!articles || articles.length === 0) {
    return null;
  }

  // State for controlling carousel
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Number of cards to display based on screen size - updated to show 4 on large screens
  const [cardsToShow, setCardsToShow] = useState(4);

  // Update cards to show based on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1);
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2);
      } else if (window.innerWidth < 1280) {
        setCardsToShow(3);
      } else {
        setCardsToShow(4); // Show 4 cards on extra large screens
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-scroll effect
  useEffect(() => {
    const startTimer = () => {
      timerRef.current = setInterval(() => {
        if (!isPaused) {
          setCurrentIndex(prevIndex =>
            prevIndex === Math.max(0, articles.length - cardsToShow) ? 0 : prevIndex + 1
          );
        }
      }, 3000); // Change slide every 3 seconds
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [articles.length, isPaused, cardsToShow]);

  // Handle navigation
  const goToNext = () => {
    setCurrentIndex(prevIndex =>
      Math.min(prevIndex + 1, Math.max(0, articles.length - cardsToShow))
    );
  };

  const goToPrev = () => {
    setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, Math.max(0, articles.length - cardsToShow)));
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 relative">
          {title}
          <span className="absolute -bottom-2 left-0 w-20 h-1 bg-purple-600 rounded-full"></span>
        </h2>

        {/* Navigation arrows */}
        <div className="flex space-x-2">
          <button
            onClick={goToPrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous articles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            disabled={currentIndex >= articles.length - cardsToShow}
            className="p-2 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next articles"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div
        className="overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          className="flex"
          initial={false}
          animate={{ x: `-${currentIndex * (100 / cardsToShow)}%` }}
          transition={{ type: "tween", duration: 0.5 }}
        >
          {articles.map((article, index) => (
            <div
              key={article.id || article.slug}
              className={`flex-shrink-0 px-3`} // Increased horizontal padding
              style={{ width: `${100 / cardsToShow}%` }}
            >
              <div className="h-full">
                <BlogCard
                  id={article.id as number}
                  slug={article.slug}
                  title={article.title}
                  excerpt={article.excerpt || 'Read more about this interesting article to learn the details and key insights.'}
                  imageSrc={article.image || ''}
                  category={article.category || 'General'}
                  date={article.date}
                  index={index}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: Math.max(1, articles.length - cardsToShow + 1) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 w-2 rounded-full ${currentIndex === index ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedArticles; 