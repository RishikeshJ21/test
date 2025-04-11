"use client";

import  { useState, useEffect } from "react";
import { Button } from "../SubComponents/button";
 
 
import { AnimatedTooltip } from "../SubComponents/ui/animated-tooltip";
import { people } from "../data/data";
import { motion } from "framer-motion";

export default function Hero({ title, description, buttonText }: { title: { t1: string; t2: string; t3: string; t4: string }, description: string, buttonText: string }) {
  const pathname = window.location.pathname;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Data for star rating
  const stars = Array(5).fill({ src: "/svg.svg", alt: "Star rating" });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
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
        <div className="mb-4 md:mb-7 mt-1 md:mt-3">
    <div className="flex flex-col sm:flex-row items-center gap-3 justify-center"
    >
    <div className="flex -space-x-2 sm:-space-x-3">
     
      <AnimatedTooltip items={people} />
    </div>
    <div className="mt-0 sm:mt-0 sm:ml-3 text-center sm:text-left">
      <div 
      className="flex justify-center sm:justify-start"
      >
        {stars.map((star, index) => (
          <img
            key={index}
            className="w-5 h-5 sm:w-5 sm:h-5"
            alt={star.alt}
            src={star.src}
            width={500}
            height={300}
          />
        ))}
      </div>
      <div className="text-[#555555] text-sm sm:text-base md:text-lg">Trusted by 200+ Creators</div>
    </div>
  </div>
</div>
 
        {/* Headline */}
        <h1 className="font-['Instrument_Sans',Helvetica] text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl">
  <div className="whitespace-nowrap">
    <span className="text-black">{title.t1} </span>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">{title.t2}</span>
  </div>

  <div className="whitespace-nowrap">
    <span className="text-black">{title.t3} </span>
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">{title.t4}</span>
  </div>
</h1>

        {/* Subheading */}
        <p className="max-w-2xl text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10 font-['Instrument_Sans',Helvetica]">
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










// "use client";

// import React, { useState, useEffect } from "react";
// import { Button } from "./button";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { AnimatedTooltip } from "./ui/animated-tooltip";
// import { people } from "../data/data";
// import { motion } from "framer-motion";

// export default function Hero({ title, description, buttonText }: { title: { t1: string; t2: string; t3: string; t4: string }, description: string, buttonText: string }) {
//   const pathname = usePathname();
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   console.log(mousePosition);
//   // Data for star rating
//   const stars = Array(5).fill({ src: "/svg.svg", alt: "Star rating" });

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       setMousePosition({ x: e.clientX, y: e.clientY });
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   return (
//     <section className="relative py-16 px-4 md:px-6 overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.57)] to-[#f8f5ff] min-h-[70vh] flex items-center">
//       <motion.div 
//         className="absolute rounded-full bg-orange-800/70 filter blur-3xl"
//         animate={{
//           x: mousePosition.x - 75, 
//           y: mousePosition.y - 75, 
//           scale: 1.2,
//         }}
//         transition={{ type: "spring", damping: 15, stiffness: 100 }}
//         style={{ width: "150px", height: "150px" }} 
//       />
//       <motion.div 
//         className="absolute rounded-full bg-purple-300/70 filter blur-3xl"
//         animate={{
//           x: mousePosition.x - 150, 
//           y: mousePosition.y - 150, 
//           scale: 1.1,
//         }}
//         transition={{ type: "spring", damping: 15, stiffness: 100 }}
//         style={{ width: "200px", height: "200px" }} 
//       />
//       {/* Main content */}
//       <div className="relative max-w-9xl mx-auto flex flex-col items-center text-center w-full z-10">
//         {/* Trust indicators */}
//         <div className="mb-4 md:mb-7 mt-4 md:mt-7">
//           <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
//             <div className="flex -space-x-2 sm:-space-x-3">
//               <AnimatedTooltip items={people} />
//             </div>
//             <div className="mt-2 sm:mt-0 sm:ml-3 text-center sm:text-left">
//               <div className="flex justify-center sm:justify-start">
//                 {stars.map((star, index) => (
//                   <Image
//                     key={index}
//                     className="w-5 h-5 sm:w-5 sm:h-5"
//                     alt={star.alt}
//                     src={star.src}
//                     width={500}
//                     height={300}
//                   />
//                 ))}
//               </div>
//               <div className="text-[#555555] text-sm sm:text-base md:text-lg">Trusted by 200+ Creators</div>
//             </div>
//           </div>
//         </div>
 
//         {/* Headline */}
//         <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight leading-tight mb-8 max-w-5xl">
//           <div className="whitespace-nowrap">
//             <span className="text-black">{title.t1} </span>
//             <span className="text-[#4e1f88]">{title.t2}</span>
//           </div>
//           <div className="whitespace-nowrap">
//             <span className="text-black">{title.t3} </span>
//             <span className="text-[#4e1f88]">{title.t4}</span>
//           </div>
//         </h1>

//         {/* Subheading */}
//         <p className="max-w-2xl text-[#222222] text-base sm:text-lg md:text-xl mt-3 font-medium leading-relaxed mb-10">
//           {description}
//         </p>

//         {/* CTA Button */}
//         {buttonText && pathname === "/" && (
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 8 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Button className="px-8 py-6 rounded-xl font-semibold text-white text-lg shadow-[0px_1px_7px_#935ada] bg-gradient-to-b from-[rgba(147,90,218,1)] to-[rgba(78,31,136,1)] transition-transform duration-300 hover:scale-105 hover:shadow-lg">
//               {buttonText}
//             </Button>
//           </motion.div>
//         )}
//       </div>
//     </section>
//   );
// }
