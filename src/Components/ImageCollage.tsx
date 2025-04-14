"use client";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { creators } from "../data/imageCollage";



// in mobile the images are not getting displayed properly
export default function ImageCollage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200);
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState(1); // Track animation direction
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  // Update screen width on resize with improved debounce for performance
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (containerRef.current) {
          setScreenWidth(containerRef.current.offsetWidth);
        }
      }, 50); // Reduced debounce time for more responsive resizing
    };

    // Initial measurement
    handleResize();

    // Add passive resize listener for better performance
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(debounceTimer);
    };
  }, []);

  // Set visibility after component mounts for fade-in animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      controls.start("visible");
    }, 50); // Reduced delay for faster initial render
    return () => clearTimeout(timer);
  }, [controls]);

  // Original box sizes for normal screens - improved z-index values for proper layering
  const originalBoxSizes = useMemo(() => [
    // Now we include the outer cards for large screens
    { width: 200, height: 260, x: -770, y: 70, zIndex: 3 },
    { width: 220, height: 300, x: -550, y: 50, zIndex: 5 },
    { width: 260, height: 360, x: -300, y: 25, zIndex: 10 },
    { width: 300, height: 420, x: 0, y: 0, zIndex: 30 },
    { width: 260, height: 360, x: 300, y: 25, zIndex: 10 },
    { width: 220, height: 300, x: 550, y: 50, zIndex: 5 },
    { width: 200, height: 260, x: 770, y: 70, zIndex: 3 },
  ], []);

  // Calculate responsive box sizes based on screen width with improved precision
  const getResponsiveBoxSizes = useCallback(() => {
    // Full 7-card display for extra large screens
    if (screenWidth >= 1400) {
      const scale = Math.min(1, screenWidth / 1800);
      return originalBoxSizes.map((box) => ({
        width: Math.round(box.width * scale),
        height: Math.round(box.height * scale),
        x: Math.round(box.x * scale),
        y: Math.round(box.y * scale),
        zIndex: box.zIndex,
        opacity: 1,
      }));
    }
    
    // 5-card display for desktop/laptop
    if (screenWidth >= 768) {
      const scale = Math.min(1, screenWidth / 1400);
      return originalBoxSizes.slice(1, 6).map((box) => ({
        width: Math.round(box.width * scale),
        height: Math.round(box.height * scale),
        x: Math.round(box.x * scale),
        y: Math.round(box.y * scale),
        zIndex: box.zIndex,
        opacity: 1,
      }));
    }

    const minCenterWidth = 220;
    const minSideWidth = 180;
    const minOuterWidth = 100;
    const spacing = screenWidth < 480 ? 95 : 160;

    if (screenWidth < 480) {
      return [
        { width: minSideWidth, height: minSideWidth * 1.4, x: -spacing, y: 40, zIndex: 5, opacity: 0.92 },
        { width: minCenterWidth, height: minCenterWidth * 1.4, x: 0, y: 0, zIndex: 30, opacity: 1 },
        { width: minSideWidth, height: minSideWidth * 1.4, x: spacing, y: 40, zIndex: 5, opacity: 0.92 },
      ];
    } else {
      return [
        { width: minOuterWidth, height: minOuterWidth * 1.4, x: -spacing * 1.6, y: 80, zIndex: 1, opacity: 0.85 },
        { width: minSideWidth, height: minSideWidth * 1.4, x: -spacing, y: 45, zIndex: 5, opacity: 0.92 },
        { width: minCenterWidth + 30, height: (minCenterWidth + 30) * 1.4, x: 0, y: 0, zIndex: 30, opacity: 1 },
        { width: minSideWidth, height: minSideWidth * 1.4, x: spacing, y: 45, zIndex: 5, opacity: 0.92 },
        { width: minOuterWidth, height: minOuterWidth * 1.4, x: spacing * 1.6, y: 80, zIndex: 1, opacity: 0.85 },
      ];
    }
  }, [screenWidth, originalBoxSizes]);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    // Only start auto-rotate when not hovering over any card
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setDirection(1); // Forward direction for auto-advance
        setCurrentIndex((prevIndex) => (prevIndex + 1) % creators.length);
      }, 8000); // Longer interval for better visibility and smoother transitions
    }
  }, [isHovering]);

  // Handle auto-rotation and hovering
  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovering, startInterval]);

  const handleManualNavigation = useCallback((index: number) => {
    // Calculate the shortest path to the target index
    const totalItems = creators.length;
    const forwardDistance = (index - currentIndex + totalItems) % totalItems;
    const backwardDistance = (currentIndex - index + totalItems) % totalItems;

    // Set direction based on shortest path
    setDirection(forwardDistance <= backwardDistance ? 1 : -1);
    setCurrentIndex(index);

    // Reset the timer when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Restart the interval
    startInterval();
  }, [currentIndex, startInterval]);

  const getImagesInOrder = useCallback(() => {
    const boxSizes = getResponsiveBoxSizes();
    let visibleCount;
    
    if (screenWidth >= 1400) {
      visibleCount = 7; // 7 cards for extra large screens
    } else if (screenWidth >= 768) {
      visibleCount = 5; // 5 cards for desktop/laptop
    } else {
      visibleCount = screenWidth < 480 ? 3 : 5; // 3 cards for mobile
    }
    
    const orderedImages = [];

    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i - Math.floor(visibleCount / 2) + creators.length) % creators.length;
      orderedImages.push({
        ...creators[index],
        ...boxSizes[i],
        position: i,
      });
    }

    return orderedImages;
  }, [currentIndex, getResponsiveBoxSizes, screenWidth]);

  const getContainerHeight = useCallback(() => {
    if (screenWidth >= 1400) {
      return 480; // Slightly taller for extra large screens
    } else if (screenWidth >= 768) {
      return 450;
    }
    return screenWidth < 480 ? 320 : 380;
  }, [screenWidth]);

  // Enhanced book page turning animation variants with improved smoothness
  const pageVariants = {
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 90 : -90,
      opacity: 0,
      scale: 0.85,
      filter: "blur(8px)",
    }),
    center: {
      rotateY: 0,
      opacity: 1, // Full opacity for center position
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1.5, // Increased duration for smoother motion
        type: "spring",
        stiffness: 60, // Reduced stiffness for smoother motion
        damping: 16, // Increased damping for less oscillation
        mass: 1.3, // Added more mass for more natural physics
        ease: "easeInOut", // Added easing for smoother transitions
      },
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      opacity: 0,
      scale: 0.85,
      filter: "blur(8px)",
      transition: {
        duration: 1.2, // Increased duration for smoother exit
        ease: [0.32, 0.72, 0.24, 1], // Enhanced custom easing for smoother exit
      },
    }),
  };

  // Enhanced animation variants for hover effects with improved smoothness
  const imageVariants = {
    initial: {
      scale: 1,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    },
    hover: {
      scale: 1.08,
      boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
      transition: {
        duration: 0.8, // Increased duration for smoother hover
        ease: [0.2, 0.1, 0.3, 1], // Enhanced cubic bezier for smoother easing
      },
    },
    tap: {
      scale: 0.97,
      boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.4, // Increased duration for smoother tap
        ease: [0.35, 0, 0.25, 1], // Enhanced material design easing for smoother tap
      },
    },
  };

  // Enhanced page curl effect for side images
  const getSideImageStyle = useCallback((position: number): React.CSSProperties => {
    // Center position calculation
    const visibleCount = screenWidth >= 1400 ? 7 : (screenWidth >= 768 ? 5 : (screenWidth < 480 ? 3 : 5));
    const centerPosition = Math.floor(visibleCount / 2);
    
    if (position < centerPosition) {
      // Left side images
      return {
        perspective: "1200px",
        transformStyle: "preserve-3d",
        boxShadow: "5px 0 20px rgba(0, 0, 0, 0.15)",
        borderRight: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(4px)",
        willChange: "transform", // Performance optimization
      };
    } else if (position > centerPosition) {
      // Right side images
      return {
        perspective: "1200px",
        transformStyle: "preserve-3d",
        boxShadow: "-5px 0 20px rgba(0, 0, 0, 0.15)",
        borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(4px)",
        willChange: "transform", // Performance optimization
      };
    }
    // Center image
    return {
      perspective: "1200px",
      transformStyle: "preserve-3d",
      boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
      willChange: "transform", // Performance optimization
    };
  }, [screenWidth]);

  const CreatorCard = useCallback(({ creator, isCenterCard, position }: {
    creator: typeof creators[0],
    isCenterCard: boolean,
    position: number
  }) => {
    const isHovered = hoveredCard === position;
    const shouldShowStats = isCenterCard || isHovered;

    return (
      <div className="w-full h-full overflow-hidden relative flex flex-col justify-between p-4 bg-cover">
        {/* Creator info - always visible with persistant animations */}
        <div className="flex flex-row items-center space-x-3 z-10">
          <motion.img
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            alt={creator.name}
            src={creator.image}
            className="h-10 w-10 rounded-full border-2 border-purple-300 object-cover shadow-glow"
          />
          <div className="flex flex-col">
            <p className={`font-semibold text-sm text-white relative z-10`}>
              {creator.name}
            </p>
            <p className="text-xs text-purple-200">{creator.category}</p>
          </div>
        </div>

        <div className="z-10 space-y-2">
          {/* Description - always visible but truncated */}
          <p className="font-normal text-xs text-gray-100 line-clamp-2">
            {creator.description}
          </p>

          {/* Stats section - conditionally shown */}
          <AnimatePresence>
            {shouldShowStats && (
              <motion.div
                className="flex flex-row justify-between text-xs text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                    mass: 1
                  }
                }}
                exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
              >
                <div className="flex flex-col items-center">
                  <span className={`font-bold ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>
                    {creator.followers}
                  </span>
                  <span className={`  ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

                    Followers</span>
                </div>
                <div className="flex flex-col items-center">
                <span className={`font-bold ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

                    {creator.subscribers}
                  </span>
                  <span className={`  ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

                    Subscribers</span>
                </div>
                <div className="flex flex-col items-center">
                <span className={`font-bold ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

                    {creator.likes}
                  </span>
                  <span className={`  ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>
                  
                  Likes</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }, [hoveredCard]);

  return (
    <motion.section
      className="w-full max-w-[1800px] py-4 bg-transparent mb-4 overflow-hidden mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 50
      }}
      transition={{
        duration: 1.6, // Increased duration
        ease: [0.2, 0.65, 0.3, 0.9], // Enhanced custom cubic-bezier for smoother easing
        delay: 0.2
      }}
    >
    
      <div
        ref={containerRef}
        className="flex justify-center pt-1 relative w-full"
        style={{
          height: `${getContainerHeight()}px`,
          perspective: "1800px"
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {getImagesInOrder().map((item, index) => {
            const visibleCount = screenWidth >= 1400 ? 7 : (screenWidth >= 768 ? 5 : (screenWidth < 480 ? 3 : 5));
            const centerPosition = Math.floor(visibleCount / 2);
            const isCenterImage = item.position === centerPosition;
            const adjustedZIndex = isCenterImage ? 50 : item.zIndex;

            return (
              <motion.div
                key={`creator-position-${item.position}`}
                className="absolute rounded-lg overflow-hidden lg:mt-4 shadow-lg border border-gray-300 group"
                style={{
                  ...getSideImageStyle(item.position),
                  transformOrigin: item.position < centerPosition ? "right center" : item.position > centerPosition ? "left center" : "center",
                  opacity: item.opacity,
                  width: item.width,
                  height: item.height,
                  zIndex: adjustedZIndex,
                  x: item.x,
                  y: item.y,
                  backgroundImage: `url(${item.background})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  visibility: "visible",
                }}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                variants={pageVariants}
                transition={{
                  x: { type: "spring", stiffness: 180, damping: 28, mass: 1.2, ease: "easeInOut" },
                  y: { type: "spring", stiffness: 180, damping: 28, mass: 1.2, ease: "easeInOut" },
                  width: { duration: 0.9, ease: [0.4, 0.0, 0.2, 1] },
                  height: { duration: 0.9, ease: [0.4, 0.0, 0.2, 1] },
                  opacity: { duration: 0.9, delay: 0.04 * index, ease: "easeInOut" },
                }}
                onMouseEnter={() => {
                  setIsHovering(true);
                  setHoveredCard(item.position);
                }}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setHoveredCard(null);
                }}
                onClick={() => handleManualNavigation((currentIndex + item.position - centerPosition + creators.length) % creators.length)}
                whileHover={imageVariants.hover}
                whileTap={imageVariants.tap}
              >
                <CreatorCard
                  creator={item}
                  isCenterCard={isCenterImage}
                  position={item.position}
                />

                {/* Card loading pulse effect */}
                <motion.div
                  className="absolute inset-0 bg-white z-20"
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />

                {/* Enhanced page fold effect */}
                {!isCenterImage && (
                  <motion.div
                    className={`absolute top-0 bottom-0 w-[15px] ${item.position < centerPosition ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/15 to-transparent`}
                    initial={{ opacity: 0.2 }}
                    animate={{
                      opacity: [0.2, 0.3, 0.2],
                      x: item.position < centerPosition ? [0, -2, 0] : [0, 2, 0]
                    }}
                    transition={{
                      duration: 4.5, // Increased duration for smoother animation
                      repeat: Infinity,
                      repeatType: "mirror",
                      ease: "easeInOut",
                    }}
                  />
                )}

                {/* Improved subtle shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.15, 0], // Increased opacity for more visible effect
                    backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                  }}
                  transition={{
                    duration: 8, // Increased duration for smoother animation
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                  }}
                />

                {/* Extra hover shine effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none opacity-0 group-hover:opacity-100"
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </motion.section>
  );
}




















