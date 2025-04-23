import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { NavigationSection } from '../../Components/NavigationSection/NavigationSection';
import BlogSection from '../../SubComponents/BlogSection';
import { Footer } from '../../Components/Footer/Footer';
import Hero from '../../Components/Hero';
import { Mail, X } from 'lucide-react';
import ReCAPTCHA from "react-google-recaptcha";
import { submitContactForm } from "../../utils/apiClient";
import BlogCard from "../../SubComponents/BlogCard";
import { fetchBlogs, BlogAPIResponse } from "../../SubComponents/blogs/api";
import Loader from "../../SubComponents/Loader";

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
  const lastScrollY = useRef(0);

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
  const [loading, setLoading] = useState(true);

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
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        <motion.section className="relative px-4 md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff] py-16 md:py-16"
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
            }}
          />
          <motion.div
            className="absolute w-[600px] h-[300px] rounded-full bg-purple-300/70 blur-[100px]"
            style={{
              left: 'calc(4/7 * 100%)',
              bottom: 'calc(3/8 * 100%)',
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
            <div className="mb-12 text-center">
              <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
                <span className="text-black">The Createathon Blog</span>
              </h2>
            </div>

            <p className="max-w-3xl text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10">
              Explore expert insights, creator tips, content strategies, industry trends and success stories designed to fuel your growth.
            </p>
          </div>
          
        </motion.section>

        <div
          id="blog-content"
          className={`bg-gradient-to-b from-[#f8f5ff] to-purple-10 sm:max-w-[98%] max-w-[99%] ${window.innerWidth < 1600 ? "lg:max-w-[97%]" : "lg:max-w-[94%] "} mx-auto px-4 sm:px-6 lg:px-16`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Blog Listing */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <Loader />
                </div>
              ) : blogs.length > 0 ? (
                blogs.map((blog, index) => (
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
            {!loading && !error && blogs.length === 0 && (
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