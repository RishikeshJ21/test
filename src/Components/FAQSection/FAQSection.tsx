import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { faqItems } from "../../data/FAQData";
import { ChevronDownIcon, Mail, MinusCircle, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { handleRecaptchaError } from "../../lib/recaptchaUtils";
import { submitContactForm } from "../../utils/apiClient";

// Add type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      reset: () => void;
    };
  }
}

// Get environment variables
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

export const FAQSection = (): JSX.Element => {
  const [openItem, setOpenItem] = useState<string | null>("");
  const [showContactForm, setShowContactForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaLoaded, setCaptchaLoaded] = useState(true); // Track whether captcha loaded successfully
  const [captchaError, setCaptchaError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    message: ""
  });

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

    // Validate form
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
      // Use the centralized API client to handle the request
      const result = await submitContactForm(formData, captchaToken);

      if (result.success) {
        // Normal success case
        setSuccess("Message sent successfully!");

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          message: ""
        });
        setCaptchaToken(null);
        setTimeout(() => setShowContactForm(false), 2000);
      } else {
        // Handle error
        setError(result.error || "Failed to send message. Please try again later.");

        // Reset reCAPTCHA on error
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
        setCaptchaToken(null);
      }
    } catch (error) {
      console.error('Contact form error:', error);
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

  const handleAccordionChange = (value: string) => {
    if (value === openItem) {
      setOpenItem(null);
    } else {
      setOpenItem(value);
    }
  };

  // Handle captcha load error
  const handleCaptchaError = () => {
    handleRecaptchaError(setError, setCaptchaLoaded);
    setCaptchaError('Error loading captcha. Please refresh and try again.');
  };

  // Handle retrying captcha load
  const retryCaptcha = () => {
    setCaptchaLoaded(true);
    setError('');
    setCaptchaError(null);

    // The simplest and most reliable solution is to reload the page
    window.location.reload();
  };

  return (
    <section id="FAQs" className="w-full overflow-hidden ">
      <div className={`max-w-8xl   mx-auto px-2 md:px-3   md:py-10 w-full`}>
        {/* Header - Same structure as TrustByCreatorSection */}
        <div className="mb-1 md:mb-8 3xl:pl-2">
          <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
            Frequently Asked  <span className=" bg-clip-text text-[#4e1f88] ">Questions</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-full text-lg">
            Everything you need to know about Createathon
          </p>
        </div>

        {/* FAQ Grid */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-8 md:mt-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {faqItems.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white overflow-hidden rounded-xl"
            >
              <div
                className={`w-full transition-all duration-200 ${openItem === `faq-${index}`
                  ? 'ring-1 ring-purple-300 shadow-md'
                  : 'ring-1 ring-gray-200 hover:ring-gray-300'
                  }`}
                style={{ borderRadius: "0.75rem" }}
              >
                <div className="border-none">
                  <button
                    onClick={() => handleAccordionChange(`faq-${index}`)}
                    className={`px-6 py-5 hover:no-underline focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-inset w-full text-left transition-colors duration-200 ${openItem === `faq-${index}`
                      ? 'bg-purple-50/30'
                      : 'hover:bg-gray-50'
                      }`}
                    style={{
                      borderTopLeftRadius: "0.75rem",
                      borderTopRightRadius: "0.75rem",
                      borderBottomLeftRadius: openItem === `faq-${index}` ? "0" : "0.75rem",
                      borderBottomRightRadius: openItem === `faq-${index}` ? "0" : "0.75rem"
                    }}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600 font-medium">
                        {index + 1}
                      </div>
                      <span className="font-['Instrument_Sans',Helvetica] font-medium text-gray-900 text-lg sm:text-xl leading-tight text-left">
                        {faq.question}
                      </span>
                      <div className="hidden md:block">
                        {faq.defaultOpen && (
                          <span className="ml-auto mr-6 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full whitespace-nowrap">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="ml-auto flex-shrink-0">
                        {openItem === `faq-${index}` ? (
                          <MinusCircle className="h-5 w-5 text-purple-600 shrink-0" />
                        ) : (
                          <ChevronDownIcon
                            className="h-5 w-5 text-purple-600 transition-transform duration-200"
                          />
                        )}
                      </div>
                    </div>
                  </button>

                  {openItem === `faq-${index}` && (
                    <motion.div
                      className="px-6 pb-6"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="pl-14">
                        <div className="h-px bg-gray-200 my-4" />
                        <p className="font-['Instrument_Sans',Helvetica] text-gray-700 text-base leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                          <span className="text-sm text-gray-500">Was this helpful?</span>
                          <button
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            aria-label="Yes, this was helpful"
                          >
                            👍
                          </button>
                          <button
                            className="p-1.5 rounded-full hover:bg-gray-100"
                            aria-label="No, this was not helpful"
                          >
                            👎
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>


        <div className="mt-5 relative max-w-8xl mx-auto lg:px-1 sm:px-12 md:px-2 px-4">
          <div className="absolute inset-0 bg-transparent rounded-3xl transform -rotate-1 scale-[1.03] blur-[20px] -z-10"></div>
          <div className="bg-gray-100 rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="col-span-1 lg:col-span-8 p-6 lg:p-8">
                <div className="max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                    Couldn't find what you're looking for?
                  </h3>
                  <p className="mt-2 text-gray-600 text-base md:text-lg">
                    Our team of experts is ready to answer your questions and help you get started.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-lg hover:shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                    >
                      <Mail className="h-4 w-4" />
                      Contact Support
                    </button>

                    <a href="#FAQs" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                      Browse all FAQs
                    </a>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-4 bg-gradient-to-br from-purple-500 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-24 h-24 rounded-full bg-white"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute top-2/3 left-1/2 w-16 h-16 rounded-full bg-white"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-4">
                    <div className="text-4xl md:text-5xl font-bold mb-1">24/7</div>
                    <div className="text-lg font-medium">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showContactForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Contact Us</h3>
              <button
                onClick={() => setShowContactForm(false)}
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
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}

              <div className="flex justify-center transform scale-90 sm:scale-100 origin-top">
                {captchaLoaded ? (
                  <ReCAPTCHA
                    sitekey={RECAPTCHA_SITE_KEY}
                    onChange={(token: string | null) => {
                      console.log('reCAPTCHA token received:', token ? 'valid' : 'invalid');
                      setCaptchaToken(token);
                      if (token) {
                        setError(''); // Clear any previous errors when captcha is completed
                        setCaptchaError(null);
                      }
                    }}
                    onErrored={() => {
                      handleCaptchaError();
                    }}
                    onExpired={() => {
                      console.log('reCAPTCHA expired');
                      setCaptchaToken(null);
                      setCaptchaError('reCAPTCHA expired. Please verify again.');
                    }}
                    theme="light"
                    size="normal"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 p-4 border border-red-200 rounded-md bg-red-50">
                    <p className="text-red-600 text-sm">Captcha failed to load.</p>
                    <button
                      type="button"
                      onClick={retryCaptcha}
                      className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Retry Captcha
                    </button>
                  </div>
                )}
              </div>

              {captchaError && (
                <p className="text-red-500 text-sm text-center mt-2">{captchaError}</p>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Mail className="h-4 w-4" />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
















{/* 
       
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg relative overflow-hidden">
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
      </div> */}

{/* Contact Form Modal */ }



{/* Contact CTA with updated onClick */ }
{/* <div className="mt-12 relative">
          <div className="absolute inset-0 bg-transparent rounded-3xl transform -rotate-1 scale-[1.03] blur-[20px] -z-10"></div>
          <div className="bg-gray-100 rounded-3xl shadow-xl border border-purple-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">

              <div className="col-span-1 lg:col-span-8 p-8 lg:p-12">
                <div className="max-w-2xl">
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
                    Couldn't find what you're looking for?
                  </h3>
                  <p className="mt-4 text-gray-600 text-lg">
                    Our team of experts is ready to answer your questions and help you get started with Createathon.
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowContactForm(true)}
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                    >
                      <Mail className="h-5 w-5" />
                      Contact Support
                    </button>

                    <a href="#FAQs" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300">
                      Browse all FAQs
                    </a>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block lg:col-span-4 bg-gradient-to-br from-purple-500 to-blue-500 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full bg-white"></div>
                  <div className="absolute top-2/3 left-1/2 w-24 h-24 rounded-full bg-white"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center p-8">
                    <div className="text-6xl font-bold mb-2">24/7</div>
                    <div className="text-xl font-medium">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}