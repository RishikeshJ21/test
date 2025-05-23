
import { useState, useEffect, useMemo } from "react";
import { Button } from "../SubComponents/button";
import { AnimatedTooltip } from "../SubComponents/ui/animated-tooltip";
import { people } from "../data/data";
import { motion } from "framer-motion";

export default function Hero({ title, description, buttonText }: { title: { t1: string; t2: string; t3: string; t4: string }, description: string, buttonText: string }) {
  // Properly initialize state hooks with default values to avoid layout shifts
  const [pathname, setPathname] = useState("/");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Data for star rating - predefine this outside the component for better performance
  const stars = useMemo(() => Array(5).fill({ src: "/svg.svg", alt: "Star rating" }), []);

  // Safe handling of browser APIs in useEffect
  useEffect(() => {
    // Safely set the initial pathname
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }

    // Handle mouse movement - but only after critical content is loaded
    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        setMousePosition({ x: e.clientX, y: e.clientY });
      });
    };

    // Add event listener safely, but with a slight delay to prioritize LCP
    let mouseMoveTimer: number;
    if (typeof window !== 'undefined') {
      mouseMoveTimer = window.setTimeout(() => {
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
      }, 1000); // Delay adding mouse movement handler
    }

    // Clean up
    return () => {
      window.clearTimeout(mouseMoveTimer);
      if (typeof window !== 'undefined') {
        window.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // Optimize the headline rendering to prioritize LCP
  const renderHeadline = () => {
    if (pathname !== "/") {
      return (
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-1 max-w-5xl">
          <span className="text-black">{title.t1} </span>
          <span className="text-[#4e1f88]">{title.t2} </span>
          <span className="text-black">{title.t3} </span>
          <span className="text-[#4e1f88]">{title.t4}</span>
        </h1>
      );
    }
    
    return (
      <>
        <div className="whitespace-nowrap">
          <span className="text-black">{title.t1} </span>
          <span className="text-[#4e1f88]">{title.t2}</span>
        </div>
        <div className="whitespace-nowrap">
          <span className="text-black">{title.t3} </span>
          <span className="text-[#4e1f88]">{title.t4}</span>
        </div>
      </>
    );
  };

  return (
    <motion.section 
      className={`relative ${pathname === "/" ? "py-16 min-h-[70vh]" : "pt-25 pb-10 min-h-[50vh] sm:min-h-[40vh] md:min-h-[60vh] lg:min-h-[30vh]"} px-4 md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff] flex items-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }} // Reduced duration and delay
      style={{ willChange: "opacity" }} // Hint browser for optimization
    >
      {/* Background blobs - deferred animation for better LCP */}
      <motion.div
        className="absolute w-[300px] h-[400px] rounded-full bg-orange-200/40 blur-[150px]"
        style={{
          left: '50%',
          bottom: '30px',
          transform: `translate(calc(50% + ${mousePosition.x * 0.02}px), calc(25% + ${mousePosition.y * 0.02}px))`,
          willChange: 'transform', // Optimize for animation
          contain: 'paint' // Reduce paint area
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[300px] rounded-full bg-purple-300/70 blur-[100px]"
        style={{
          left: 'calc(4/7 * 100%)',
          bottom: 'calc(3/8 * 100%)',
          transform: `translate(calc(-50% + ${mousePosition.x * -0.02}px), calc(25% + ${mousePosition.y * -0.02}px))`,
          willChange: 'transform', // Optimize for animation
          contain: 'paint' // Reduce paint area
        }}
      />

      {/* Main content - optimized for faster LCP */}
      <div className="relative max-w-9xl mx-auto flex flex-col items-center text-center w-full z-10">
        {/* Trust indicators - only render if pathname is "/" */}
        {pathname === "/" && (
          <div className="mb-4 md:mb-7 mt-1 md:mt-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
              <div className="flex -space-x-2 sm:-space-x-3">
                <AnimatedTooltip items={people} />
              </div>
              <div className="mt-0 sm:mt-0 sm:ml-3 text-center sm:text-left">
                <div className="flex justify-center sm:justify-start">
                  {stars.map((star, index) => (
                    <img
                      key={index}
                      className="w-5 h-5 sm:w-5 sm:h-5"
                      alt={star.alt}
                      src={star.src}
                      width={20}
                      height={20}
                      loading={index < 2 ? "eager" : "lazy"} // Only eagerly load first two stars
                    />
                  ))}
                </div>
                <div className="text-[#555555] text-sm sm:text-base md:text-lg">Trusted by 200+ Creators</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Headline - the most likely LCP element */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl">
          {renderHeadline()}
        </h1>

        {/* Subheading */}
        <p className={`${pathname === "/" ? "max-w-2xl" : "max-w-5xl"} text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10`}>
          {description}
        </p>

        {/* CTA Button with optimized animation */}
        {buttonText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 8 }}
            transition={{ duration: 0.3 }} // Faster animation
          >
            <Button
              onClick={() => {
                if (pathname === "/") {
                  window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1";
                } else {
                  requestAnimationFrame(() => {
                    const blogSection = document.querySelector(".blog-section");
                    if (blogSection) {
                      const offsetTop =
                        blogSection.getBoundingClientRect().top + window.pageYOffset - 100;
                      window.scrollTo({
                        top: Math.max(offsetTop, 0),
                        behavior: "smooth",
                      });
                    }
                  });
                }
              }}
              className="px-8 py-6 rounded-xl font-semibold text-white text-lg shadow-[0px_1px_7px_#935ada] bg-gradient-to-b from-[rgba(147,90,218,1)] to-[rgba(78,31,136,1)] transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              {buttonText}
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}






































// import { useState, useEffect } from "react";
// import { Button } from "../SubComponents/button";
// import { AnimatedTooltip } from "../SubComponents/ui/animated-tooltip";
// import { people } from "../data/data";
// import { motion } from "framer-motion";

// export default function Hero({ title, description, buttonText }: { title: { t1: string; t2: string; t3: string; t4: string }, description: string, buttonText: string }) {
//   // Properly initialize state hooks
//   const [pathname, setPathname] = useState("");
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

//   // Data for star rating
//   const stars = Array(5).fill({ src: "/svg.svg", alt: "Star rating" });

//   // Safe handling of browser APIs in useEffect
//   useEffect(() => {
//     // Safely set the initial pathname
//     if (typeof window !== 'undefined') {
//       setPathname(window.location.pathname);
//     }

//     // Handle mouse movement
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     // Add event listener safely
//     if (typeof window !== 'undefined') {
//       window.addEventListener("mousemove", handleMouseMove);

//       // Clean up
//       return () => {
//         window.removeEventListener("mousemove", handleMouseMove);
//       };
//     }
//   }, []);

//   return (
//     // Adjust the timeline here if needed
//     <motion.section className={`relative ${pathname === "/" ? "py-16  min-h-[70vh] " : "pt-25 pb-10  min-h-[50vh] sm:min-h-[40vh] md:min-h-[60vh] lg:min-h-[30vh]"} px-4 md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff]flex items-center`}
//       initial={{
//         // y:100
//         opacity: 0,
//       }}
//       animate={{
//         // y:1
//         opacity: 1,
//       }}
//       transition={{ duration: 1, delay: 0.5 }}
//     >

//       {/* Blobs done adjust if needed */}
//       <motion.div
//         className="absolute w-[300px] h-[400px] rounded-full bg-orange-200/40 blur-[150px]"
//         style={{
//           left: '50%',
//           bottom: '30px',
//           x: `calc(50% + ${mousePosition.x * 0.02}px)`,
//           y: `calc(25% + ${mousePosition.y * 0.02}px)`,
//           willChange: 'filter, transform'
//         }}
//       />
//       <motion.div
//         className="absolute w-[600px] h-[300px] rounded-full bg-purple-300/70 blur-[100px]"
//         style={{
//           left: 'calc(4/7 * 100%)',
//           bottom: 'calc(3/8 * 100%)',
//           x: `calc(-50% + ${mousePosition.x * -0.02}px)`,
//           y: `calc(25% + ${mousePosition.y * -0.02}px)`,
//           willChange: 'filter, transform'
//         }}
//       />


//       {/* Main content */}
//       <div className="relative max-w-9xl mx-auto flex flex-col items-center text-center w-full z-10">
//         {/* Trust indicators */}
//         {pathname === "/" && (
//           <div className="mb-4 md:mb-7 mt-1 md:mt-3">
//             <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
//               <div className="flex -space-x-2 sm:-space-x-3">
//           <AnimatedTooltip items={people} />
//               </div>
//               <div className="mt-0 sm:mt-0 sm:ml-3 text-center sm:text-left">
//           <div className="flex justify-center sm:justify-start">
//             {stars.map((star, index) => (
//               <img
//           key={index}
//           className="w-5 h-5 sm:w-5 sm:h-5"
//           alt={star.alt}
//           src={star.src}
//           width={20} // Adjusted width for clarity
//           height={20} // Adjusted height for clarity
//               />
//             ))}
//           </div>
//           <div className="text-[#555555] text-sm sm:text-base md:text-lg">Trusted by 200+ Creators</div>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Headline */}
//         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl">
//          { pathname !== "/" ? (
//                   <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-1 max-w-5xl">
//                   <span className="text-black">{title.t1} </span>
//                   <span className="text-[#4e1f88]">{title.t2} </span>
//                   <span className="text-black">{title.t3} </span>
//                   <span className="text-[#4e1f88]">{title.t4}</span>
//                 </h1>

//          ): (
//           <>
//            <div
//             className="whitespace-nowrap">
//             <span
//               className="text-black">{title.t1} </span>
//             <span
//               className="text-[#4e1f88]">{title.t2}</span>
//           </div>

//           <div
//             className="whitespace-nowrap">
//             <span
//               className="text-black">{title.t3} </span>
//             <span
//               className="text-[#4e1f88]">{title.t4}</span>
//           </div>
//         </>
//          )}
//         </h1>

//         {/* Subheading */}
//         <p className={`${pathname === "/" ? "max-w-2xl" : "max-w-5xl"} text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10`}>
//           {description}
//         </p>

//         {/* CTA Button */}
//         {buttonText && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 8 }}
//             transition={{ duration: 0.5 }}
//           >
//        <Button
//               onClick={() => {
//                 if (pathname === "/") {
//                   window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1";
//                 } else {
//                   requestAnimationFrame(() => {
//                     const blogSection = document.querySelector(".blog-section");
//                     if (blogSection) {
//                       const offsetTop =
//                         blogSection.getBoundingClientRect().top + window.pageYOffset - 100;
//                       window.scrollTo({
//                         top: Math.max(offsetTop, 0),
//                         behavior: "smooth",
//                       });
//                     }
//                   });
//                 }
//               }}

//               className="px-8 py-6 rounded-xl font-semibold text-white text-lg shadow-[0px_1px_7px_#935ada] bg-gradient-to-b from-[rgba(147,90,218,1)] to-[rgba(78,31,136,1)] transition-transform duration-300 hover:scale-105 hover:shadow-lg">
//               {buttonText}
//             </Button>
//           </motion.div>
//         )}
//       </div>

//     </motion.section>
//   );
// }



 















// import { useState, useEffect, memo } from "react";
// import { Button } from "../SubComponents/button";
// import { people } from "../data/data";
// import { AnimatedTooltip } from "../SubComponents/ui/animated-tooltip";
 
// const Stars = memo(() => (
//   Array.from({ length: 5 }, (_, index) => (
//     <img key={index} src="/svg.svg" alt="Star rating" />
//   ))
// ));

 
 
// export default function Hero({ title, description, buttonText }: { title: { t1: string; t2: string; t3: string; t4: string }, description: string, buttonText: string }) {
//   // Initializing with default values to avoid layout shifts
//   const [pathname, setPathname] = useState("/");

//   // Use a single state update in useEffect to reduce renders
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setPathname(window.location.pathname);
//     }

//     // We'll add mouse tracking in an idle callback to not block main rendering
//     if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
//       const idleCallback = window.requestIdleCallback(() => {
//         // Don't use mousemove at all on mobile devices
//         if (window.matchMedia('(min-width: 768px)').matches) {
//           const handleMouseMove = (e: MouseEvent) => {
//             // Skip updating for small mouse movements to reduce repaints
//             // This could be further optimized with throttling if needed
//             const blobs = document.querySelectorAll('.hero-blob');
//             blobs.forEach((blob: Element) => {
//               const dir = blob.classList.contains('blob-1') ? 1 : -1;
//               (blob as HTMLElement).style.transform =
//                 `translate(calc(${dir * 0.01 * e.clientX}px), calc(${0.01 * e.clientY}px))`;
//             });
//           };

//           window.addEventListener("mousemove", handleMouseMove, { passive: true });
//           return () => window.removeEventListener("mousemove", handleMouseMove);
//         }
//       }, { timeout: 2000 });

//       return () => {
//         if ('cancelIdleCallback' in window) {
//           window.cancelIdleCallback(idleCallback);
//         }
//       };
//     }
//   }, []);

//   const handleButtonClick = () => {
//     if (pathname === "/") {
//       window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1";
//     } else {
//       window.requestAnimationFrame(() => {
//         const blogSection = document.querySelector(".blog-section");
//         if (blogSection) {
//           const offsetTop = blogSection.getBoundingClientRect().top + window.scrollY - 100;
//           window.scrollTo({
//             top: Math.max(offsetTop, 0),
//             behavior: "smooth",
//           });
//         }
//       });
//     }
//   };

//   return (
//     <section
//       className={`relative ${pathname === "/" ? "py-16 min-h-[70vh]" : "pt-25 pb-10 min-h-[50vh] sm:min-h-[40vh] md:min-h-[60vh] lg:min-h-[30vh]"} px-4 md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff] flex items-center`}
//     >
//       {/* Simplified static blobs with CSS transitions instead of framer-motion */}
//       <div
//         className="hero-blob blob-1 absolute w-[300px] h-[400px] rounded-full bg-orange-200/40 blur-[150px]"
//         style={{
//           left: '50%',
//           bottom: '30px',
//           transform: 'translate(50%, 25%)',
//           transition: 'transform 1s ease-out'
//         }}
//       />
//       <div
//         className="hero-blob blob-2 absolute w-[600px] h-[300px] rounded-full bg-purple-300/70 blur-[100px]"
//         style={{
//           left: 'calc(4/7 * 100%)',
//           bottom: 'calc(3/8 * 100%)',
//           transform: 'translate(-50%, 25%)',
//           transition: 'transform 1s ease-out'
//         }}
//       />

//       {/* Main content - optimized with simpler animations */}
//       <div className="relative max-w-9xl mx-auto flex flex-col items-center text-center w-full z-10">
 

// {pathname === "/" && (
//           <div className="mb-4 md:mb-7 mt-1 md:mt-3">
//             <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
//               <div className="flex -space-x-2 sm:-space-x-3">
//                 <AnimatedTooltip items={people} />
//               </div>
//               <div className="mt-0 sm:mt-0 sm:ml-3 text-center sm:text-left">
//                 <div className="flex justify-center sm:justify-start">
//                   {Array.from({ length: 5 }, (_, index) => (
//                     <img
//                       key={index}
//                       className="w-5 h-5 sm:w-5 sm:h-5"
//                       alt="Star rating"
//                       src="/svg.svg"
//                       width={20}
//                       height={20}
//                       loading={index < 2 ? "eager" : "lazy"} // Only eagerly load first two stars
//                     />
//                   ))}
//                 </div>
//                 <div className="text-[#555555] text-sm sm:text-base md:text-lg">Trusted by 200+ Creators</div>
//               </div>
//             </div>
//           </div>
//         )}
//         {/* Headline - the most important LCP element */}
//         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl">
//           {pathname !== "/" ? (
//             <>
//               <span className="text-black font-display">{title.t1} </span>
//               <span className="text-[#4e1f88] font-display">{title.t2} </span>
//               <span className="text-black font-display">{title.t3} </span>
//               <span className="text-[#4e1f88] font-display">{title.t4}</span>
//             </>
//           ) : (
//             <>
//               <div className="whitespace-nowrap">
//                 <span className="text-black font-display">{title.t1} </span>
//                 <span className="text-[#4e1f88] font-display  ">{title.t2}</span>
//               </div>
//               <div className="whitespace-nowrap">
//                 <span className="text-black font-display">{title.t3} </span>
//                 <span className="text-[#4e1f88] font-display">{title.t4}</span>
//               </div>
//             </>
//           )}
//         </h1>

//         {/* Subheading */}
//         <p className={`${pathname === "/" ? "max-w-2xl" : "max-w-5xl"} text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10`}>
//           {description}
//         </p>

//         {/* CTA Button - removed the motion wrapper */}
//         {buttonText && (
//           <Button
//             onClick={handleButtonClick}
//             className="px-8 py-6 rounded-xl font-semibold text-white text-lg shadow-[0px_1px_7px_#935ada] bg-gradient-to-b from-[rgba(147,90,218,1)] to-[rgba(78,31,136,1)] transition-transform duration-300 hover:scale-105 hover:shadow-lg">
//             {buttonText}
//           </Button>
//         )}
//       </div>
//     </section>
//   );
// }































 