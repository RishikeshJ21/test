import React, { JSX, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import SwipeCards from "./SwipeCards";
import { stepCards } from "../../data/HowItWorkMobile";

export const HowItWorkSection = (): JSX.Element => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const [isNewUser, setIsNewUser] = useState(true); // Default to true for new users
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsViewedRef = useRef<Set<number>>(new Set([0])); // Start with first card viewed

  // Check if user is new, and retrieve progress if available
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== 'undefined') {
      const hasVisitedBefore = localStorage.getItem('hasVisitedHowItWorks');
      setIsNewUser(!hasVisitedBefore);

      // Retrieve progress if page was refreshed mid-viewing
      const savedProgress = localStorage.getItem('howItWorksProgress');
      if (savedProgress) {
        try {
          const progress = JSON.parse(savedProgress);
          if (progress.viewedCards && Array.isArray(progress.viewedCards)) {
            // Cast the unknown[] to number[] before creating the Set
            const viewedCards = progress.viewedCards.map((card: unknown) => Number(card));
            const viewedCardsSet = new Set<number>(viewedCards);
            cardsViewedRef.current = viewedCardsSet;
          }

          if (typeof progress.activeCard === 'number') {
            setActiveCard(progress.activeCard);
          }

          if (progress.hasInteracted) {
            setHasInteracted(true);
          }
        } catch (e) {
          console.error("Error restoring progress:", e);
        }
      }
    }
  }, []);

  // Save progress whenever relevant state changes
  useEffect(() => {
    if (hasInteracted && typeof window !== 'undefined') {
      const progress = {
        viewedCards: Array.from(cardsViewedRef.current),
        activeCard,
        hasInteracted
      };
      localStorage.setItem('howItWorksProgress', JSON.stringify(progress));

      if (cardsViewedRef.current.size === stepCards.length) {
        localStorage.setItem('hasVisitedHowItWorks', 'true');
      }
    }
  }, [activeCard, hasInteracted]);

  // Check if we're in a mobile view when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkViewport = () => {
        setIsMobileView(window.innerWidth < 768);
      };

      checkViewport();
      window.addEventListener('resize', checkViewport);
      return () => window.removeEventListener('resize', checkViewport);
    }
  }, []);

  // Track which cards have been viewed
  useEffect(() => {
    cardsViewedRef.current.add(activeCard);
  }, [activeCard]);

  // Handle scroll locking and card progression
  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobileView && isNewUser && hasInteracted) {
      const handleScroll = (e: WheelEvent) => {
        if (!isLocked) return;

        e.preventDefault();

        // For new users, require multiple scrolls to change cards
        if (e.deltaY > 0) {
          // Scrolling down - count towards next card
          setActiveCard(current => {
            const next = Math.min(stepCards.length - 1, current + 1);
            return next;
          });
        } else if (e.deltaY < 0) {
          // Scrolling up - count towards previous card
          setActiveCard(current => {
            const next = Math.max(0, current - 1);
            return next;
          });
        }
      };

      window.addEventListener('wheel', handleScroll, { passive: false });
      return () => window.removeEventListener('wheel', handleScroll);
    }
  }, [isLocked, isNewUser, isMobileView, hasInteracted]);

  // Handle intersection observer for locking
  useEffect(() => {
    if (typeof window !== 'undefined' && !isMobileView && isNewUser && hasInteracted) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // When section comes into view for new users:
              // 1. Lock scrolling to force card-by-card viewing
              setIsLocked(true);
              document.body.style.overflow = 'hidden';


              if (sectionRef.current) {
                const yOffset = -120; // Small offset to position optimally
                const y = sectionRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }
          });
        },
        { threshold: 0.5 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }

      return () => {
        observer.disconnect();
        document.body.style.overflow = 'auto';
      };
    }
  }, [isMobileView, isNewUser, hasInteracted]);

  // Handle mouse enter to detect when user actually interacts with the component
  const handleMouseEnter = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  };

  return (
    <section
      className="w-full bg-gradient-to-b from-purple-50 to-purple-50 py-12 md:pt-20"
      id="how-it-works"
      ref={sectionRef}
      onMouseEnter={handleMouseEnter}
    >
      <div className="max-w-[1384px] mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <motion.div
            className="w-full md:w-[40%] mb-5 md:mb-0"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="mb-1 md:mb-1">
              <h2 className="group font-['Instrument_Sans',Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
                How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Work</span>
                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
              </h2>
              <p className="mt-3 md:mt-4 text-gray-600 max-w-full text-lg">
                {isMobileView ? "Unlock the tools and support that will elevate your creative journey!" : "Embark on Your Path to Creative Success!"}
              </p>
            </div>

            {/* Only show navigation dots on desktop */}
            <div className="hidden md:flex mt-8 gap-2">
              {stepCards.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveCard(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${activeCard === index ? "bg-purple-600 w-6" : "bg-gray-300"}`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {!hasInteracted && isNewUser && !isMobileView && (
              <div className="mt-4 text-purple-600 font-medium">
                View all {stepCards.length} cards to continue ({activeCard + 1}/{stepCards.length})
              </div>
            )}
          </motion.div>

          {/* Right column - Cards */}
          <motion.div
            className="w-full md:w-[55%]"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0, y: 20 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {isMobileView ? (
              <div className="px-1 relative "> {/* Increased height for mobile */}
                <SwipeCards />
              </div>
            ) : (
              <StackedCards
                activeCard={activeCard}
                setActiveCard={setActiveCard}
                isNewUser={isNewUser}
                hasInteracted={hasInteracted}
                isLocked={isLocked}
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const StackedCards = ({
  activeCard,
  setActiveCard,
  isNewUser,
  hasInteracted,
  isLocked
}: {
  activeCard: number,
  setActiveCard: React.Dispatch<React.SetStateAction<number>>,
  isNewUser: boolean,
  hasInteracted: boolean,
  isLocked: boolean
}) => {
  // Auto-rotate cards with 10 second delay between each card
  React.useEffect(() => {
    let timeout: NodeJS.Timeout;

    const interval = setInterval(() => {
      if (isNewUser) {
        // For new users, add a 10-second delay before changing the card
        timeout = setTimeout(() => {
          setActiveCard(current => {
            // If at the last card, loop back to the first after delay
            if (current === stepCards.length - 1) {
              return 0;
            } else {
              return Math.min(stepCards.length - 1, current + 1);
            }
          });
        }, 10000);
      } else if (hasInteracted) {
        // For returning users, add a 10-second delay before changing the card
        timeout = setTimeout(() => {
          setActiveCard(current => (current + 1) % stepCards.length);
        }, 20000);
      }
    }, 20000); // Run the interval every 10 seconds

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [setActiveCard, isNewUser, hasInteracted]);

  // Handle swipe
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { y: number } }
  ) => {
    if (info.offset.y < -50) {
      // For returning users, enable infinite swipe (loop back to first card after last)
      if (!isNewUser) {
        setActiveCard(current => (current + 1) % stepCards.length);
      } else {
        // For new users, limit to available cards
        setActiveCard(current => Math.min(stepCards.length - 1, current + 1));
      }
    } else if (info.offset.y > 50) {
      // For returning users, enable infinite swipe (go to last card from first)
      if (!isNewUser) {
        setActiveCard(current => (current - 1 + stepCards.length) % stepCards.length);
      } else {
        // For new users, limit to available cards
        setActiveCard(current => Math.max(0, current - 1));
      }
    }
  };

  return (
    <div className="relative h-[460px] md:h-[300px]  w-full overflow-visible">
      {stepCards.map((card, index) => {
        const position = (index - activeCard + stepCards.length) % stepCards.length;
        const stackPosition = position;

        return (
          <motion.div
            key={index}
            className={`absolute ${card.bgColor} rounded-3xl p-6 md:p-8 shadow-md w-full border border-white/30`}
            initial={{
              x: stackPosition === 0 ? 0 : 20 * stackPosition,
              y: stackPosition === 0 ? 0 : 20 * stackPosition,
              scale: 1 - (stackPosition * 0.02),
              opacity: stackPosition >= 4 ? 0 : 1,
              zIndex: 10 - stackPosition,
              rotate: stackPosition === 0 ? 0 : stackPosition * 1,
            }}
            animate={{
              x: stackPosition === 0 ? 0 : 20 * stackPosition,
              y: stackPosition === 0 ? 0 : 20 * stackPosition,
              scale: 1 - (stackPosition * 0.02),
              opacity: stackPosition >= 4 ? 0 : 1,
              zIndex: 10 - stackPosition,
              rotate: stackPosition === 0 ? 0 : stackPosition * 1,
            }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
            onClick={() => !isLocked && setActiveCard(index)}
            drag={!isLocked ? "y" : false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col">
              <div className="flex items-start justify-start gap-4 mb-5">
                <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm">
                  <img className="w-6 h-6" alt={card.title} src={card.icon} width={24} height={24} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent pt-1">
                  {card.title}
                </h3>
              </div>

              <p className="text-black text-base md:text-lg leading-snug">
                {card.description}
              </p>

              {position === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 flex items-center text-sm text-gray-600"
                >

                  <motion.svg
                    animate={{ y: [0, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-4 h-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </motion.svg>
                  <span>Swipe to see more</span>

                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Keep the SwipeCards implementation for mobile
export default HowItWorkSection;
