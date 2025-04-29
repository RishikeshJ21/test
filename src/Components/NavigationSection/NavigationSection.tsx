import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link and useNavigate
import { Button } from "../../SubComponents/button";
import { useAnalyticsEvent, EventCategory } from "../../lib/useAnalyticsEvent";
const MotionButton = motion(Button);
const MotionLink = motion(Link); // Create a motion component for Link

interface NavItem { title: string; href: string; active: boolean; offset: number; }
interface NavigationSectionProps { navItems?: NavItem[]; }

export const NavigationSection = ({ navItems: customNavItems }: NavigationSectionProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const trackEvent = useAnalyticsEvent();

  // Handle mouse movement for interactive background effect
  const handleMouseMove = () => {
    // Keep the function structure but don't update any state
  };

  // Make any browser API calls in useEffect
  useEffect(() => {
    // Any initialization that requires browser APIs can be done here
    // This ensures the component doesn't try to access browser APIs during server-side rendering
  }, []);

  // Navigation menu items data
  const defaultNavItems: NavItem[] = [
    { title: "Home", href: "/", active: true, offset: 0 },
    ...(window.location.pathname !== '/blog' ? [{ title: "Blog", href: "/blog", active: false, offset: 0 }] : []),
    { title: "How it Works", href: "/#how-it-works", active: false, offset: 30 },
    { title: "Why Choose Us", href: "/#why-choose-us", active: false, offset: 15 },
    { title: "Testimonials", href: "/#Testimonials", active: false, offset: 40 },
    { title: "FAQs", href: "/#FAQs", active: false, offset: 40 },
    { title: "Join Us", href: "/#ready-to-grow", active: false, offset: -10 },
  ];
  const navItems = customNavItems ?? defaultNavItems;

  // Add smooth scrolling for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, title: string, offset: number = 0) => {
    // Track navigation click
    trackEvent({
      action: 'navigation_click',
      category: EventCategory.NAVIGATION,
      label: title
    });

    // Handle hash links (both direct #hash and /#hash format)
    if (href.includes('#') && href !== '#') {
      e.preventDefault(); // Prevent default to allow our custom scroll logic

      let targetId: string;
      let shouldNavigateHome = false;

      // Check if it's a format like "/#section-id" (home page with hash)
      if (href.startsWith('/#')) {
        targetId = href.substring(2); // Remove the /# characters
        shouldNavigateHome = true;
      } else if (href.startsWith('#')) {
        targetId = href.substring(1); // Remove just the # character
      } else {
        // For other URLs with hash somewhere in the middle
        const hashIndex = href.indexOf('#');
        targetId = href.substring(hashIndex + 1);
      }

      // Check if we need to navigate to home first - we need to go home if not currently on home page
      // This fixes the issue when on /blog or other non-home routes
      shouldNavigateHome = window.location.pathname !== '/';

      // If we're not on the home page and need to go there first
      if (shouldNavigateHome) {
        // Store the target in sessionStorage
        sessionStorage.setItem('scrollToElementId', targetId);
        sessionStorage.setItem('scrollToElementOffset', offset.toString());
        // Navigate to home page
        window.location.href = '/';
        return;
      }

      // We're already on the right page, just scroll
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Close mobile menu if open
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }

        // Get header height to offset scrolling
        const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 80;

        // Get window width to adjust scroll behavior
        const isLargeScreen = window.innerWidth >= 1024; // lg breakpoint

        // Calculate the element's position adjusting for header height and custom offset
        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

        // Apply different offset based on screen size and component
        const additionalOffset = isLargeScreen ? offset : 0;
        const offsetPosition = elementPosition - headerHeight + additionalOffset;

        // Scroll to element with adjusted position and smooth behavior
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Optional: After scrolling is complete, check if the section is fully visible
        setTimeout(() => {
          const elementRect = targetElement.getBoundingClientRect();
          const isPartiallyVisible =
            elementRect.top < window.innerHeight &&
            elementRect.bottom > 0;

          // If the element is not fully visible, adjust scroll position
          if (!isPartiallyVisible) {
            window.scrollBy({
              top: elementRect.top < 0 ? elementRect.top - 50 : 0,
              behavior: 'smooth'
            });
          }
        }, 1000); // Wait for initial scroll to complete
      }
    } else {
      // For non-hash links like "/blog", let react-router handle navigation
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      // The Link component will handle the actual navigation
    }
  };

  // Add an effect to handle scrolling when coming from another page
  useEffect(() => {
    // Check if we have a stored element ID to scroll to
    const scrollToElementId = sessionStorage.getItem('scrollToElementId');
    const storedOffset = sessionStorage.getItem('scrollToElementOffset');
    const offset = storedOffset ? parseInt(storedOffset, 10) : 0;

    if (scrollToElementId) {
      // Clear the stored values
      sessionStorage.removeItem('scrollToElementId');
      sessionStorage.removeItem('scrollToElementOffset');

      // Wait for the page to fully render
      setTimeout(() => {
        const targetElement = document.getElementById(scrollToElementId);
        if (targetElement) {
          // Get header height to offset scrolling
          const headerHeight = headerRef.current ? headerRef.current.offsetHeight : 80;
          const isLargeScreen = window.innerWidth >= 1024;

          // Calculate position
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const additionalOffset = isLargeScreen ? offset : 0;
          const offsetPosition = elementPosition - headerHeight + additionalOffset;

          // Scroll
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 500); // Small delay to ensure DOM is ready
    }
  }, []);

  const handleGetStartedClick = () => {
    trackEvent({
      action: 'get_started_click',
      category: EventCategory.CONVERSION,
      label: 'Header Get Started button'
    });
    window.open("https://t.me/+dKB7kUlsbFFkMDM1", "_blank");
  };

  return (
    <header
      ref={headerRef}
      className="w-full flex justify-center pt-4 relative overflow-hidden "
      onMouseMove={handleMouseMove}
    >

      <motion.div
        className="w-[90%] px-4 border border-solid border-[#c7c7c79e] sm:px-6 py-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-[0px_10px_1px_-10px_rgba(0,0,0,0.15)] relative z-10"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Commented out interactive elements */}
        {/* ... */}

        <div className="flex justify-between items-center">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex items-center"
          >
            {/* Use Link for the logo to navigate home */}
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center bg-transparent justify-center font-bold shadow-md">
                <img src="/Logotype.svg" className="bg-transparent text-transparent" alt="Logo icon" width={30} height={30} />
              </div>
              <span className="font-['Instrument_Sans'] font-bold text-lg sm:text-xl text-[#111111] ml-2">Createathon</span>
            </Link>
          </motion.div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center p-2 rounded-md text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden lg:flex space-x-4 xl:space-x-8"
          >
            {navItems.map((item, index) => (
              <MotionLink // Use MotionLink instead of motion.a
                key={index}
                to={item.href} // Use 'to' prop for react-router Link
                className={`text-[#333333] transition-colors font-['Instrument_Sans'] ${item.active ? "font-semibold" : "font-medium"}`}
                whileHover={{
                  scale: 1.1,
                  color: "#9275E0",
                  transition: { duration: 0.2 }
                }}
                onClick={(e) => handleNavClick(e, item.href, item.title, item.offset)}
              >
                {item.title}
              </MotionLink>
            ))}
          </motion.nav>

          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            className="hidden lg:block"
          >
            <MotionButton
              className="bg-gradient-to-b from-[#9275E0] to-[#6C43D0] text-white px-5 sm:px-7 py-2.5 rounded-[10px] text-[16px] sm:text-[17px] font-['Instrument_Sans'] font-semibold shadow-[0px_4px_10px_rgba(147,117,224,0.4)] hover:shadow-[0px_5px_15px_rgba(147,117,224,0.85)] transition-all duration-300"
              whileHover={{
                scale: 1.1,
                boxShadow: "0px 8px 20px rgba(147, 117, 224, 0.9)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStartedClick}
            >
              Get Started
            </MotionButton>
          </motion.div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-4 w-full" // Keep hidden on lg screens unless toggled
          >
            <div className="flex flex-col space-y-3 pb-3">
              {navItems.map((item, index) => (
                <MotionLink // Use MotionLink here as well
                  key={index}
                  to={item.href} // Use 'to' prop
                  className={`text-[#333333] transition-colors font-['Instrument_Sans'] ${item.active ? "font-semibold" : "font-medium"} block py-1`} // Added block and py-1 for better spacing/click area
                  whileHover={{
                    scale: 1.05,
                    color: "#9275E0",
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  onClick={(e) => handleNavClick(e, item.href, item.title, item.offset)}
                >
                  {item.title}
                </MotionLink>
              ))}
              <MotionButton
                className="bg-gradient-to-b from-[#9275E0] to-[#6C43D0] text-white py-3 w-full rounded-[10px] text-[20px] font-['Instrument_Sans'] font-semibold shadow-[0px_4px_10px_rgba(147,117,224,0.4)] hover:shadow-[0px_5px_15px_rgba(147,117,224,0.85)] transition-all duration-300 mt-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 8px 20px rgba(147, 117, 224, 0.9)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetStartedClick}
              >
                Get Started
              </MotionButton>
            </div>
          </motion.div>
        )}
      </motion.div>
    </header>
  );
};
