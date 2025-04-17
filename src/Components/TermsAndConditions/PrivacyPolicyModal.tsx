import { useState, useEffect, useRef } from 'react';
import privacyPolicy from '../../data/privacypolicy';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal = ({ isOpen, onClose }: PrivacyPolicyModalProps) => {
  const [activeSection, setActiveSection] = useState<string>(privacyPolicy.content[0]);
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling on the body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Scroll to section when activeSection changes (desktop only)
  useEffect(() => {
    if (!isMobile && activeSection && contentRef.current && sectionRefs.current[activeSection]) {
      const sectionElement = sectionRefs.current[activeSection];
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [activeSection, isMobile]);

  // When section changes on mobile, auto-expand content
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    if (isMobile && activeSection) {
      setExpandedSection(activeSection);
    }
  }, [activeSection, isMobile]);

  const toggleMobileSection = (sectionTitle: string) => {
    if (expandedSection === sectionTitle) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionTitle);
      setActiveSection(sectionTitle);
    }
  };

  if (!isOpen) return null;

  // Extract sections from privacy policy content
  const sections = privacyPolicy.content.filter(item =>
    item.match(/^\d+\s/)  // Match patterns like "1 ", "2 ", etc.
  );

  // Find content for the active section
  const getContentForSection = (section: string) => {
    const sectionIndex = privacyPolicy.content.findIndex(item => item === section);
    const result = [];

    if (sectionIndex !== -1) {
      let i = sectionIndex + 1;
      while (i < privacyPolicy.content.length && !privacyPolicy.content[i].match(/^\d{2}\.\d\s/)) {
        result.push(privacyPolicy.content[i]);
        i++;
      }
    }

    return result;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          ref={modalRef}
          className="bg-white w-full max-w-6xl rounded-lg shadow-xl flex flex-col md:flex-row h-[70vh] md:h-[85vh] overflow-hidden"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Desktop: Sidebar with section navigation */}
          {!isMobile && (
            <div className="hidden md:block w-72 bg-white border-r border-gray-200 overflow-y-auto">
              <div className="p-5 sticky top-0 bg-white border-b border-gray-100 z-10">
                <h2 className="text-xl font-bold text-gray-900">Privacy Policy</h2>
              </div>

              <div className="py-2">
                {sections.map((section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`w-full text-left py-3 px-5 transition-all duration-200 rounded-r-md mr-[-1px] ${activeSection === section
                      ? 'bg-purple-50 text-purple-700 font-medium border-r-2 border-purple-600'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-gray-50'
                      }`}
                  >
                    <span className="line-clamp-1">{section}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="py-3 px-5 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
              {!isMobile ? (
                <h1 className="text-xl font-bold text-purple-800 tracking-wide uppercase">
                  Privacy Policy Details
                </h1>
              ) : (
                <h1 className="text-xl font-bold text-gray-900">
                  Privacy Policy
                </h1>
              )}
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
{/* 
<div className="py-3 px-5 border-b border-gray-200 flex justify-between md:justify-end items-center md:items-end bg-white sticky top-0 z-10">
              {isMobile && (
                <h1 className="text-xl font-bold text-gray-900">
                  Privacy Policy
                </h1>
              )}
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
 */}

            {/* Mobile Accordion Menu */}
            {isMobile && (
              <div className="overflow-y-auto flex-1" ref={contentRef}>
                {sections.map((section) => (
                  <div key={section} className="border-b border-gray-200">
                    <button
                      onClick={() => toggleMobileSection(section)}
                      className={`w-full flex justify-between items-center p-4 text-left ${expandedSection === section ? 'bg-purple-50' : 'bg-white'
                        }`}
                    >
                      <span className={`font-medium ${expandedSection === section ? 'text-purple-700' : 'text-gray-700'}`}>
                        {section}
                      </span>
                      <svg
                        className={`w-5 h-5 transform transition-transform ${expandedSection === section ? 'rotate-180 text-purple-600' : 'text-gray-500'
                          }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Section Content (conditionally rendered) */}
                    {expandedSection === section && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-4 pt-2 pb-5 bg-white" // Light theme
                      >
                        <div className="prose prose-sm max-w-none text-gray-700">
                          <ul className="list-disc pl-5 space-y-2">
                            {getContentForSection(section).map((item, idx) => (
                              <li key={idx} className="ml-4">{item.startsWith('-') ? item.substring(2) : item}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Desktop Scrollable content - showing ALL sections with separators */}
            {!isMobile && (
              <div ref={contentRef} className="flex-1 overflow-y-auto p-6 md:p-8">
                {sections.map((section, index) => (
                  <div
                    key={section}
                    ref={el => { sectionRefs.current[section] = el; }}
                    className={`max-w-3xl mb-8 ${index > 0 ? 'pt-6 border-t border-gray-200' : ''}`}
                    id={section.replace(/\s+/g, '-').toLowerCase()}
                  >
                    <h2 className="text-xl font-bold text-purple-700 mb-4">{section}</h2>
                    <div className="prose max-w-none text-gray-700">
                      <ul className="list-disc pl-5 space-y-3">
                        {getContentForSection(section).map((item, idx) => (
                          <li key={idx} className="ml-4">{item.startsWith('-') ? item.substring(2) : item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer with accept button */}
            {/* <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-white"> */}
            {/* Last Updated Text */}
            {/* <span className="text-sm text-gray-500">
                Last updated: April 15, 2025
              </span> */}

            {/* Accept Button */}
            {/* <motion.button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-md font-medium flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Check className="h-5 w-5" />
                I Accept
              </motion.button> */}
          </div>
          {/* </div> */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PrivacyPolicyModal;