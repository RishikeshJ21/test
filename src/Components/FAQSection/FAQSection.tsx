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
      <div className="max-w-8xl mx-auto md:px-27 px-6 md:py-10 w-full">
        {/* Header - Same structure as TrustByCreatorSection */}
        <div className="mb-1 md:mb-8">
          <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Questions</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-full text-lg">
            Everything you need to know about Createathon
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-8 md:mt-4">
          {faqItems.map((faq, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl ${
                openItem === `faq-${index}`
                  ? 'border border-purple-300 shadow-md'
                  : 'border border-gray-200'
              }`}
            >
              <div className="w-full">
                <div className="border-none">
                  <button 
                    onClick={() => handleAccordionChange(`faq-${index}`)}
                    className={`px-6 py-5 hover:no-underline focus:outline-none rounded-t-xl w-full text-left transition-colors duration-200 ${
                      openItem === `faq-${index}` ? 'bg-purple-50/30' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600">
                        {index + 1}
                      </div>
                      <span className="font-['Instrument_Sans',Helvetica] font-medium text-gray-900 text-lg sm:text-xl leading-tight text-left">
                        {faq.question}
                      </span>
                      {faq.defaultOpen && (
                        <span className="ml-auto mr-6 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full whitespace-nowrap">
                          Popular
                        </span>
                      )}
                      {openItem === `faq-${index}` ? (
                        <MinusCircle className="h-5 w-5 text-purple-600 shrink-0" />
                      ) : (
                        <ChevronDownIcon
                          className="h-5 w-5 text-purple-600 transition-transform duration-200"
                        />
                      )}
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
            </div>
          ))}
        </div>

        {/* Contact CTA with updated onClick */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2" />
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











// import { JSX, useState } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../SubComponents/accordion";
// import { faqItems } from "../../data/FAQData";
// import { ChevronDownIcon } from "lucide-react";

// export const FAQSection = (): JSX.Element => {
//   // Set first FAQ open by default
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
//     'item-0': true
//   });

//   // Handle accordion state
//   const handleAccordionChange = (value: string, index: number) => {
//     setExpandedItems(prev => {
//       const newState = { ...prev };
//       // Close all other items
//       Object.keys(newState).forEach(key => {
//         newState[key] = false;
//       });
//       // Toggle the clicked item
//       newState[`item-${index}`] = value === `item-${index}`;
//       return newState;
//     });
//   };

//   return (
//     <section id="#FAQs" className="w-full overflow-hidden">
//       <div className="max-w-8xl mx-auto md:px-29 px-6 md:py-10 w-full">
//         {/* Header - Same structure as TrustByCreatorSection */}
//         <div className="mb-1 md:mb-8">
//           <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
//             Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Questions</span>
//             <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
//           </h2>
//           <p className="mt-4 text-gray-600 max-w-full text-lg">
//             Everything you need to know about Createathon
//           </p>
//         </div>

//         {/* FAQ Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6 mt-8 md:mt-4">
//           {faqItems.map((item, index) => (
//             <div
//               key={`faq-${index}`}
//               className={`bg-white rounded-xl ${
//                 expandedItems[`item-${index}`]
//                   ? 'border border-purple-300'
//                   : 'border border-gray-200'
//               }`}
//             >
//               <Accordion
//                 type="single"
//                 collapsible
//                 className="w-full"
//                 value={expandedItems[`item-${index}`] ? `item-${index}` : undefined}
//                 onValueChange={(value) => handleAccordionChange(value, index)}
//               >
//                 <AccordionItem value={`item-${index}`} className="border-none">
//                   <AccordionTrigger 
//                     className="px-6 py-5 hover:no-underline focus:outline-none rounded-t-xl"
//                   >
//                     <div className="flex items-center gap-4 w-full">
//                       <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600">
//                         {index + 1}
//                       </div>
//                       <span className="font-['Instrument_Sans',Helvetica] font-medium text-gray-900 text-lg sm:text-xl leading-tight text-left">
//                         {item.question}
//                       </span>
//                       {item.defaultOpen && (
//                         <span className="ml-auto mr-6 px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full whitespace-nowrap">
//                           Popular
//                         </span>
//                       )}
//                       <ChevronDownIcon
//                         className={`h-5 w-5 text-purple-600 transition-transform duration-200 ${
//                           expandedItems[`item-${index}`] ? 'rotate-180' : ''
//                         }`}
//                       />
//                     </div>
//                   </AccordionTrigger>

//                   <AccordionContent className="px-6 pb-6">
//                     <div className="pl-14">
//                       <div className="h-px bg-gray-200 my-4" />
//                       <p className="font-['Instrument_Sans',Helvetica] text-gray-700 text-base leading-relaxed">
//                         {item.answer}
//                       </p>
//                       <div className="mt-4 flex items-center gap-2">
//                         <span className="text-sm text-gray-500">Was this helpful?</span>
//                         <button 
//                           className="p-1.5 rounded-full hover:bg-gray-100" 
//                           aria-label="Yes, this was helpful"
//                         >
//                           👍
//                         </button>
//                         <button 
//                           className="p-1.5 rounded-full hover:bg-gray-100" 
//                           aria-label="No, this was not helpful"
//                         >
//                           👎
//                         </button>
//                       </div>
//                     </div>
//                   </AccordionContent>
//                 </AccordionItem>
//               </Accordion>
//             </div>
//           ))}
//         </div>

//         {/* Contact CTA */}
//         <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2" />
//           <div className="text-center sm:text-left relative z-10">
//             <h3 className="text-white text-2xl font-bold mb-3">Still have questions?</h3>
//             <p className="text-gray-300 text-lg">
//               We're here to help you with any questions you might have
//             </p>
//           </div>
//           <a
//             href="#contact"
//             className="relative z-10 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-400 text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-all duration-200 hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900"
//           >
//             Contact Us
//           </a>
//         </div>

//         {/* Back to top button */}
//         <div className="flex justify-center mt-10">
//           <button
//             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
//             className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 transition-colors"
//             aria-label="Scroll to top"
//           >
//             <ChevronDownIcon className="h-4 w-4 transform rotate-180" />
//             Back to top
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };


















// "use client";

// import  { JSX } from "react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "../../SubComponents/accordion";
// import { faqItems } from "../../data/FAQData";
 
 

// export const FAQSection = (): JSX.Element => {
//   return (
//     <section className="flex flex-col gap-6 sm:gap-8 py-10 sm:py-12 md:py-10 w-full max-w-[94%] md:max-w-[88%] mx-auto px-4 sm:px-6 md:px-8">
//       {/* Heading - Full width on small screens */}
//       <div className="flex w-full max-w-[90%]">
//         <h2 className="font-['Instrument_Sans',Helvetica] font-semibold text-black text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight sm:leading-snug md:leading-[84px]">
//           Frequently Asked Questions
//         </h2>
//       </div>

//       {/* FAQ content - Always use accordion */}
//       <div className="w-full">
//         <div className="flex flex-col w-full gap-4">
//           <Accordion type="single" collapsible>
//             {faqItems.map((item, index) => (
//               <AccordionItem
//                 key={`item-${index}`}
//                 value={`item-${index}`}
//                 className="bg-white rounded-xl border border-solid border-[#22222240] mb-3 sm:mb-4 overflow-hidden"
//               >
//                 <AccordionTrigger className="px-4 sm:px-6 py-4 sm:py-6 hover:no-underline">
//                   <span className="font-['Instrument_Sans',Helvetica] font-medium text-black text-lg sm:text-xl md:text-2xl leading-tight sm:leading-[30px] text-left">
//                     {item.question}
//                   </span>
//                 </AccordionTrigger>

//                 <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-6">
//                   <hr className="my-4 border-t border-gray-300" />
//                   <p className="font-['Instrument_Sans',Helvetica] font-medium text-[#222222] text-sm sm:text-base leading-relaxed sm:leading-6">
//                     {item.answer}
//                   </p>
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         </div>
//       </div>
//     </section>
//   );
// };
