import { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationSection } from '../../Components/NavigationSection/NavigationSection';
import BlogSection from '../../SubComponents/BlogSection';
import { Footer } from '../../Components/Footer/Footer';
import Hero from '../../Components/Hero';
import { Mail, X, Calendar } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../utils/apiClient";
import BlogCard from "../../SubComponents/BlogCard";
import { fetchBlogs, BlogAPIResponse } from "../../SubComponents/blogs/api";
import Loader from "../../SubComponents/Loader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

declare global {
  interface Window {
    grecaptcha: {
      reset: () => void;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

export default function BlogPage() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const lastScrollY = useRef(0);
  const filterRef = useRef<HTMLDivElement>(null);
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [showRecentOnly, setShowRecentOnly] = useState(false);

  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

  const [blogs, setBlogs] = useState<BlogAPIResponse[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogAPIResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Get unique categories from blogs
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    blogs.forEach(blog => {
      if (blog.category) {
        uniqueCategories.add(blog.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [blogs]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth < 768) {
        setShowNavbar(currentScrollY <= lastScrollY.current || currentScrollY <= 100);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        const data = await fetchBlogs();
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  // Filter blogs based on search query, selected categories, and date filters
  useEffect(() => {
    if (blogs.length === 0) return;
    
    let result = [...blogs];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        blog.excerpt.toLowerCase().includes(query) ||
        blog.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      result = result.filter(blog => 
        selectedCategories.includes(blog.category)
      );
    }
    
    // Filter by date range
    if (fromDate) {
      result = result.filter(blog => new Date(blog.date) >= fromDate);
    }
    
    if (toDate) {
      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      result = result.filter(blog => new Date(blog.date) <= endDate);
    }
    
    // Filter for recent blogs (last 5 days)
    if (showRecentOnly) {
      const fiveDaysAgo = new Date();
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      result = result.filter(blog => new Date(blog.date) >= fiveDaysAgo);
    }
    
    setFilteredBlogs(result);
  }, [blogs, searchQuery, selectedCategories, fromDate, toDate, showRecentOnly]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    } else {
      setSelectedCategories(prev => [...prev, category]);
    }
  };
  
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setCaptchaError(null);

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      return;
    }

    if (!captchaToken) {
      setCaptchaError("Please complete the captcha verification");
      setError("Please complete the captcha verification");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactForm(formData, captchaToken);

      if (result.success) {
        setSuccess("Message sent successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: ""
        });
        setCaptchaToken(null);
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setTimeout(() => {
          setShowContactForm(false);
          setSuccess("");
        }, 2000);
      } else {
        setError(result.error || "Failed to send message. Please try again later.");
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <>
      <Helmet>
        <title>Blog - Stay Inspired & Ahead | Your Company Name</title>
        <meta
          name="description"
          content="Explore expert insights, creator tips, content strategies, industry trends, and success stories designed to fuel your growth. Stay inspired and ahead with our blog."
        />
        <meta
          name="keywords"
          content="creator tips, content strategy, industry trends, monetization hacks, success stories, blog, insights"
        />
      </Helmet>

      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 md:bg-transparent md:backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'
          }`}
        initial={{ y: '-100%' }}
        animate={{ y: showNavbar ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <NavigationSection
          navItems={[
            { title: 'Blog', href: '#', active: true, offset: 0 },
            { title: 'Home', href: '/', active: false, offset: 0 },
            { title: 'Join Us', href: '#CTA', active: false, offset: -10 },
          ]}
        />
      </motion.div>

      <div className="pt-16 lg:pt-10">
        <motion.section className="relative px-4  md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff] py-6 md:py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Blobs for background effect */}
          <motion.div
            className="absolute w-[300px] h-[400px] rounded-full bg-orange-200/40 blur-[150px]"
            style={{
              left: '50%',
              bottom: '30px',
              transform: 'translateX(-50%)'
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[300px] rounded-full bg-purple-300/70 blur-[100px]"
            style={{
              left: '50%',
              bottom: 'calc(3/8 * 100%)',
              transform: 'translateX(-50%)'
            }}
          />

          {/* Main content */}
          <div className="relative max-w-9xl mx-auto flex flex-col items-center text-center w-full z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl mt-18">
              <div className="whitespace-nowrap">
                <span className="text-black">Stay </span>
                <span className="text-[#4e1f88]">Inspired, </span>
                <span className="text-black">Stay </span>
                <span className="text-[#4e1f88]">Ahead</span>
              </div>
            </h1>
            <div className="mb-1 text-center">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
                <span className="text-black">The Createathon Blog</span>
              </h2>
            </div>

            <p className="max-w-3xl text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10">
              Explore expert insights, creator tips, content strategies, industry trends and success stories designed to fuel your growth.
            </p>

            {/* Search Bar */}
            <div className="w-full max-w-3xl mx-auto mb-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search Blogs"
                  className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-900"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Category Tags and Filter */}
            <div className="w-full max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-4 mb-0">
              <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
                {categories.map(category => (
                  <button 
                    key={category}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      selectedCategories.includes(category) 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                    }`}
                    onClick={() => handleCategoryToggle(category)}
                  >
                    {category}
                  </button>
                ))}
                
                {selectedCategories.length > 0 && (
                  <button 
                    className="inline-flex items-center px-3 py-2 rounded-full text-xs font-medium bg-gray-200 text-gray-700 hover:bg-gray-300"
                    onClick={() => setSelectedCategories([])}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
            
            {/* Filter information */}
            {/* {selectedCategories.length > 0 && (
              <div className="w-full max-w-3xl mx-auto -mt-6 mb-8">
                <p className="text-sm text-gray-600">
                  Showing results for: {selectedCategories.join(', ')}
                </p>
              </div>
            )} */}
          </div>
          
        </motion.section>

        <div
          id="blog-content"
          className={`bg-gradient-to-b from-[#f8f5ff] to-purple-10 sm:max-w-[98%] max-w-[99%] ${window.innerWidth < 1600 ? "lg:max-w-[97%]" : "lg:max-w-[94%] "} mx-auto px-4 sm:px-6 lg:px-16 relative pt-1`}
        >
          {/* Container for filter button and panel - align with blog cards */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative">
            {/* More Filters button */}
            <div className="flex justify-end relative z-20">
              <button 
                className="inline-flex items-center px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium relative z-30"
                onClick={() => setShowFilters(!showFilters)}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 4.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 9.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 14.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 19.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                More Filters
              </button>
            </div>
            
            {/* Filter dropdown panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  ref={filterRef}
                  className="absolute right-4 sm:right-6 lg:right-8 top-14 w-[500px] max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className="p-4 sm:p-5">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Refine Search</h2>
                    
                    {/* Two column layout for filter options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left column - Categories */}
                      <div>
                        <h3 className="text-base font-medium text-gray-700 mb-2">Blog Categories</h3>
                        {/* Recently added option */}
                        <div className="mt-2">
                          <label className="flex items-center">
                            <input 
                              type="checkbox" 
                              className="rounded w-4 h-4 text-purple-600 focus:ring-purple-500"
                              checked={showRecentOnly}
                              onChange={() => setShowRecentOnly(!showRecentOnly)}
                            />
                            <span className="ml-2 text-sm text-gray-700 py-2">Show recent blogs</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {categories.map(category => (
                            <label key={category} className="flex items-center">
                              <input 
                                type="checkbox" 
                                className="rounded w-4 h-4 text-purple-600 focus:ring-purple-500"
                                checked={selectedCategories.includes(category)}
                                onChange={() => handleCategoryToggle(category)}
                              />
                              <span className="ml-2 text-sm text-gray-700">{category}</span>
                            </label>
                          ))}
                        </div>
                        
                        
                      </div>
                      
                      {/* Divider for desktop view */}
                      <div className="hidden md:block absolute left-1/2 top-[72px] bottom-5 w-px bg-gray-200"></div>
                      
                      {/* Divider for mobile view */}
                      <div className="md:hidden h-px w-full bg-gray-200 my-3"></div>
                      
                      {/* Right column - Date Range */}
                      <div className="px-4">
                        <h3 className="text-base font-medium text-gray-700 mb-2 ">Date Range</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">From</label>
                            <div className="relative">
                              <DatePicker 
                                selected={fromDate}
                                onChange={(date: Date | null) => setFromDate(date)}
                                placeholderText="dd/mm/yyyy"
                                dateFormat="dd/MM/yyyy"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8 text-black text-sm"
                                calendarClassName="bg-white rounded-lg shadow-lg border border-gray-200"
                                dayClassName={(date: Date) => 
                                  date.getDate() === new Date().getDate() && 
                                  date.getMonth() === new Date().getMonth() &&
                                  date.getFullYear() === new Date().getFullYear()
                                    ? "bg-purple-500 text-white rounded-full"
                                    : "text-gray-700 hover:bg-purple-100 rounded-full"
                                }
                                popperClassName="react-datepicker-right"
                                popperPlacement="bottom-end"
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                <Calendar className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">To</label>
                            <div className="relative">
                              <DatePicker 
                                selected={toDate}
                                onChange={(date: Date | null) => setToDate(date)}
                                placeholderText="dd/mm/yyyy"
                                dateFormat="dd/MM/yyyy"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8 text-black text-sm"
                                calendarClassName="bg-white rounded-lg shadow-lg border border-gray-200"
                                dayClassName={(date: Date) => 
                                  date.getDate() === new Date().getDate() && 
                                  date.getMonth() === new Date().getMonth() &&
                                  date.getFullYear() === new Date().getFullYear()
                                    ? "bg-purple-500 text-white rounded-full"
                                    : "text-gray-700 hover:bg-purple-100 rounded-full"
                                }
                                popperClassName="react-datepicker-right"
                                popperPlacement="bottom-end"
                                minDate={fromDate || undefined}
                              />
                              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none">
                                <Calendar className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Blog Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader />
                </div>
              ) : filteredBlogs.length > 0 ? (
                filteredBlogs.map((blog, index) => (
                  <BlogCard
                    key={blog.id}
                    title={blog.title}
                    excerpt={blog.excerpt}
                    imageSrc={blog.image}
                    date={formatDate(blog.date)}
                    slug={blog.slug}
                    category={blog.category}
                    index={index}
                    author={{
                      name: "Blog Author",
                      image: "/testimonial/1.webp"
                    }}
                  />
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-gray-500">No blog posts available at the moment. Please check back later.</p>
                </div>
              )}
            </div>

            {/* If there are no blogs and not loading/error */}
            {!loading && !error && filteredBlogs.length === 0 && (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No blog posts found</h2>
                <p className="text-gray-600">Check back soon for new content!</p>
              </div>
            )}
          </div>
        </div>

        <div id="CTA" className={`scroll-mt-16 px-4 sm:px-6 lg:px-8 sm:max-w-[98%] max-w-[97%] ${window.innerWidth < 1600 ? "lg:max-w-[88%]" : "lg:max-w-[94%] "} mx-auto  `}>
          <div className="mt-0 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500 opacity-15 rounded-full transform -translate-x-1/3 translate-y-1/3" />
            <div className="text-center sm:text-left relative z-10">
              <h3 className="text-white text-2xl font-bold mb-3">Still have questions?</h3>
              <p className="text-gray-300 text-lg">
                We're here to help you with any questions you might have
              </p>
            </div>
            <button
              onClick={() => setShowContactForm(true)}
              className="relative z-10 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </button>
          </div>
        </div>

        {showContactForm && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
                <button
                  onClick={() => {
                    setShowContactForm(false);
                    if (!success) {
                      setError("");
                      setSuccess("");
                      setCaptchaError(null);
                      setFormData({ firstName: "", lastName: "", email: "", message: "" });
                      setCaptchaToken(null);
                      if (window.grecaptcha) window.grecaptcha.reset();
                    }
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 resize-none"
                    placeholder="Your message here..."
                    required
                  />
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <div className="flex justify-center transform scale-90 sm:scale-100 origin-top">
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token: string | null) => {
                      setCaptchaToken(token);
                      setCaptchaError(null);
                      if (token) setError("");
                    }}
                    onErrored={() => {
                      setCaptchaError('Error loading captcha. Please refresh and try again.');
                      setError('Error loading captcha. Please refresh and try again.');
                    }}
                    onExpired={() => {
                      setCaptchaToken(null);
                      setCaptchaError('reCAPTCHA expired. Please verify again.');
                      setError('reCAPTCHA expired. Please verify again.');
                    }}
                    theme="light"
                    size="normal"
                  />
                </div>

                {captchaError && !error && (
                  <p className="text-red-500 text-sm text-center mt-2">{captchaError}</p>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !!success}
                  whileHover={{ scale: !isSubmitting && !success ? 1.02 : 1 }}
                  whileTap={{ scale: !isSubmitting && !success ? 0.98 : 1 }}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 ${isSubmitting || success ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
                >
                  <Mail className="h-4 w-4" />
                  {isSubmitting ? 'Sending...' : success ? 'Sent!' : 'Send Message'}
                </motion.button>
              </form>
            </div>
          </div>
        )}

        <div className={`${window.innerWidth < 1750 ? "ml-4" : "ml-15"} mt-10`}>
          <Footer />
        </div>
      </div>
    </>
  );
}