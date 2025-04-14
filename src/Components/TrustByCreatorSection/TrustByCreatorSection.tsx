"use client";

import { JSX, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../../data/TrustedByCreators";
import { AnimatedTestimonials } from "../../SubComponents/ui/animated-testimonials";



// Format testimonials for AnimatedTestimonials component
const animatedTestimonialsData = testimonials.map((item) => ({
  quote: item.quote,
  name: item.name,
  designation: item.role,
  src: item.image,
}));

// Customizable card positioning
const cardPositions = {
  first: { x: 100, y: 0 },
  second: { x: 560, y: 40 },
  third: { x: 950, y: 40 },
  fourth: { x: 1340, y: 40 }, // Added fourth card position
};

export const TrustByCreatorSection = (): JSX.Element => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [visibleIndices, setVisibleIndices] = useState<number[]>([]);
  // Initialize with 0 for server rendering, then update on client
  const [screenWidth, setScreenWidth] = useState(0);
  const hasMounted = useRef(false);

  // Determine how many cards to show based on screen width
  const cardsToShow = screenWidth > 1300 ? 4 : 3;

  // Update screen width on client-side only
  useEffect(() => {
    // Only run this effect on the client
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      hasMounted.current = true;
    }
  }, []);

  // Calculate which slides to show
  useEffect(() => {
    const indices = [];
    for (let i = 0; i < cardsToShow; i++) {
      indices.push((activeIndex + i) % testimonials.length);
    }
    setVisibleIndices(indices);
  }, [activeIndex, cardsToShow]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setScreenWidth(window.innerWidth);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, []);

  // Setup auto-advance timer effect
  useEffect(() => {
    // Clear existing timer if any
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Only set up new timer if not paused
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((current) => (current + 1) % testimonials.length);
        setDirection(1);
      }, 5000); // Changed to 5 seconds for more responsive feel
    }

    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, activeIndex]); // Added activeIndex to dependencies to reset timer after manual navigation


  // Handle card click to move it to the first position
  const handleCardClick = (index: number) => {
    // Only respond to clicks on non-active cards
    if (index !== activeIndex) {
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    }
  };

  // Pause on hover handlers for the entire carousel area
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Get position based on index and screen width
  const getPositionForCard = (position: number) => {
    switch (position) {
      case 0: return cardPositions.first;
      case 1: return cardPositions.second;
      case 2: return cardPositions.third;
      case 3: return cardPositions.fourth;
      default: return cardPositions.first;
    }
  };

  return (
    <section id="Testimonials" className="flex flex-col w-full items-start gap-1 md:gap-12 py-0 md:py-10 overflow-hidden">

      {/* Header with animated underline on hover */}


      <div className="max-w-8xl mx-auto lg:px-29 px-8 w-full">
        <div className="mb-1 md:mb-1">
          {/* <div className="inline-block px-4 py-1 bg-purple-100 rounded-full text-purple-600 text-sm font-medium mb-4">
            FAQ
          </div> */}
          <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
            Trusted by      <span className=" bg-clip-text text-[#4e1f88] ">Creators</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-full text-lg">
            At Createathon, our creators&apos; success is our greatest
            achievement. We take pride in empowering talent and transforming
            passion into lasting careers. Hear what our community has to say!
          </p>
        </div>
      </div>

      {/* Mobile view - AnimatedTestimonials */}
      <div className="lg:hidden w-full">
        <AnimatedTestimonials
          testimonials={animatedTestimonialsData}
          autoplay={true}
        />
      </div>

      {/* Desktop view - Custom carousel */}
      <div
        className="hidden lg:block w-full relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-[1600px] mx-auto px-4"> {/* Increased max width for wider screens */}
          <div className="relative h-[360px] overflow-visible">
            {hasMounted.current && (
              <AnimatePresence
                mode="popLayout"
                initial={false}
                custom={direction}
              >
                {visibleIndices.map((testimonialIndex, i) => {
                  const testimonial = testimonials[testimonialIndex];
                  const position = i;
                  const positionData = getPositionForCard(position);

                  // Skip rendering the 4th card if screen width is less than 1400px
                  if (position === 3 && screenWidth < 1710) {
                    return null;
                  }

                  return (
                    <motion.div
                      key={testimonialIndex}
                      custom={direction}
                      initial={
                        position === 0
                          ? {
                            x: direction > 0 ? -1000 : 1000,
                            scale: 0.8,
                            opacity: 0,
                          }
                          : {}
                      }
                      animate={{
                        x: (screenWidth < 1710 ? positionData.x : positionData.x - 140),
                        y: positionData.y,
                        scale: position === 0 ? 1 : 0.75,
                        opacity: position === 0 ? 1 : 0.7,
                        zIndex: cardsToShow - position,
                      }}
                      exit={
                        position === 0
                          ? {
                            x: direction > 0 ? 1000 : -1000,
                            scale: 0.8,
                            opacity: 0,
                          }
                          : {}
                      }
                      transition={{
                        type: "spring",
                        stiffness: 150,
                        damping: 20,
                        duration: 0.5,
                      }}
                      className={`absolute top-0 left-0 w-full max-w-[520px] cursor-pointer`}
                      onClick={() => handleCardClick(testimonialIndex)}
                      whileHover={{
                        scale: position === 0 ? 1.05 : 0.8,
                        transition: { duration: 0.3, ease: "easeInOut" },
                      }}
                    >
                      <div
                        className={`bg-white rounded-[6px] shadow-md overflow-hidden ${position === 0
                          ? "border-2 border-gray-200"
                          : "border border-gray-100"
                          } transition-all duration-300 ease-in-out`}
                      >
                        <div className="flex p-4 flex-row h-full">
                          {/* Image side */}
                          <div
                            className={`relative w-[45%] h-[280px] rounded-[10px] overflow-hidden`}
                          >
                            <img
                              className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                              alt={`${testimonial.name} testimonial`}
                              src={testimonial.image}
                              width={600}
                              height={400}
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-3 px-4 transition-all duration-300 ease-in-out">
                              <div className="font-medium text-white text-lg">
                                {testimonial.name}
                              </div>
                              <div className="font-normal text-white/80 text-sm">
                                {testimonial.role}
                              </div>
                            </div>
                          </div>

                          {/* Quote side */}
                          <div
                            className={`px-3 pb-1 flex flex-col w-[60%] justify-center max-h-[400px] transition-all duration-300 ease-in-out`}
                          >
                            <div className="text-gray-200 text-6xl font-serif leading-none transition-transform duration-300 ease-in-out">
                              <img
                                src="/ci-double-quotes-l.svg"
                                alt="quote-end"
                                width={30}
                                height={30}
                                className="w-10 h-10 transition-transform duration-300 ease-in-out"
                              />
                            </div>

                            <p className="h-full font-medium text-[#222222] text-[15px] leading-loose line-clamp-[7] overflow-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] pb-0 transition-all duration-300 ease-in-out">
                              {testimonial.quote}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


