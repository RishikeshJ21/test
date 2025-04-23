/* eslint-disable @typescript-eslint/no-unused-vars */
import { JSX, useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; // Make sure you have react-toastify installed
import "react-toastify/dist/ReactToastify.css"; // Import CSS for react-toastify
import { motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { handleRecaptchaError } from "../../lib/recaptchaUtils";
import { subscribeToNewsletter, unsubscribeFromNewsletter } from "../../utils/apiClient";
import TermsAndConditionsModal from "../TermsAndConditions/TermsAndConditionsModal";
import PrivacyPolicyModal from "../TermsAndConditions/PrivacyPolicyModal";

// Add type declaration at the top of the file
declare global {
  interface Window {
    grecaptcha: {
      reset: () => void;
    };
  }
}

// Get environment variables
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

// Debug info for environment variables (helps with troubleshooting)
console.log("Environment:", import.meta.env.MODE);
console.log("Using reCAPTCHA v2 'I'm not a robot' checkbox");
console.log("reCAPTCHA Site Key:", RECAPTCHA_SITE_KEY ? RECAPTCHA_SITE_KEY.substring(0, 8) + "..." : "undefined");

export const Footer = (): JSX.Element => {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(true); // Track whether captcha loaded successfully

 
  // Check local storage for subscription status on component mount
  useEffect(() => {
    const storedSubscription = localStorage.getItem('newsletter_subscription');
    if (storedSubscription) {
      try {
        const data = JSON.parse(storedSubscription);
        setIsSubscribed(true);
        setEmail(data.email);
        setUsername(data.username);
      } catch (e) {
        // Handle potential JSON parse error
        localStorage.removeItem('newsletter_subscription');
      }
    }
  }, []);

  // Listen for reCAPTCHA load errors from window
  useEffect(() => {
    const handleWindowRecaptchaError = () => {
      handleRecaptchaError(setError, setCaptchaLoaded);
    };

    // Listen for the custom event we set up in index.html
    window.addEventListener('recaptcha-load-error', handleWindowRecaptchaError);

    return () => {
      window.removeEventListener('recaptcha-load-error', handleWindowRecaptchaError);
    };
  }, []);

  const navigationLinks = {
    company: [
      { text: "Home", href: "/" },
      { text: "Contact", href: "mailto:createathon@persistventures.com" },
    ],
    resources: [
      { text: "Startup Accelerator", href: "https://persistventures.com/apply-to-accelerator" },
      { text: "Career Accelerator", href: "https://devscareeraccelerator.com/" },
      { text: "Investor Application", href: "https://persistventures.com/investor-application" },
    ],
    legal: [
      { text: "Terms & Conditions", href: "#", onClick: () => setIsTermsModalOpen(true) },
      { text: "Privacy Policy", href: "#", onClick: () => setIsPrivacyModalOpen(true) },
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!username) {
      setError("Please enter your name");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha verification");
      return;
    }

    setIsSubmitting(true);

    try {
      // Use centralized API client for newsletter subscription
      const result = await subscribeToNewsletter(email, username, captchaToken);

      if (result.success) {
        // Normal success case
        setSuccess("Successfully subscribed to newsletter!");

        // Reset form and update local storage
        setEmail("");
        setUsername("");
        setCaptchaToken(null);
        localStorage.setItem('newsletter_subscription', JSON.stringify({ email, username }));
        setIsSubscribed(true);
        setTimeout(() => setShowForm(false), 2000);
      } else {
        // Handle error
        setError(result.error || "Failed to subscribe. Please try again later.");

        // Reset reCAPTCHA on error
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again.");

      // Reset reCAPTCHA on error
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setCaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function for unsubscribing
  const handleUnsubscribe = async () => {
    if (!confirm("Are you sure you want to unsubscribe from our newsletter?")) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Use centralized API client for unsubscribe
      const result = await unsubscribeFromNewsletter(email);

      if (result.success) {
        // Remove subscription data from local storage
        localStorage.removeItem('newsletter_subscription');

        toast.success('You have successfully unsubscribed from our newsletter.', {
          position: "top-right",
          autoClose: 5000,
        });

        setIsSubscribed(false);
        setEmail("");
        setUsername("");
      } else {
        toast.error(`Unsubscribe failed: ${result.error || 'Please try again later'}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      toast.error('Failed to unsubscribe. Please check your connection and try again.', {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle captcha load error
  const handleCaptchaError = () => {
    handleRecaptchaError(setError, setCaptchaLoaded);
  };

  // Handle retrying captcha load
  const retryCaptcha = () => {
    setCaptchaLoaded(true);
    setError('');
    
    // The simplest and most reliable solution is to reload the page
    window.location.reload();
  };

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <footer id="Footer" className="w-full border-t border-gray-200">
        <div className="max-w-8xl mx-auto md:px-29 px-6 pt-12 pb-4 w-full">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <div className="flex">
                <div className="relative w-[180px] h-[36px]">
                  <img
                    className="absolute w-8 h-[36px] top-0 left-0"
                    alt="Logo icon"
                    src="/group.png"
                    width={36}
                    height={36}
                  />
                  <img
                    className="absolute w-[140px] h-[18px] top-2.5 left-[36px]"
                    alt="Logo text"
                    src="/group-1.png"
                    width={140}
                    height={18}
                  />
                </div>
              </div>
              <p className="text-gray-600 text-sm md:text-base leading-6 max-w-xs">
                We partner with entrepreneurs and businesses to help scale and
                grow their ideas. With a diverse team skilled in every sector.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="https://x.com/createathonn" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">X (Twitter)</span>
                  <svg className="h-6 w-6 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/creataethon" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6 sm:h-8 sm:w-8 mt-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/createathon._/" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.reddit.com/r/Creataethon/" className="text-gray-500 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">Reddit</span>
                  <svg className="h-6 w-6 sm:h-9 sm:w-9" fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
                    <path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32zM305.9 166.4c20.6 0 37.3-16.7 37.3-37.3s-16.7-37.3-37.3-37.3c-18 0-33.1 12.8-36.6 29.8c-30.2 3.2-53.8 28.8-53.8 59.9l0 .2c-32.8 1.4-62.8 10.7-86.6 25.5c-8.8-6.8-19.9-10.9-32-10.9c-28.9 0-52.3 23.4-52.3 52.3c0 21 12.3 39 30.1 47.4c1.7 60.7 67.9 109.6 149.3 109.6s147.6-48.9 149.3-109.7c17.7-8.4 29.9-26.4 29.9-47.3c0-28.9-23.4-52.3-52.3-52.3c-12 0-23 4-31.9 10.8c-24-14.9-54.3-24.2-87.5-25.4l0-.1c0-22.2 16.5-40.7 37.9-43.7l0 0c3.9 16.5 18.7 28.7 36.3 28.7zM155 248.1c14.6 0 25.8 15.4 25 34.4s-11.8 25.9-26.5 25.9s-27.5-7.7-26.6-26.7s13.5-33.5 28.1-33.5zm166.4 33.5c.9 19-12 26.7-26.6 26.7s-25.6-6.9-26.5-25.9c-.9-19 10.3-34.4 25-34.4s27.3 14.6 28.1 33.5zm-42.1 49.6c-9 21.5-30.3 36.7-55.1 36.7s-46.1-15.1-55.1-36.7c-1.1-2.6 .7-5.4 3.4-5.7c16.1-1.6 33.5-2.5 51.7-2.5s35.6 .9 51.7 2.5c2.7 .3 4.5 3.1 3.4 5.7z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-8 xl:mt-0 xl:col-span-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigationLinks.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-base text-gray-600 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Resources
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigationLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="text-base text-gray-600 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-3">
                  {navigationLinks.legal.map((link, index) => (
                    <li key={index}>
                      {link.onClick ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // Prevent default link behavior if href is '#'
                            link.onClick?.(); // Use optional chaining
                          }}
                          className="text-base text-gray-600 hover:text-purple-600 text-left"
                        >
                          {link.text}
                        </button>
                      ) : (
                        <a href={link.href} className="text-base text-gray-600 hover:text-purple-600" target="_blank" rel="noopener noreferrer">
                          {link.text}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <a href="https://dia.wiki/" className="text-purple-600 hover:text-purple-500 text-base font-medium" target="_blank" rel="noopener noreferrer">
                    Decentralized Intelligence Agency
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="md:flex md:items-center md:justify-between">
              <div className="mt-2 md:mt-0">
                <p className="text-sm text-gray-500">
                  &copy; 2025 createathon.co. All rights reserved.
                </p>
              </div>

              <div className="mt-4 md:mt-0">
                <div className="rounded-md bg-purple-50 px-4 py-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                      <p className="text-sm text-purple-700">
                        {isSubscribed ? (
                          <>
                            You're subscribed to our newsletter.
                            <button
                              onClick={handleUnsubscribe}
                              className="font-medium text-purple-700 underline ml-2"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? 'Processing...' : 'Unsubscribe'}
                            </button>
                          </>
                        ) : (
                          <>
                            Want to stay updated?
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); setShowForm(true); }}
                              className="font-medium text-purple-700 underline ml-2"
                            >
                              Subscribe to our newsletter
                            </a>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Newsletter popup form */}
                {showForm && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Subscribe to our newsletter</h3>
                        <button
                          onClick={() => setShowForm(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      <p className="text-sm text-gray-500 mb-4">
                        Join our newsletter to receive updates on our latest projects, events, and opportunities.
                      </p>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                          </label>
                          <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                          />
                        </div>

                        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                        {success && <p className="text-green-500 text-sm mt-1">{success}</p>}

                        <div className="flex justify-center transform scale-90 sm:scale-100 origin-top">
                          {captchaLoaded ? (
                            <ReCAPTCHA
                              sitekey={RECAPTCHA_SITE_KEY}
                              onChange={(token: string | null) => {
                                console.log('reCAPTCHA token received:', token ? 'valid' : 'invalid');
                                setCaptchaToken(token);
                                if (token) {
                                  setError(''); // Clear any previous errors when captcha is completed
                                }
                              }}
                              onErrored={() => {
                                handleCaptchaError();
                              }}
                              onExpired={() => {
                                console.log('reCAPTCHA expired');
                                setCaptchaToken(null);
                              }}
                              theme="light"
                              size="normal"
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-3 p-4 border border-red-200 rounded-md bg-red-50">
                              <p className="text-red-600 text-sm">Captcha failed to load.</p>
                              <button 
                                onClick={retryCaptcha}
                                className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                              >
                                Retry Captcha
                              </button>
                            </div>
                          )}
                        </div>

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </motion.button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
