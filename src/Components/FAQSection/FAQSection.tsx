import { JSX, useState } from "react";
import { motion } from "framer-motion";
import { faqItems } from "../../data/FAQData";
import { ChevronDownIcon, Mail, MinusCircle, X } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";

// Add type declaration for grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      reset: () => void;
    };
  }
}

// Get environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EMAIL_ENDPOINT = import.meta.env.VITE_EMAIL_ENDPOINT;
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY?.trim() || "6LcdGRgrAAAAAIU-zzCAQN2GrwPnqS6mrVtjUb6v";

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

    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setError("Please fill in all fields");
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha verification");
      return;
    }

    setIsSubmitting(true);

    try {
      const emailPayload = {
        subject: "Contact Form Submission",
        message: `First Name: ${formData.firstName}\nLast Name: ${formData.lastName}\nMessage: ${formData.message}`,
        to_email: formData.email,
        captcha_response: captchaToken
      };

      const response = await fetch(`${API_BASE_URL}${EMAIL_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailPayload)
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message) {
          throw new Error(data.message);
        } else if (response.status === 422) {
          throw new Error("Invalid input or captcha verification failed. Please try again.");
        } else {
          throw new Error("Failed to send message. Please try again.");
        }
      }

      setSuccess("Message sent successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
      });
      setCaptchaToken(null);
      setTimeout(() => setShowContactForm(false), 2000);

    } catch (error) {
      console.error('Contact form error:', error);
      setError(error instanceof Error ? error.message : "Failed to send message. Please try again.");

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

  return (
    <section id="FAQs" className="w-full overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 md:px-27 3xl:px-29 3xl:pl-20 md:py-10 w-full">
        {/* Header - Same structure as TrustByCreatorSection */}
        <div className="mb-1 md:mb-8 3xl:pl-28">
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

        {/* Contact CTA with updated onClick */}
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
      </div>

      {/* Contact Form Modal */}
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
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token: string | null) => {
                    console.log('reCAPTCHA token received:', token ? 'valid' : 'invalid');
                    setCaptchaToken(token);
                  }}
                  onErrored={() => {
                    console.error('reCAPTCHA error occurred');
                    setError('Error loading captcha. Please refresh and try again.');
                  }}
                  onExpired={() => {
                    console.log('reCAPTCHA expired');
                    setCaptchaToken(null);
                  }}
                  theme="light"
                  size="normal"
                />
              </div>

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
