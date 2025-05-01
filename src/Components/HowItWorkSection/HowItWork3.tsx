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
      <div className="max-w-[1800px] mx-auto    relative z-10 h-full flex flex-col">
        <motion.div
          className="text-start mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1 }}
          viewport={{ once: true }}
        >
 
             <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
             How It
             <span className=" bg-clip-text text-[#4e1f88] "> Works</span>  
             {/* <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Works</span> */}
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
            <div className="space-y-6 w-full ">
              {stepCards.map((card, index) => (
                <motion.button
                  key={index}
                  onClick={() => changeCard(index)}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 ml-2 rounded-xl transition-all flex items-center gap-4 ${activeCard === index
                    ? "bg-gradient-to-r from-purple-100 to-purple-50 border-l-4 border-purple-600 shadow-md"
                    : "bg-white/80 backdrop-blur-sm border-l-4 border-transparent hover:border-purple-300 hover:w-18"
                    }`}
                >
                  <motion.div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeCard === index ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-500"
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
