"use client";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// Removed: import Image from "next/image"; // Import next/image
import { creators } from "../data/imageCollage";

// Optimized ImageCollage component for standard React
export default function rImageCollage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [screenWidth, setScreenWidth] = useState(1200); // Default or initial estimate
  const [isVisible, setIsVisible] = useState(false);
  const [direction, setDirection] = useState(1);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const controls = useAnimation();

  // --- Hooks for screen width, visibility, interval ---
  useEffect(() => {
    const handleResize = () => {
      // Use window.innerWidth for initial and resize checks
      setScreenWidth(window.innerWidth);
    };

    // Debounce resize handler
    let debounceTimer: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleResize, 100); // Adjust debounce time as needed
    };

    // Initial measurement
    handleResize();

    window.addEventListener("resize", debouncedHandleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
      clearTimeout(debounceTimer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      controls.start("visible");
    }, 100); // Slightly longer delay can sometimes help ensure layout is stable
    return () => clearTimeout(timer);
  }, [controls]);

  // --- Box Sizes Calculation (Memoized) ---
  const originalBoxSizes = useMemo(() => [
    { width: 190, height: 260, x: -740, y: 1, zIndex: 3 },
    { width: 210, height: 300, x: -530, y: 5, zIndex: 5 },
    { width: 250, height: 360, x: -285, y: 10, zIndex: 10 },
    { width: 300, height: 420, x: 0, y: 0, zIndex: 30 },
    { width: 250, height: 360, x: 285, y: 10, zIndex: 10 },
    { width: 210, height: 300, x: 530, y: 5, zIndex: 5 },
    { width: 190, height: 260, x: 740, y: 1, zIndex: 3 },
  ], []);

  const getResponsiveBoxSizes = useCallback(() => {
    // Full 7-card display for extra large screens
    if (screenWidth >= 1600) {
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
    if (screenWidth >= 1200) {
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

    // Mobile specific adjustments (from the original provided code)
    const mobileCenterWidth = Math.max(180, Math.min(250, screenWidth * 0.6)); // Adjust center width based on screen
    const mobileSideWidth = mobileCenterWidth * 0.8;
    const mobileOuterWidth = mobileSideWidth * 0.7;
    const mobileSpacing = screenWidth < 480 ? mobileCenterWidth * 0.5 : mobileCenterWidth * 0.6;
    const aspectRatio = 1.4; // height = width * aspectRatio

    // Determine count based on screen width for mobile/small tablet
    const count = screenWidth < 480 ? 3 : 5;

    if (count === 3) {
         return [
            { width: mobileSideWidth, height: mobileSideWidth * aspectRatio, x: -mobileSpacing, y: 10, zIndex: 5, opacity: 0.92 },
            { width: mobileCenterWidth, height: mobileCenterWidth * aspectRatio, x: 0, y: 0, zIndex: 30, opacity: 1 },
            { width: mobileSideWidth, height: mobileSideWidth * aspectRatio, x: mobileSpacing, y: 10, zIndex: 5, opacity: 0.92 },
        ];
    } else { // count === 5 for smaller tablets/large phones (480px to 767px)
         return [
            { width: mobileOuterWidth, height: mobileOuterWidth * aspectRatio, x: -mobileSpacing * 1.6, y: 60, zIndex: 1, opacity: 0.85 },
            { width: mobileSideWidth, height: mobileSideWidth * aspectRatio, x: -mobileSpacing, y: 35, zIndex: 5, opacity: 0.92 },
            { width: mobileCenterWidth, height: mobileCenterWidth * aspectRatio, x: 0, y: 0, zIndex: 30, opacity: 1 },
            { width: mobileSideWidth, height: mobileSideWidth * aspectRatio, x: mobileSpacing, y: 35, zIndex: 5, opacity: 0.92 },
            { width: mobileOuterWidth, height: mobileOuterWidth * aspectRatio, x: mobileSpacing * 1.6, y: 60, zIndex: 1, opacity: 0.85 },
        ];
    }

  }, [screenWidth, originalBoxSizes]);


  // --- Interval Logic ---
  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isHovering) {
      intervalRef.current = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % creators.length);
      }, 5000); // Adjusted interval
    }
  }, [isHovering]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isHovering, startInterval]);

  // --- Navigation Logic ---
  const handleManualNavigation = useCallback((targetIndex: number) => {
    const totalItems = creators.length;
    // Ensure targetIndex is within bounds
    const normalizedTarget = (targetIndex % totalItems + totalItems) % totalItems;
    const forwardDistance = (normalizedTarget - currentIndex + totalItems) % totalItems;
    const backwardDistance = (currentIndex - normalizedTarget + totalItems) % totalItems;

    setDirection(forwardDistance <= backwardDistance ? 1 : -1);
    setCurrentIndex(normalizedTarget);
    startInterval(); // Restart interval after manual navigation
  }, [currentIndex, startInterval]);


  // --- Image Ordering Logic ---
 const getImagesInOrder = useCallback(() => {
    const boxSizes = getResponsiveBoxSizes();
    const visibleCount = boxSizes.length; // Determine count from calculated sizes
    const orderedImages = [];
    const centerIndexOffset = Math.floor(visibleCount / 2);

    for (let i = 0; i < visibleCount; i++) {
      const dataIndex = (currentIndex + i - centerIndexOffset + creators.length) % creators.length;
      orderedImages.push({
        ...creators[dataIndex], // Creator data
        ...boxSizes[i],        // Calculated size and position
        position: i,           // Position in the visible array (0 to visibleCount-1)
        dataIndex: dataIndex   // Original index in the creators array
      });
    }
    return orderedImages;
  }, [currentIndex, getResponsiveBoxSizes]);


  // --- Container Height ---
  const getContainerHeight = useCallback(() => {
    // Calculate height based on the center card's height from responsive sizes
    const boxSizes = getResponsiveBoxSizes();
    if (boxSizes.length === 0) return 400; // Default height if no sizes yet

    const centerIndex = Math.floor(boxSizes.length / 2);
    const centerCardHeight = boxSizes[centerIndex]?.height || 420; // Use center card height
    // Add some padding based on screen size
    const padding = screenWidth < 768 ? 40 : 60;
    return Math.max(300, centerCardHeight + padding); // Ensure a minimum height

  }, [getResponsiveBoxSizes, screenWidth]);


  // --- Animation Variants ---
  const pageVariants = useMemo(() => ({
    enter: (direction: number) => ({
      rotateY: direction > 0 ? 60 : -60, // Reduced rotation
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)",
      x: direction > 0 ? 100 : -100, // Add x translation
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      x: 0,
      transition: {
        duration: 0.8, // Faster transition
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1,
      },
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 60 : -60, // Reduced rotation
      opacity: 0,
      scale: 0.9,
      filter: "blur(5px)",
      x: direction < 0 ? 100 : -100, // Add x translation
      transition: {
        duration: 0.6, // Faster exit
        ease: "easeIn",
      },
    }),
  }), []);

  // --- Side Image Styling ---
  const getSideImageStyle = useCallback((position: number, totalVisible: number): React.CSSProperties => {
    const centerPosition = Math.floor(totalVisible / 2);
    const isSide = position !== centerPosition;
    const perspective = "1000px"; // Reduced perspective

    const baseStyle: React.CSSProperties = {
        perspective: perspective,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity, box-shadow", // Optimize for animations
        overflow: "hidden", // Ensure content clips correctly
        borderRadius: '0.5rem', // Match Tailwind's rounded-lg
    };

    if (!isSide) {
        // Center image - more prominent shadow
        return {
            ...baseStyle,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)", // Slightly stronger shadow
        };
    }

    // Side images - subtle shadow and potentially slight rotation/effect
    const shadowDirection = position < centerPosition ? "3px" : "-3px";
    return {
        ...baseStyle,
        boxShadow: `${shadowDirection} 0 15px rgba(0, 0, 0, 0.15)`,
        // Optional: Add subtle 3D tilt based on position if desired
        // transform: `rotateY(${position < centerPosition ? 1 : -1}deg)`
    };
  }, []);


  // --- Creator Card Component (Using standard <img>) ---
  const CreatorCard = useCallback(({ creator, isCenterCard, position }: {
    creator: typeof creators[0] & { position?: number }; // Add position to type if needed
    isCenterCard: boolean;
    position: number;
  }) => {
    const isHovered = hoveredCard === position;
    const shouldShowStats = isCenterCard || isHovered;

    // Determine text color based on background - simplified example
    const textColorClass = creator.name === "Emma Rodriguez" ? "text-white" : "text-white"; // Default to white

    return (
      // Added relative positioning and z-index to ensure content is above the background image
      <div className="relative z-10 w-full h-full  max-w-[1800px] flex flex-col justify-between p-3 md:p-4">
        {/* Creator info */}
        <div className="flex flex-row items-center space-x-2 md:space-x-3">
          {/* Use standard img for avatar */}
          <motion.div
             initial={false}
             animate={{ scale: 1, opacity: 1 }}
             className="relative h-8 w-8 md:h-10 md:w-10 rounded-full border-2 border-purple-300 overflow-hidden shadow-glow flex-shrink-0" // Added overflow-hidden
          >
            {/* Standard HTML img tag */}
            <img
              alt={`${creator.name} avatar`}
              src={creator.image} // Assuming creator.image is the correct path
              className="h-full w-full object-cover" // Ensure image covers the div
              loading="lazy" // Add lazy loading for avatars
            />
          </motion.div>
          <div className="flex flex-col overflow-hidden"> {/* Prevent text overflow */}
            <p className={`font-semibold text-xs md:text-sm ${textColorClass} truncate`}> {/* Added truncate */}
              {creator.name}
            </p>
            <p className="text-xs text-purple-200 truncate">{creator.category}</p> {/* Added truncate */}
          </div>
        </div>

        {/* Bottom section: Description and Stats */}
        <div className="space-y-1 md:space-y-2">
          <p className={`font-normal text-xs ${textColorClass} opacity-90 line-clamp-2`}>
            {creator.description}
          </p>

          <AnimatePresence>
            {shouldShowStats && (
              <motion.div
                className={`flex flex-row justify-between text-xs ${textColorClass} opacity-80`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } }}
                exit={{ opacity: 0, y: 5, transition: { duration: 0.2, ease: "easeIn" } }}
              >
                {/* Simplified Stats Display */}
                {(['followers', 'subscribers', 'likes'] as const).map(stat => (
                   <div key={stat} className="flex flex-col items-center text-center px-1">
                     <span className="font-bold">{creator[stat]}</span>
                     <span className="capitalize text-[10px] md:text-xs">{stat}</span>
                   </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }, [hoveredCard]); // Dependency on hoveredCard

  // --- Main Render ---
  const imagesToRender = getImagesInOrder(); // Calculate once per render
  const containerHeight = getContainerHeight(); // Calculate once per render

  return (
    <motion.section
      className="w-full max-w-[1800px] py-4 bg-transparent mb-4 overflow-hidden mx-auto"
      // Simplified initial animation
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div
        ref={containerRef}
        className="flex justify-center items-center relative w-full" // Added items-center
        style={{
          height: `${containerHeight}px`, // Use calculated height
          perspective: "1200px", // Apply perspective here
        }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          {imagesToRender.map((item) => {
            const isCenterImage = item.position === Math.floor(imagesToRender.length / 2);
            const adjustedZIndex = isCenterImage ? 50 : item.zIndex;

            return (
              <motion.div
                key={`creator-card-${item.dataIndex}`} // Use a more stable key if possible
                layout // Enable layout animations
                className="absolute group cursor-pointer bg-cover bg-center rounded-lg" // Added bg-cover, bg-center, rounded-lg here
                style={{
                  ...getSideImageStyle(item.position, imagesToRender.length), // Pass total visible count
                  width: item.width,
                  height: item.height,
                  zIndex: adjustedZIndex,
                  backgroundImage: `url(${item.background})`, // Set background image via style
                  // Apply x/y transforms via motion props for better animation
                }}
                initial="enter"
                animate={{
                    ...pageVariants.center, // Use center state from variants
                    x: item.x, // Apply calculated x/y here
                    y: item.y,
                    opacity: item.opacity, // Apply opacity
                    scale: 1, // Ensure scale is reset correctly
                    rotateY: 0, // Ensure rotation is reset correctly
                }}
                exit="exit"
                custom={direction}
                variants={pageVariants} // Use defined variants
                 transition={{ // Fine-tune transitions
                  x: { type: "spring", stiffness: 120, damping: 25, mass: 1 },
                  y: { type: "spring", stiffness: 120, damping: 25, mass: 1 },
                  width: { duration: 0.5, ease: "circOut" },
                  height: { duration: 0.5, ease: "circOut" },
                  opacity: { duration: 0.4, ease: "linear" },
                }}
                onMouseEnter={() => { setIsHovering(true); setHoveredCard(item.position); }}
                onMouseLeave={() => { setIsHovering(false); setHoveredCard(null); }}
                onClick={() => handleManualNavigation(item.dataIndex)} // Navigate to the clicked item's original index
                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }} // Simplified hover/tap variants
                whileTap={{ scale: 0.98, transition: { duration: 0.2 } }}
              >
                {/* Background Image is now set via style prop above */}

                {/* Creator Card Content */}
                <CreatorCard
                  creator={item}
                  isCenterCard={isCenterImage}
                  position={item.position}
                />

                {/* Optional: Subtle Effects (keep them minimal for performance) */}
                {/* Page Fold Effect */}
                {!isCenterImage && (
                  <motion.div
                    className={`absolute top-0 bottom-0 w-[10px] ${item.position < Math.floor(imagesToRender.length / 2) ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
                    aria-hidden="true"
                  />
                )}

                {/* Hover Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-lg" // Added rounded-lg here too
                   initial={{ backgroundPosition: "200% 200%" }}
                   animate={{ backgroundPosition: "-100% -100%" }}
                   transition={{ duration: 1.5, ease: "linear", delay: 0.1 }}
                   aria-hidden="true"
                />

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}





































// "use client";
// import { motion, AnimatePresence, useAnimation } from "framer-motion";
// import { useState, useEffect, useRef, useCallback, useMemo } from "react";
// import { creators } from "../data/imageCollage";



// // in mobile the images are not getting displayed properly
// export default function ImageCollage() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isHovering, setIsHovering] = useState(false);
//   const [screenWidth, setScreenWidth] = useState(1200);
//   const [isVisible, setIsVisible] = useState(false);
//   const [direction, setDirection] = useState(1); // Track animation direction
//   const [hoveredCard, setHoveredCard] = useState<number | null>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
//   const intervalRef = useRef<NodeJS.Timeout | null>(null);
//   const controls = useAnimation();

//   // Update screen width on resize with improved debounce for performance
//   useEffect(() => {
//     let debounceTimer: NodeJS.Timeout;

//     const handleResize = () => {
//       clearTimeout(debounceTimer);
//       debounceTimer = setTimeout(() => {
//         if (containerRef.current) {
//           setScreenWidth(containerRef.current.offsetWidth);
//         }
//       }, 50); // Reduced debounce time for more responsive resizing
//     };

//     // Initial measurement
//     handleResize();

//     // Add passive resize listener for better performance
//     window.addEventListener("resize", handleResize, { passive: true });
//     return () => {
//       window.removeEventListener("resize", handleResize);
//       clearTimeout(debounceTimer);
//     };
//   }, []);

//   // Set visibility after component mounts for fade-in animation
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setIsVisible(true);
//       controls.start("visible");
//     }, 50); // Reduced delay for faster initial render
//     return () => clearTimeout(timer);
//   }, [controls]);

//   // Original box sizes for normal screens - improved z-index values for proper layering
//   const originalBoxSizes = useMemo(() => [
//     // Now we include the outer cards for large screens
//     { width: 200, height: 260, x: -770, y: 70, zIndex: 3 },
//     { width: 220, height: 300, x: -550, y: 50, zIndex: 5 },
//     { width: 260, height: 360, x: -300, y: 25, zIndex: 10 },
//     { width: 300, height: 420, x: 0, y: 0, zIndex: 30 },
//     { width: 260, height: 360, x: 300, y: 25, zIndex: 10 },
//     { width: 220, height: 300, x: 550, y: 50, zIndex: 5 },
//     { width: 200, height: 260, x: 770, y: 70, zIndex: 3 },
//   ], []);

//   // Calculate responsive box sizes based on screen width with improved precision
//   const getResponsiveBoxSizes = useCallback(() => {
//     // Full 7-card display for extra large screens
//     if (screenWidth >= 1400) {
//       const scale = Math.min(1, screenWidth / 1800);
//       return originalBoxSizes.map((box) => ({
//         width: Math.round(box.width * scale),
//         height: Math.round(box.height * scale),
//         x: Math.round(box.x * scale),
//         y: Math.round(box.y * scale),
//         zIndex: box.zIndex,
//         opacity: 1,
//       }));
//     }
    
//     // 5-card display for desktop/laptop
//     if (screenWidth >= 768) {
//       const scale = Math.min(1, screenWidth / 1400);
//       return originalBoxSizes.slice(1, 6).map((box) => ({
//         width: Math.round(box.width * scale),
//         height: Math.round(box.height * scale),
//         x: Math.round(box.x * scale),
//         y: Math.round(box.y * scale),
//         zIndex: box.zIndex,
//         opacity: 1,
//       }));
//     }

//     const minCenterWidth = 220;
//     const minSideWidth = 180;
//     const minOuterWidth = 100;
//     const spacing = screenWidth < 480 ? 95 : 160;

//     if (screenWidth < 480) {
//       return [
//         { width: minSideWidth, height: minSideWidth * 1.4, x: -spacing, y: 40, zIndex: 5, opacity: 0.92 },
//         { width: minCenterWidth, height: minCenterWidth * 1.4, x: 0, y: 0, zIndex: 30, opacity: 1 },
//         { width: minSideWidth, height: minSideWidth * 1.4, x: spacing, y: 40, zIndex: 5, opacity: 0.92 },
//       ];
//     } else {
//       return [
//         { width: minOuterWidth, height: minOuterWidth * 1.4, x: -spacing * 1.6, y: 80, zIndex: 1, opacity: 0.85 },
//         { width: minSideWidth, height: minSideWidth * 1.4, x: -spacing, y: 45, zIndex: 5, opacity: 0.92 },
//         { width: minCenterWidth + 30, height: (minCenterWidth + 30) * 1.4, x: 0, y: 0, zIndex: 30, opacity: 1 },
//         { width: minSideWidth, height: minSideWidth * 1.4, x: spacing, y: 45, zIndex: 5, opacity: 0.92 },
//         { width: minOuterWidth, height: minOuterWidth * 1.4, x: spacing * 1.6, y: 80, zIndex: 1, opacity: 0.85 },
//       ];
//     }
//   }, [screenWidth, originalBoxSizes]);

//   const startInterval = useCallback(() => {
//     if (intervalRef.current) clearInterval(intervalRef.current);

//     // Only start auto-rotate when not hovering over any card
//     if (!isHovering) {
//       intervalRef.current = setInterval(() => {
//         setDirection(1); // Forward direction for auto-advance
//         setCurrentIndex((prevIndex) => (prevIndex + 1) % creators.length);
//       }, 8000); // Longer interval for better visibility and smoother transitions
//     }
//   }, [isHovering]);

//   // Handle auto-rotation and hovering
//   useEffect(() => {
//     startInterval();
//     return () => {
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, [isHovering, startInterval]);

//   const handleManualNavigation = useCallback((index: number) => {
//     // Calculate the shortest path to the target index
//     const totalItems = creators.length;
//     const forwardDistance = (index - currentIndex + totalItems) % totalItems;
//     const backwardDistance = (currentIndex - index + totalItems) % totalItems;

//     // Set direction based on shortest path
//     setDirection(forwardDistance <= backwardDistance ? 1 : -1);
//     setCurrentIndex(index);

//     // Reset the timer when manually navigating
//     if (intervalRef.current) {
//       clearInterval(intervalRef.current);
//     }

//     // Restart the interval
//     startInterval();
//   }, [currentIndex, startInterval]);

//   const getImagesInOrder = useCallback(() => {
//     const boxSizes = getResponsiveBoxSizes();
//     let visibleCount;
    
//     if (screenWidth >= 1400) {
//       visibleCount = 7; // 7 cards for extra large screens
//     } else if (screenWidth >= 768) {
//       visibleCount = 5; // 5 cards for desktop/laptop
//     } else {
//       visibleCount = screenWidth < 480 ? 3 : 5; // 3 cards for mobile
//     }
    
//     const orderedImages = [];

//     for (let i = 0; i < visibleCount; i++) {
//       const index = (currentIndex + i - Math.floor(visibleCount / 2) + creators.length) % creators.length;
//       orderedImages.push({
//         ...creators[index],
//         ...boxSizes[i],
//         position: i,
//       });
//     }

//     return orderedImages;
//   }, [currentIndex, getResponsiveBoxSizes, screenWidth]);

//   const getContainerHeight = useCallback(() => {
//     if (screenWidth >= 1400) {
//       return 480; // Slightly taller for extra large screens
//     } else if (screenWidth >= 768) {
//       return 450;
//     }
//     return screenWidth < 480 ? 320 : 380;
//   }, [screenWidth]);

//   // Enhanced book page turning animation variants with improved smoothness
//   const pageVariants = {
//     enter: (direction: number) => ({
//       rotateY: direction > 0 ? 90 : -90,
//       opacity: 0,
//       scale: 0.85,
//       filter: "blur(8px)",
//     }),
//     center: {
//       rotateY: 0,
//       opacity: 1, // Full opacity for center position
//       scale: 1,
//       filter: "blur(0px)",
//       transition: {
//         duration: 1.5, // Increased duration for smoother motion
//         type: "spring",
//         stiffness: 60, // Reduced stiffness for smoother motion
//         damping: 16, // Increased damping for less oscillation
//         mass: 1.3, // Added more mass for more natural physics
//         ease: "easeInOut", // Added easing for smoother transitions
//       },
//     },
//     exit: (direction: number) => ({
//       rotateY: direction < 0 ? 90 : -90,
//       opacity: 0,
//       scale: 0.85,
//       filter: "blur(8px)",
//       transition: {
//         duration: 1.2, // Increased duration for smoother exit
//         ease: [0.32, 0.72, 0.24, 1], // Enhanced custom easing for smoother exit
//       },
//     }),
//   };

//   // Enhanced animation variants for hover effects with improved smoothness
//   const imageVariants = {
//     initial: {
//       scale: 1,
//       boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
//     },
//     hover: {
//       scale: 1.08,
//       boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.2)",
//       transition: {
//         duration: 0.8, // Increased duration for smoother hover
//         ease: [0.2, 0.1, 0.3, 1], // Enhanced cubic bezier for smoother easing
//       },
//     },
//     tap: {
//       scale: 0.97,
//       boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)",
//       transition: {
//         duration: 0.4, // Increased duration for smoother tap
//         ease: [0.35, 0, 0.25, 1], // Enhanced material design easing for smoother tap
//       },
//     },
//   };

//   // Enhanced page curl effect for side images
//   const getSideImageStyle = useCallback((position: number): React.CSSProperties => {
//     // Center position calculation
//     const visibleCount = screenWidth >= 1400 ? 7 : (screenWidth >= 768 ? 5 : (screenWidth < 480 ? 3 : 5));
//     const centerPosition = Math.floor(visibleCount / 2);
    
//     if (position < centerPosition) {
//       // Left side images
//       return {
//         perspective: "1200px",
//         transformStyle: "preserve-3d",
//         boxShadow: "5px 0 20px rgba(0, 0, 0, 0.15)",
//         borderRight: "1px solid rgba(255, 255, 255, 0.3)",
//         backdropFilter: "blur(4px)",
//         willChange: "transform", // Performance optimization
//       };
//     } else if (position > centerPosition) {
//       // Right side images
//       return {
//         perspective: "1200px",
//         transformStyle: "preserve-3d",
//         boxShadow: "-5px 0 20px rgba(0, 0, 0, 0.15)",
//         borderLeft: "1px solid rgba(255, 255, 255, 0.3)",
//         backdropFilter: "blur(4px)",
//         willChange: "transform", // Performance optimization
//       };
//     }
//     // Center image
//     return {
//       perspective: "1200px",
//       transformStyle: "preserve-3d",
//       boxShadow: "0 0 30px rgba(0, 0, 0, 0.2)",
//       willChange: "transform", // Performance optimization
//     };
//   }, [screenWidth]);

//   const CreatorCard = useCallback(({ creator, isCenterCard, position }: {
//     creator: typeof creators[0],
//     isCenterCard: boolean,
//     position: number
//   }) => {
//     const isHovered = hoveredCard === position;
//     const shouldShowStats = isCenterCard || isHovered;

//     return (
//       <div className="w-full h-full overflow-hidden relative flex flex-col justify-between p-4 bg-cover">
//         {/* Creator info - always visible with persistant animations */}
//         <div className="flex flex-row items-center space-x-3 z-10">
//           <motion.img
//             initial={false}
//             animate={{ scale: 1, opacity: 1 }}
//             alt={creator.name}
//             src={creator.image}
//             className="h-10 w-10 rounded-full border-2 border-purple-300 object-cover shadow-glow"
//           />
//           <div className="flex flex-col">
//             <p className={`font-semibold text-sm text-white relative z-10`}>
//               {creator.name}
//             </p>
//             <p className="text-xs text-purple-200">{creator.category}</p>
//           </div>
//         </div>

//         <div className="z-10 space-y-2">
//           {/* Description - always visible but truncated */}
//           <p className="font-normal text-xs text-gray-100 line-clamp-2">
//             {creator.description}
//           </p>

//           {/* Stats section - conditionally shown */}
//           <AnimatePresence>
//             {shouldShowStats && (
//               <motion.div
//                 className="flex flex-row justify-between text-xs text-gray-300"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{
//                   opacity: 1,
//                   y: 0,
//                   transition: {
//                     type: "spring",
//                     stiffness: 500,
//                     damping: 30,
//                     mass: 1
//                   }
//                 }}
//                 exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
//               >
//                 <div className="flex flex-col items-center">
//                   <span className={`font-bold ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>
//                     {creator.followers}
//                   </span>
//                   <span className={`  ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

//                     Followers</span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                 <span className={`font-bold ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

//                     {creator.subscribers}
//                   </span>
//                   <span className={`  ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

//                     Subscribers</span>
//                 </div>
//                 <div className="flex flex-col items-center">
//                 <span className={`font-bold ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>

//                     {creator.likes}
//                   </span>
//                   <span className={`  ${creator.name === "Emma Rodriguez" ? "text-white" : "text-white"}`}>
                  
//                   Likes</span>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     );
//   }, [hoveredCard]);

//   return (
//     <motion.section
//       className="w-full max-w-[1800px] py-4 bg-transparent mb-4 overflow-hidden mx-auto"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{
//         opacity: isVisible ? 1 : 0,
//         y: isVisible ? 0 : 50
//       }}
//       transition={{
//         duration: 1.6, // Increased duration
//         ease: [0.2, 0.65, 0.3, 0.9], // Enhanced custom cubic-bezier for smoother easing
//         delay: 0.2
//       }}
//     >
    
//       <div
//         ref={containerRef}
//         className="flex justify-center pt-1 relative w-full"
//         style={{
//           height: `${getContainerHeight()}px`,
//           perspective: "1800px"
//         }}
//       >
//         <AnimatePresence initial={false} custom={direction} mode="popLayout">
//           {getImagesInOrder().map((item, index) => {
//             const visibleCount = screenWidth >= 1400 ? 7 : (screenWidth >= 768 ? 5 : (screenWidth < 480 ? 3 : 5));
//             const centerPosition = Math.floor(visibleCount / 2);
//             const isCenterImage = item.position === centerPosition;
//             const adjustedZIndex = isCenterImage ? 50 : item.zIndex;

//             return (
//               <motion.div
//                 key={`creator-position-${item.position}`}
//                 className="absolute rounded-lg overflow-hidden lg:mt-4 shadow-lg border border-gray-300 group"
//                 style={{
//                   ...getSideImageStyle(item.position),
//                   transformOrigin: item.position < centerPosition ? "right center" : item.position > centerPosition ? "left center" : "center",
//                   opacity: item.opacity,
//                   width: item.width,
//                   height: item.height,
//                   zIndex: adjustedZIndex,
//                   x: item.x,
//                   y: item.y,
//                   backgroundImage: `url(${item.background})`,
//                   backgroundSize: 'cover',
//                   backgroundPosition: 'center',
//                   visibility: "visible",
//                 }}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 custom={direction}
//                 variants={pageVariants}
//                 transition={{
//                   x: { type: "spring", stiffness: 180, damping: 28, mass: 1.2, ease: "easeInOut" },
//                   y: { type: "spring", stiffness: 180, damping: 28, mass: 1.2, ease: "easeInOut" },
//                   width: { duration: 0.9, ease: [0.4, 0.0, 0.2, 1] },
//                   height: { duration: 0.9, ease: [0.4, 0.0, 0.2, 1] },
//                   opacity: { duration: 0.9, delay: 0.04 * index, ease: "easeInOut" },
//                 }}
//                 onMouseEnter={() => {
//                   setIsHovering(true);
//                   setHoveredCard(item.position);
//                 }}
//                 onMouseLeave={() => {
//                   setIsHovering(false);
//                   setHoveredCard(null);
//                 }}
//                 onClick={() => handleManualNavigation((currentIndex + item.position - centerPosition + creators.length) % creators.length)}
//                 whileHover={imageVariants.hover}
//                 whileTap={imageVariants.tap}
//               >
//                 <CreatorCard
//                   creator={item}
//                   isCenterCard={isCenterImage}
//                   position={item.position}
//                 />

//                 {/* Card loading pulse effect */}
//                 <motion.div
//                   className="absolute inset-0 bg-white z-20"
//                   initial={{ opacity: 0.6 }}
//                   animate={{ opacity: 0 }}
//                   transition={{ duration: 1.2, ease: "easeOut" }}
//                 />

//                 {/* Enhanced page fold effect */}
//                 {!isCenterImage && (
//                   <motion.div
//                     className={`absolute top-0 bottom-0 w-[15px] ${item.position < centerPosition ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'} from-black/15 to-transparent`}
//                     initial={{ opacity: 0.2 }}
//                     animate={{
//                       opacity: [0.2, 0.3, 0.2],
//                       x: item.position < centerPosition ? [0, -2, 0] : [0, 2, 0]
//                     }}
//                     transition={{
//                       duration: 4.5, // Increased duration for smoother animation
//                       repeat: Infinity,
//                       repeatType: "mirror",
//                       ease: "easeInOut",
//                     }}
//                   />
//                 )}

//                 {/* Improved subtle shine effect */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
//                   initial={{ opacity: 0 }}
//                   animate={{
//                     opacity: [0, 0.15, 0], // Increased opacity for more visible effect
//                     backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
//                   }}
//                   transition={{
//                     duration: 8, // Increased duration for smoother animation
//                     repeat: Infinity,
//                     repeatType: "loop",
//                     ease: "easeInOut",
//                   }}
//                 />

//                 {/* Extra hover shine effect */}
//                 <motion.div
//                   className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-blue-500/10 pointer-events-none opacity-0 group-hover:opacity-100"
//                   animate={{
//                     backgroundPosition: ["0% 0%", "100% 100%"],
//                   }}
//                   transition={{
//                     duration: 3,
//                     repeat: Infinity,
//                     repeatType: "reverse",
//                     ease: "easeInOut",
//                   }}
//                 />
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>

//     </motion.section>
//   );
// }




















