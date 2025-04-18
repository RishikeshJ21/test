import { useState, useEffect } from "react";
import { Button } from "../SubComponents/button";
import { AnimatedTooltip } from "../SubComponents/ui/animated-tooltip";
import { people } from "../data/data";
import { motion } from "framer-motion";

export default function Hero({ title, description, buttonText }: { title: { t1: string; t2: string; t3: string; t4: string }, description: string, buttonText: string }) {
  // Properly initialize state hooks
  const [pathname, setPathname] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Data for star rating
  const stars = Array(5).fill({ src: "/svg.svg", alt: "Star rating" });

  // Safe handling of browser APIs in useEffect
  useEffect(() => {
    // Safely set the initial pathname
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Add event listener safely
    if (typeof window !== 'undefined') {
      window.addEventListener("mousemove", handleMouseMove);

      // Clean up
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    // Adjust the timeline here if needed
    <motion.section className="relative py-16 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff] min-h-[70vh] flex items-center"
      initial={{
        // y:100
        opacity: 0,
      }}
      animate={{
        // y:1
        opacity: 1,
      }}
      transition={{ duration: 1, delay: 0.5 }}
    >

      {/* Blobs done adjust if needed */}
      <motion.div
        className="absolute w-[300px] h-[400px] rounded-full bg-orange-200/40 blur-[150px]"
        style={{
          left: '50%',
          bottom: '30px',
          x: `calc(50% + ${mousePosition.x * 0.02}px)`,
          y: `calc(25% + ${mousePosition.y * 0.02}px)`
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[300px] rounded-full bg-purple-300/70 blur-[100px]"
        style={{
          left: 'calc(4/7 * 100%)',
          bottom: 'calc(3/8 * 100%)',
          x: `calc(-50% + ${mousePosition.x * -0.02}px)`,
          y: `calc(25% + ${mousePosition.y * -0.02}px)`
        }}
      />


      {/* Main content */}
      <div className="relative max-w-9xl mx-auto flex flex-col items-center text-center w-full z-10">
        {/* Trust indicators */}
        {pathname === "/" ? (
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
          width={20} // Adjusted width for clarity
          height={20} // Adjusted height for clarity
              />
            ))}
          </div>
          <div className="text-[#555555] text-sm sm:text-base md:text-lg">Trusted by 200+ Creators</div>
              </div>
            </div>
          </div>
        ) : (
          // Creative content for blog page
          <div className="mb-4 md:mb-7 mt-1 md:mt-3 text-center">
            <p className="text-lg text-[#555555] italic font-medium">
              🚀 Dive into Our Latest Insights & Stories 🚀
            </p>
            {/* You could add more elements like a subtle search icon or category links here if desired */}
          </div>
        )}
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl">
         { pathname !== "/" ? (
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-1 max-w-5xl">
                  <span className="text-black">{title.t1} </span>
                  <span className="text-[#4e1f88]">{title.t2} </span>
                  <span className="text-black">{title.t3} </span>
                  <span className="text-[#4e1f88]">{title.t4}</span>
                </h1>

         ): (
          <>
           <div
            className="whitespace-nowrap">
            <span
              className="text-black">{title.t1} </span>
            <span
              className="text-[#4e1f88]">{title.t2}</span>
          </div>

          <div
            className="whitespace-nowrap">
            <span
              className="text-black">{title.t3} </span>
            <span
              className="text-[#4e1f88]">{title.t4}</span>
          </div>
        </>
         )}
        </h1>

        {/* Subheading */}
        <p className={`${pathname === "/" ? "max-w-2xl" : "max-w-5xl"} text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10`}>
          {description}
        </p>

        {/* CTA Button */}
        {buttonText && pathname === "/" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 8 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              onClick={() => window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1"}

              className="px-8 py-6 rounded-xl font-semibold text-white text-lg shadow-[0px_1px_7px_#935ada] bg-gradient-to-b from-[rgba(147,90,218,1)] to-[rgba(78,31,136,1)] transition-transform duration-300 hover:scale-105 hover:shadow-lg">
              {buttonText}
            </Button>
          </motion.div>
        )}
      </div>

    </motion.section>
  );
}
