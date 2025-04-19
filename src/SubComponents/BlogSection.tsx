import BlogCard from './BlogCard';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data/blog';

// Extract unique categories from blog posts
const categories = ["All", ...Array.from(new Set(blogPosts.map(post => post.category)))];

// Number of posts to show per page
const POSTS_PER_PAGE = 6;

export default function BlogSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const isInitialMount = useRef(true); // Ref to track initial mount

  // Filter posts based on selected category
  const filteredPosts = selectedCategory === "All"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Get current posts based on pagination
  const currentPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Helper function to scroll to the top of the blog section
  const scrollToBlogSectionTop = () => {
    requestAnimationFrame(() => {
      const blogSection = document.querySelector('.blog-section');
      if (blogSection) {
        const offsetTop = blogSection.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({
          top: offsetTop < 0 ? 0 : offsetTop,
          behavior: 'smooth'
        });
      }
    });
  };

  // Reset to first page and scroll when category changes
  useEffect(() => {
    if (!isInitialMount.current || selectedCategory !== "All") {
      setCurrentPage(1);
      if (filteredPosts.length > 0) {
        scrollToBlogSectionTop();
      }
    }
  }, [selectedCategory]);

  // Scroll to top when page changes (but not on initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (filteredPosts.length > 0) {
        scrollToBlogSectionTop();
      }
    }
  }, [currentPage]);

  // Handle page navigation functions
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      handlePageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage !== totalPages) {
      handlePageChange(totalPages);
    }
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && typeof target.closest === 'function' && !target.closest('.filter-container') && isFilterOpen) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <section className="py-1 lg:pb-16 bg-transparent w-full blog-section">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter button and categories */}
        <div className="flex justify-end mb-6 filter-container relative">
          <motion.button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-purple-300 rounded-full shadow-sm hover:bg-purple-50 transition-colors text-purple-800 font-medium"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter by {selectedCategory}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </motion.button>

          {/* Filter dropdown */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden z-10 border border-gray-200"
              >
                <div className="py-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-purple-50 transition-colors ${selectedCategory === category ? 'bg-purple-100 text-purple-900 font-medium' : 'text-gray-700'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Blog cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              imageSrc={post.imageSrc}
              date={post.date}
              category={post.category}
              slug={post.slug}
              index={index}
            />
          ))}
        </div>

        {currentPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts found in this category.</p>
          </div>
        )}

        {/* Pagination UI */}
        {filteredPosts.length > POSTS_PER_PAGE && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center border-t border-b border-gray-200 py-4">
              {/* First page button */}
              <button
                onClick={handleFirstPage}
                disabled={currentPage === 1}
                className={`px-3 ${currentPage === 1 ? 'text-purple-300 cursor-not-allowed' : 'text-purple-500 hover:text-purple-700'} transition-colors`}
                aria-label="Go to first page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M8.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L4.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Previous page button */}
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className={`px-3 ${currentPage === 1 ? 'text-purple-300 cursor-not-allowed' : 'text-purple-500 hover:text-purple-700'} transition-colors flex items-center`}
                aria-label="Previous page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className={`${currentPage === 1 ? 'text-purple-300' : 'text-purple-500'}`}>Previous</span>
              </button>

              {/* Page number and total */}
              <div className="mx-4 px-4 flex items-center">
                <div className="border border-gray-300 rounded-md w-12 h-10 flex items-center justify-center font-semibold text-gray-800">
                  {currentPage}
                </div>
                <span className="hidden sm:block mx-2 text-gray-600">of {totalPages}</span>
              </div>

              {/* Next page button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 ${currentPage === totalPages ? 'text-purple-300 cursor-not-allowed' : 'text-purple-500 hover:text-purple-700'} transition-colors flex items-center`}
                aria-label="Next page"
              >
                <span className={`${currentPage === totalPages ? 'text-purple-300' : 'text-purple-500'}`}>Next</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>

              {/* Last page button */}
              <button
                onClick={handleLastPage}
                disabled={currentPage === totalPages}
                className={`px-3 ${currentPage === totalPages ? 'text-purple-300 cursor-not-allowed' : 'text-purple-500 hover:text-purple-700'} transition-colors`}
                aria-label="Go to last page"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M11.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L15.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </section >
  );
}
