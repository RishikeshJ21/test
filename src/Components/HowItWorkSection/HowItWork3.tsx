import  { JSX, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { stepCards } from "../../data/HowItWorkPC";
 

export const HowItWorkSection3 = (): JSX.Element => {
  const [activeCard, setActiveCard] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const CARD_CHANGE_DELAY = 4000;

  // Create refs-related helper function
  const updateCardRef = useCallback((index: number, element: HTMLDivElement | null) => {
    if (cardsRef.current) {
      cardsRef.current[index] = element;
    }
  }, []);

  // Handle card change with animation
  const changeCard = useCallback((index: number) => {
    if (index !== activeCard && !isAnimating) {
      setIsAnimating(true);
      setActiveCard(index);

      if (sectionRef.current) {
        sectionRef.current.classList.add('card-changing');
        setTimeout(() => {
          sectionRef.current?.classList.remove('card-changing');
        }, 10);
      }

      setTimeout(() => {
        setIsAnimating(false);
      }, 100);
    }
  }, [activeCard, isAnimating]);

  // Skip to next card
  // const nextCard = useCallback(() => {
  //   changeCard((activeCard + 1) % stepCards.length);
  // }, [activeCard, changeCard]);

  // // Go to previous card
  // const prevCard = useCallback(() => {
  //   changeCard((activeCard - 1 + stepCards.length) % stepCards.length);
  // }, [activeCard, changeCard]);

  // Handle mouse enter for the whole component
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  // Handle mouse leave for the whole component
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
  }, []);

  // Auto-rotation effect that pauses on hover
  useEffect(() => {
    // Don't auto-rotate when user is hovering
    if (isHovering) return;

    const interval = setInterval(() => {
      setActiveCard(current => (current + 1) % stepCards.length);
    }, CARD_CHANGE_DELAY);

    return () => clearInterval(interval);
  }, [isHovering]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (cardChangeTimerRef.current) {
        clearTimeout(cardChangeTimerRef.current);
      }
    };
  }, []);

  return (
    // Only display on large screens (lg:block)
    <section
      className="hidden lg:block w-full py-10  bg-gradient-to-b from-gray-50 to-gray-50 relative overflow-hidden transition-all duration-500"
      id="how-it-works"
      ref={sectionRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 relative z-10 h-full flex flex-col">
        <motion.div
          className="text-start mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          viewport={{ once: true }}
        >
 
             <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
             How It  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Works</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-full text-lg">
          Your Path to Creative Success: Discover the tools, resources, and community support you need to elevate your creative journey. Whether you&apos;re just starting out or looking to take your craft to the next level, we&apos;re here to help you achieve your goals and turn your passion into a thriving career.
          </p>
        </motion.div>


        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center flex-grow">
          <motion.div
            className="w-full lg:w-1/3 flex flex-col items-center lg:items-start"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="space-y-6 w-full max-w-sm">
              {stepCards.map((card, index) => (
                <motion.button
                  key={index}
                  onClick={() => changeCard(index)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeCard === index
                    ? "bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-600 shadow-md"
                    : "bg-white/80 backdrop-blur-sm border-l-4 border-transparent hover:border-purple-300"
                    }`}
                >
                  <motion.div
                    className={`w-12 h-10 rounded-lg flex items-center justify-center ${activeCard === index ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"
                      }`}
                    animate={activeCard === index ? {
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0],
                      transition: { duration: 0.2 }
                    } : {}}
                  >
                    <img
                      src={card.icon}
                      alt={card.title}
                      width={24}
                      height={24}
                      className={activeCard === index ? "filter brightness-0 invert" : ""}
                    />
                  </motion.div>
                  <div className="flex-1">
                    <span className={`font-medium ${activeCard === index ? "text-purple-800" : "text-gray-600"}`}>
                      {card.title}
                    </span>
                    {activeCard === index && (
                      <motion.div
                        className="flex items-center mt-1"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="ml-1 text-xs text-purple-500">Now Playing</span>
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

      
          </motion.div>

          <div 
            className="w-full lg:w-2/3 relative" 
            style={{ height: "400px" }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <AnimatePresence mode="wait">
              {stepCards.map((card, index) => {
                const isActive = index === activeCard;
                return (
                  isActive && (
                    <motion.div
                      key={index}
                      ref={(el) => updateCardRef(index, el)}
                      className={`absolute inset-0 ${card.bgColor} rounded-2xl p-6 md:p-8 shadow-xl border border-white/30 backdrop-blur-sm overflow-hidden`}
                      initial={{ opacity: 0, rotateY: index % 2 === 0 ? -15 : 15, scale: 0.9 }}
                      animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                      exit={{ opacity: 0, rotateY: index % 2 === 0 ? 15 : -15, scale: 0.9 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15
                      }}
                      style={{
                        transformStyle: "preserve-3d",
                        perspective: "1000px"
                      }}
                    >
                      <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/20 blur-xl"></div>
                      <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-white/20 blur-xl"></div>

                      <div className="h-full flex flex-col relative z-10">
                        <motion.div
                          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-sm font-bold text-purple-700 shadow-md"
                          animate={{
                            scale: [1, 1.1, 1],
                            transition: {
                              repeat: Infinity,
                              duration: 2
                            }
                          }}
                        >
                          {index + 1}/{stepCards.length}
                        </motion.div>

                        <motion.div
                          className="mb-5 flex"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div
                            className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center"
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            animate={{
                              y: [0, -5, 0],
                              transition: {
                                repeat: Infinity,
                                duration: 2
                              }
                            }}
                          >
                            <img src={card.icon} alt={card.title} width={40} height={40} />
                          </motion.div>
                        </motion.div>

                        <motion.h3
                          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          {card.title}
                        </motion.h3>

                        <motion.p
                          className="text-base sm:text-lg overflow-y-auto text-gray-800 leading-relaxed"
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {card.description}
                        </motion.p>

                   
                      </div>
                    </motion.div>
                  )
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .card-changing {
          animation: pulseBackground 0.3s ease-in-out;
        }
        
        @keyframes pulseBackground {
          0%, 100% { background-color: rgba(249, 250, 251, 1); }
          50% { background-color: rgba(238, 242, 255, 1); }
        }
      `}</style>
    </section>
  );
};

// "use client";

// import React, { JSX, useState, useEffect, useRef, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import Image from "next/image";

// export const HowItWorkSection3 = (): JSX.Element => {
//   const [activeCard, setActiveCard] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isScrollLocked, setIsScrollLocked] = useState(false);
//   const [isSticky, setIsSticky] = useState(false);
//   const [hasCompletedCards, setHasCompletedCards] = useState(false);
//   const [visitedCards, setVisitedCards] = useState<Record<number, boolean>>({ 0: true });
//   const [allCardsViewed, setAllCardsViewed] = useState(false);
//   const [canChangeCard, setCanChangeCard] = useState(true);
//   const [isFirstVisit, setIsFirstVisit] = useState(false);
//   const [showFirstCardDelay, setShowFirstCardDelay] = useState(true);
//   const [isNewUser, setIsNewUser] = useState(true);
//   const sectionRef = useRef<HTMLElement>(null);
//   const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
//   const originalScrollY = useRef<number>(0);
//   const lastScrollY = useRef<number>(0);
//   const hasInitialized = useRef<boolean>(false);
//   const wheelDebounceTimer = useRef<NodeJS.Timeout | null>(null);
//   const cardChangeTimerRef = useRef<NodeJS.Timeout | null>(null);

//   const CARD_CHANGE_DELAY = 4000;
//   const FIRST_CARD_DELAY = 2000;

//   // Create refs-related helper function
//   const updateCardRef = useCallback((index: number, element: HTMLDivElement | null) => {
//     if (cardsRef.current) {
//       cardsRef.current[index] = element;
//     }
//   }, []);

//   // Handle card change with animation - defined early before it's used in hooks
//   const changeCard = useCallback((index: number) => {
//     if (index !== activeCard && !isAnimating && canChangeCard) {
//       setIsAnimating(true);
//       setIsScrollLocked(true);
//       setCanChangeCard(false);

//       setVisitedCards(prev => ({ ...prev, [index]: true }));

//       setActiveCard(index);

//       if (sectionRef.current) {
//         sectionRef.current.classList.add('card-changing');
//         setTimeout(() => {
//           sectionRef.current?.classList.remove('card-changing');
//         }, 300);
//       }

//       setTimeout(() => {
//         setIsAnimating(false);

//         setTimeout(() => {
//           setIsScrollLocked(false);
//         }, 300);
//       }, 600);

//       if (cardChangeTimerRef.current) {
//         clearTimeout(cardChangeTimerRef.current);
//       }

//       cardChangeTimerRef.current = setTimeout(() => {
//         setCanChangeCard(true);
//         console.log("Card change cooldown finished - can change card again");
//       }, CARD_CHANGE_DELAY);
//     } else if (!canChangeCard) {
//       console.log("Card change rejected - cooldown period active");
//     }
//   }, [activeCard, isAnimating, canChangeCard, CARD_CHANGE_DELAY]);

//   // Skip to next card - defined early
//   const nextCard = useCallback(() => {
//     changeCard((activeCard + 1) % stepCards.length);
//   }, [activeCard, changeCard]);

//   // Go to previous card - defined early
//   const prevCard = useCallback(() => {
//     changeCard((activeCard - 1 + stepCards.length) % stepCards.length);
//   }, [activeCard, changeCard]);

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       // Check if this is the first visit by looking for the localStorage flag
//       const hasVisitedBefore = localStorage.getItem("visited_howItWorks");
//       setIsNewUser(!hasVisitedBefore);

//       // Only set isFirstVisit to true if they haven't visited before
//       // This controls whether or not the sticky behavior happens
//       setIsFirstVisit(!hasVisitedBefore);

//       console.log("First visit check:", {
//         hasVisitedBefore: Boolean(hasVisitedBefore),
//         isFirstVisit: !hasVisitedBefore
//       });
//     }
//   }, []);

//   // Set the localStorage flag after first view
//   useEffect(() => {
//     try {
//       if (isNewUser) {
//         // Set the flag that they've visited this section
//         // Only when they are a new user and we need to show the loading delay
//         if (typeof window !== 'undefined') {
//           localStorage.setItem("visited_howItWorks", "true");
//         }

//         setTimeout(() => {
//           setShowFirstCardDelay(false);
//         }, FIRST_CARD_DELAY);
//       } else {
//         // For returning users, no delay needed
//         setShowFirstCardDelay(false);

//         // Important: Also ensure they don't get the sticky behavior
//         setIsFirstVisit(false);
//       }
//     } catch (e) {
//       console.error("LocalStorage error:", e);
//       setShowFirstCardDelay(false);
//     }
//   }, [isNewUser, FIRST_CARD_DELAY]);

//   useEffect(() => {
//     if (!hasInitialized.current && sectionRef.current) {
//       originalScrollY.current = window.scrollY;
//       lastScrollY.current = window.scrollY;
//       hasInitialized.current = true;
//     }

//     const handleResize = () => {
//       if (isSticky && sectionRef.current) {
//         window.scrollTo({
//           top: sectionRef.current.offsetTop,
//           behavior: 'instant'
//         });
//       }
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, [isSticky]);

//   useEffect(() => {
//     const originalOverflow = document.body.style.overflow;

//     return () => {
//       document.body.style.overflow = originalOverflow;
//     };
//   }, []);

//   useEffect(() => {
//     if (isSticky) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = '';
//     }
//   }, [isSticky]);

//   useEffect(() => {
//     const handleMainScroll = () => {
//       if (!sectionRef.current) return;

//       const rect = sectionRef.current.getBoundingClientRect();
//       const viewportHeight = window.innerHeight;

//       console.log("Section position:", {
//         top: rect.top,
//         height: rect.height,
//         viewport: viewportHeight,
//         isSticky,
//         hasCompletedCards,
//         activeCard,
//         visited: Object.keys(visitedCards).length,
//         isFirstVisit
//       });

//       if (isSticky) {
//         if (Object.keys(visitedCards).length >= stepCards.length &&
//           activeCard === stepCards.length - 1) {
//           console.log("All cards viewed - releasing section");
//           setIsSticky(false);
//           setHasCompletedCards(true);
//           document.body.style.overflow = '';
//         } else if (rect.top > viewportHeight) {
//           console.log("Section moved far out of view - releasing");
//           setIsSticky(false);
//           document.body.style.overflow = '';
//         }
//         return;
//       }

//       if (isFirstVisit && !showFirstCardDelay && !hasCompletedCards &&
//         rect.top <= viewportHeight * 0.3 &&
//         rect.bottom >= viewportHeight * 0.5) {
//         console.log("Section in view and is first visit - sticking");
//         setIsSticky(true);

//         document.body.style.overflow = 'hidden';
//       }
//     };

//     window.addEventListener('scroll', handleMainScroll, { passive: true });

//     setTimeout(handleMainScroll, 100);

//     return () => {
//       window.removeEventListener('scroll', handleMainScroll);
//       document.body.style.overflow = '';
//     };
//   }, [isSticky, activeCard, hasCompletedCards, visitedCards, isFirstVisit, showFirstCardDelay]);

//   useEffect(() => {
//     if (Object.keys(visitedCards).length >= stepCards.length &&
//       activeCard === stepCards.length - 1 &&
//       !allCardsViewed) {
//       console.log("All cards viewed - will auto-unstick after delay");
//       setAllCardsViewed(true);

//       const timer = setTimeout(() => {
//         if (isSticky) {
//           console.log("Auto-unsticking after all cards viewed");
//           setIsSticky(false);
//           setHasCompletedCards(true);
//           document.body.style.overflow = '';
//         }
//       }, 3000);

//       return () => clearTimeout(timer);
//     }
//   }, [visitedCards, activeCard, allCardsViewed, isSticky]);

//   useEffect(() => {
//     let isProcessingEvent = false;

//     const handleScrollEvent = (direction: 'up' | 'down') => {
//       if (isProcessingEvent || !isSticky || isAnimating || isScrollLocked || !canChangeCard) {
//         if (!canChangeCard) {
//           console.log("Scroll ignored - waiting for cooldown timer");
//         }
//         return;
//       }

//       isProcessingEvent = true;

//       if (direction === 'down') {
//         if (activeCard < stepCards.length - 1) {
//           console.log("Scroll DOWN - going to NEXT card");
//           nextCard();
//         }
//       } else {
//         if (activeCard > 0) {
//           console.log("Scroll UP - going to PREVIOUS card");
//           prevCard();
//         }
//       }

//       setTimeout(() => {
//         isProcessingEvent = false;
//       }, 500);
//     };

//     const handleWheel = (e: WheelEvent) => {
//       if (!isSticky) return;

//       e.preventDefault();

//       const delta = e.deltaY || -((e as unknown as { wheelDelta?: number }).wheelDelta || 0);
//       const direction = delta > 0 ? 'down' : 'up';

//       if (wheelDebounceTimer.current) {
//         clearTimeout(wheelDebounceTimer.current);
//       }

//       wheelDebounceTimer.current = setTimeout(() => {
//         handleScrollEvent(direction);
//       }, 100);
//     };

//     let touchStartY = 0;

//     const handleTouchStart = (e: TouchEvent) => {
//       if (!isSticky) return;
//       touchStartY = e.touches[0].clientY;
//     };

//     const handleTouchEnd = (e: TouchEvent) => {
//       if (!isSticky || isProcessingEvent) return;

//       const touchEndY = e.changedTouches[0].clientY;
//       const diff = touchStartY - touchEndY;

//       if (Math.abs(diff) > 30) {
//         handleScrollEvent(diff > 0 ? 'down' : 'up');
//       }
//     };

//     if (isSticky) {
//       window.addEventListener('wheel', handleWheel, { passive: false });
//       window.addEventListener('touchstart', handleTouchStart, { passive: true });
//       window.addEventListener('touchend', handleTouchEnd, { passive: true });
//     }

//     return () => {
//       if (wheelDebounceTimer.current) {
//         clearTimeout(wheelDebounceTimer.current);
//       }
//       window.removeEventListener('wheel', handleWheel);
//       window.removeEventListener('touchstart', handleTouchStart);
//       window.removeEventListener('touchend', handleTouchEnd);
//     };
//   }, [isSticky, activeCard, isAnimating, isScrollLocked, canChangeCard, nextCard, prevCard]);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (!isSticky || !canChangeCard) return;

//       console.log("Key pressed:", e.key);

//       if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
//         e.preventDefault();
//         if (activeCard < stepCards.length - 1) {
//           console.log("Arrow DOWN/RIGHT - moving to NEXT card");
//           nextCard();
//         }
//       } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
//         e.preventDefault();
//         if (activeCard > 0) {
//           console.log("Arrow UP/LEFT - moving to PREVIOUS card");
//           prevCard();
//         }
//       } else if (e.key === 'Escape') {
//         setIsSticky(false);
//         document.body.style.overflow = '';
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [isSticky, activeCard, canChangeCard, nextCard, prevCard]);

//   // Auto-rotation effects - only auto-rotate for new users when not in sticky mode
//   // For returning users, only rotate in the background when section not in active view
//   useEffect(() => {
//     // Don't auto-rotate when in sticky mode (user is interacting)
//     if (isSticky) return;

//     // Different rotation intervals for new vs returning users
//     const rotationInterval = isNewUser ? 4000 : 6000;

//     const interval = setInterval(() => {
//       setActiveCard(current => (current + 1) % stepCards.length);
//     }, rotationInterval);

//     return () => clearInterval(interval);
//   }, [isNewUser, isSticky]);

//   useEffect(() => {
//     return () => {
//       if (cardChangeTimerRef.current) {
//         clearTimeout(cardChangeTimerRef.current);
//       }
//     };
//   }, []);

//   // Function to reset localStorage for testing
//   const resetVisitStatus = useCallback(() => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem("visited_howItWorks");
//       console.log("Visit status reset! Refresh to see first-time experience again.");
//       // Optionally reload the page
//       window.location.reload();
//     }
//   }, []);

//   // const progressIndicator = () => {
//   //   const totalCards = stepCards.length;
//   //   const seenCards = Object.keys(visitedCards).length;

//   //   return (
//   //     <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 bg-white/80 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg">
//   //       <div className="flex flex-col items-center">
//   //         <div className="flex items-center gap-3 mb-1">
//   //           <span className="text-sm font-semibold text-purple-700">
//   //             {seenCards < totalCards
//   //               ? `Explore all ${totalCards} cards (${seenCards}/${totalCards})`
//   //               : "All sections viewed!"}
//   //           </span>
//   //           <div className="flex space-x-1">
//   //             {stepCards.map((_, idx) => (
//   //               <motion.div
//   //                 key={idx}
//   //                 className={`h-2 rounded-full ${idx === activeCard
//   //                   ? "w-8 bg-purple-600"
//   //                   : visitedCards[idx]
//   //                     ? "w-2 bg-purple-300"
//   //                     : "w-2 bg-gray-300"
//   //                   }`}
//   //                 initial={false}
//   //                 animate={idx === activeCard ? { scale: [1, 1.2, 1] } : {}}
//   //                 transition={{ duration: 0.5 }}
//   //               />
//   //             ))}
//   //           </div>

//   //           {!canChangeCard && (
//   //             <span className="text-xs text-orange-600 ml-2 flex items-center">
//   //               <svg className="w-3 h-3 mr-1 animate-spin" viewBox="0 0 24 24">
//   //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
//   //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//   //               </svg>
//   //               Waiting...
//   //             </span>
//   //           )}
//   //         </div>

//   //         <div className="text-xs text-gray-600 flex items-center">
//   //           <span className="inline-flex items-center mr-2">
//   //             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
//   //             </svg>
//   //             Scroll down = Next
//   //           </span>
//   //           <span className="inline-flex items-center mr-2">
//   //             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
//   //             </svg>
//   //             Scroll up = Previous
//   //           </span>
//   //           <span className="inline-flex items-center">
//   //             <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//   //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//   //             </svg>
//   //             ESC to exit
//   //           </span>
//   //         </div>
//   //       </div>
//   //     </div>
//   //   );
//   // };

//   return (
//     <section
//       className={`w-full py-16 bg-gradient-to-b from-gray-50 to-gray-50 relative overflow-hidden transition-all duration-500 ${isSticky ? 'sticky-active' : ''}`}
//       id="how-it-works"
//       ref={sectionRef}
//       style={{
//         height: isSticky ? '100vh' : 'auto',
//       }}
//     >
//       {/* Small debug reset button - only visible in development */}
//       {process.env.NODE_ENV === 'development' && (
//         <button
//           onClick={resetVisitStatus}
//           className="absolute bottom-2 right-2 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded z-50 opacity-50 hover:opacity-100"
//         >
//           Reset Visit Status
//         </button>
//       )}

//       {/* {isSticky && progressIndicator()} */}

//       {showFirstCardDelay && isFirstVisit && (
//         <div className="absolute inset-0 bg-white/90 z-50 flex flex-col items-center justify-center">
//           <motion.div
//             className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
//             animate={{ rotate: 360 }}
//             transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
//           />
//           <p className="mt-4 text-purple-800 font-medium">Loading experience...</p>
//         </div>
//       )}

//       {!isFirstVisit && !isSticky && (
//         <motion.div
//           className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-40"
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.5 }}
//         >
//           <span className="text-sm text-purple-800 font-medium flex items-center">
//             <svg className="w-4 h-4 mr-1 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//             </svg>
//             Welcome back! Scroll normally to explore
//           </span>
//         </motion.div>
//       )}

//       <div className="max-w-[1800px] mx-auto px-4 md:px-8 relative z-10 h-full flex flex-col">
//         <motion.div
//           className="text-start mb-6"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="[font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[36px] sm:text-[48px] md:text-[56px] tracking-[0] leading-[1.2]">
//             How It Works
//           </h2>
//           <p className="w-full leading-7 sm:leading-9 [font-family:'Instrument_Sans',Helvetica] font-medium text-[#222222] text-lg sm:text-xl md:text-2xl tracking-[0]">
//             Your Path to Creative Success: Discover the tools, resources, and community support you need to elevate your creative journey. Whether you&apos;re just starting out or looking to take your craft to the next level, we&apos;re here to help you achieve your goals and turn your passion into a thriving career.
//           </p>
//         </motion.div>

//         <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center flex-grow">
//           <motion.div
//             className="w-full lg:w-1/3 flex flex-col items-center lg:items-start"
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.6, delay: 0.2 }}
//             viewport={{ once: true }}
//           >
//             <div className="space-y-6 w-full max-w-sm">
//               {stepCards.map((card, index) => (
//                 <motion.button
//                   key={index}
//                   onClick={() => changeCard(index)}
//                   onMouseEnter={() => {/* Empty to prevent linting errors */ }}
//                   onMouseLeave={() => {/* Empty to prevent linting errors */ }}
//                   whileHover={{ scale: 1.03 }}
//                   whileTap={{ scale: 0.98 }}
//                   className={`w-full text-left p-4 rounded-xl transition-all flex items-center gap-4 ${activeCard === index
//                     ? "bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-600 shadow-md"
//                     : "bg-white/80 backdrop-blur-sm border-l-4 border-transparent hover:border-purple-300"
//                     }`}
//                 >
//                   <motion.div
//                     className={`w-12 h-12 rounded-lg flex items-center justify-center ${activeCard === index ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"
//                       }`}
//                     animate={activeCard === index ? {
//                       scale: [1, 1.1, 1],
//                       rotate: [0, 5, 0, -5, 0],
//                       transition: { duration: 0.5 }
//                     } : {}}
//                   >
//                     <Image
//                       src={card.icon}
//                       alt={card.title}
//                       width={24}
//                       height={24}
//                       className={activeCard === index ? "filter brightness-0 invert" : ""}
//                     />
//                   </motion.div>
//                   <div className="flex-1">
//                     <span className={`font-medium ${activeCard === index ? "text-purple-800" : "text-gray-600"}`}>
//                       {card.title}
//                     </span>
//                     {activeCard === index && (
//                       <motion.div
//                         className="flex items-center mt-1"
//                         initial={{ opacity: 0, x: -10 }}
//                         animate={{ opacity: 1, x: 0 }}
//                         transition={{ delay: 0.2 }}
//                       >
//                         <svg className="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                         </svg>
//                         <span className="ml-1 text-xs text-purple-500">Now Playing</span>
//                       </motion.div>
//                     )}
//                   </div>
//                 </motion.button>
//               ))}
//             </div>

//             <motion.div
//               className="mt-8 flex items-center justify-center gap-4 w-full"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ delay: 0.5 }}
//             >
//               <motion.button
//                 onClick={prevCard}
//                 className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600"
//                 whileHover={{ scale: 1.1, backgroundColor: "#f9f9f9" }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//               </motion.button>

//               <motion.button
//                 onClick={nextCard}
//                 className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600"
//                 whileHover={{ scale: 1.1, backgroundColor: "#f9f9f9" }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                 </svg>
//               </motion.button>
//             </motion.div>
//           </motion.div>

//           <div className="w-full lg:w-2/3 relative" style={{ height: "450px" }}>
//             <AnimatePresence mode="wait">
//               {stepCards.map((card, index) => {
//                 const isActive = index === activeCard;
//                 return (
//                   isActive && (
//                     <motion.div
//                       key={index}
//                       ref={(el) => updateCardRef(index, el)}
//                       className={`absolute inset-0 ${card.bgColor} rounded-2xl p-6 md:p-8 shadow-xl border border-white/30 backdrop-blur-sm overflow-hidden`}
//                       initial={{ opacity: 0, rotateY: index % 2 === 0 ? -15 : 15, scale: 0.9 }}
//                       animate={{ opacity: 1, rotateY: 0, scale: 1 }}
//                       exit={{ opacity: 0, rotateY: index % 2 === 0 ? 15 : -15, scale: 0.9 }}
//                       transition={{
//                         type: "spring",
//                         stiffness: 100,
//                         damping: 15
//                       }}
//                       style={{
//                         transformStyle: "preserve-3d",
//                         perspective: "1000px"
//                       }}
//                     >
//                       <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/20 blur-xl"></div>
//                       <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-white/20 blur-xl"></div>

//                       <div className="h-full flex flex-col relative z-10">
//                         <motion.div
//                           className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-sm font-bold text-purple-700 shadow-md"
//                           animate={{
//                             scale: [1, 1.1, 1],
//                             transition: {
//                               repeat: Infinity,
//                               duration: 2
//                             }
//                           }}
//                         >
//                           {index + 1}/{stepCards.length}
//                         </motion.div>

//                         <motion.div
//                           className="mb-5 flex"
//                           initial={{ y: 20, opacity: 0 }}
//                           animate={{ y: 0, opacity: 1 }}
//                           transition={{ delay: 0.2 }}
//                         >
//                           <motion.div
//                             className="w-20 h-20 bg-white rounded-xl shadow-lg flex items-center justify-center"
//                             whileHover={{ scale: 1.1, rotate: 5 }}
//                             animate={{
//                               y: [0, -5, 0],
//                               transition: {
//                                 repeat: Infinity,
//                                 duration: 2
//                               }
//                             }}
//                           >
//                             <Image src={card.icon} alt={card.title} width={40} height={40} />
//                           </motion.div>
//                         </motion.div>

//                         <motion.h3
//                           className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3"
//                           initial={{ y: 20, opacity: 0 }}
//                           animate={{ y: 0, opacity: 1 }}
//                           transition={{ delay: 0.3 }}
//                         >
//                           {card.title}
//                         </motion.h3>

//                         <motion.p
//                           className="text-base sm:text-lg text-gray-800 leading-relaxed"
//                           initial={{ y: 20, opacity: 0 }}
//                           animate={{ y: 0, opacity: 1 }}
//                           transition={{ delay: 0.4 }}
//                         >
//                           {card.description.split(' ').map((word, i) => (
//                             <motion.span
//                               key={i}
//                               className="inline-block mr-1"
//                               initial={{ opacity: 0, y: 10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               transition={{ delay: 0.4 + (i * 0.01) }}
//                             >
//                               {word}
//                             </motion.span>
//                           ))}
//                         </motion.p>

//                         <motion.div
//                           className="mt-auto pt-5 flex justify-between items-center"
//                           initial={{ opacity: 0 }}
//                           animate={{ opacity: 1 }}
//                           transition={{ delay: 0.6 }}
//                         >
//                           <div className="flex space-x-2">
//                             {stepCards.map((_, i) => (
//                               <motion.div
//                                 key={i}
//                                 className={`h-2 rounded-full cursor-pointer ${i === activeCard ? "bg-purple-600" : "bg-gray-300"
//                                   }`}
//                                 style={{ width: i === activeCard ? 24 : 8 }}
//                                 whileHover={{ scale: 1.2 }}
//                                 onClick={() => changeCard(i)}
//                               />
//                             ))}
//                           </div>

//                           <motion.button
//                             className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2"
//                             whileHover={{ scale: 1.05, backgroundColor: "#7c3aed" }}
//                             whileTap={{ scale: 0.95 }}
//                           >
//                             <span>Learn More</span>
//                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                             </svg>
//                           </motion.button>
//                         </motion.div>
//                       </div>
//                     </motion.div>
//                   )
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         .sticky-active {
//           position: sticky;
//           top: 0;
//           z-index: 50;
//         }
        
//         .card-changing {
//           animation: pulseBackground 0.3s ease-in-out;
//         }
        
//         @keyframes pulseBackground {
//           0%, 100% { background-color: rgba(249, 250, 251, 1); }
//           50% { background-color: rgba(238, 242, 255, 1); }
//         }
//       `}</style>
//     </section>
//   );
// };

// const stepCards = [
//   {
//     icon: "/frame-8.svg",
//     title: "Fund Your Vibes",
//     description:
//       "Get the financial boost you need to bring your boldest ideas to life. From production costs to gear upgrades, we've got your back—no strings attached. Our funding program is designed specifically for creators who need that extra push to transform their creative vision into reality. Apply today and join hundreds of creators who've already taken their content to the next level with our support.",
//     bgColor: "bg-[#FFBDA8]",
//   },
//   {
//     icon: "/frame-10.svg",
//     title: "Level Up Your Skills",
//     description:
//       "Learn from industry experts and successful creators through hands-on mentorship and expert guidance. Elevate your skills, perfect your craft, and make your content stand out. Our comprehensive workshops cover everything from technical skills to creative storytelling techniques. With personalized feedback and actionable advice, you'll see measurable improvement in your content quality and audience engagement within weeks.",
//     bgColor: "bg-[#FFD5A8]",
//   },
//   {
//     icon: "/frame-7.svg",
//     title: "Connect with Your Tribe",
//     description:
//       "Be part of a thriving community where creators inspire each other. Collaborate, share ideas, and build lasting connections with like-minded individuals who share your passion. Our platform facilitates meaningful interactions through virtual meetups, collaborative projects, and exclusive community events. Many of our members have formed successful creative partnerships, leading to innovative content and expanded audiences for everyone involved.",
//     bgColor: "bg-[#C7F1D1]",
//   },
//   {
//     icon: "/frame-4.svg",
//     title: "Build a Sustainable Hustle",
//     description:
//       "Turn your passion into a career by mastering monetization and branding strategies. Learn how to secure partnerships and keep your creative journey thriving long term. Our business development resources help you identify multiple revenue streams, negotiate better deals, and build a personal brand that resonates with both audiences and potential sponsors. We'll guide you through creating a sustainable business model that allows you to focus on what you love while ensuring financial stability.",
//     bgColor: "bg-[#FFB090]",
//   },
// ];