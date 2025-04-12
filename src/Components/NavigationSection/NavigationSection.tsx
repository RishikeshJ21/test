"use client";

import  { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "../../SubComponents/button";
 
 

const MotionButton = motion(Button);

export const NavigationSection = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Handle mouse movement for interactive background effect
  const handleMouseMove = () => {
    // Keep the function structure but don't update any state
    // Removed unused variable e
  };

  // Navigation menu items data
  const navItems = [
    { title: "Home", href: "#", active: true, offset: 0 },
    { title: "How it Works", href: "#how-it-works", active: false, offset: 50 },
    { title: "Why Choose Us", href: "#why-choose-us", active: false, offset: 20 },
    { title: "Testimonials", href: "#Testimonials", active: false, offset: 40 },
    { title: "FAQs", href: "#FAQs", active: false, offset: -40 },
    { title: "Join Us", href: "#ready-to-grow", active: false, offset: -10 },
  ];

  // Add smooth scrolling for anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, offset: number = 0) => {
    // Only prevent default for hash links
    if (href.startsWith('#') && href !== '#') {
      e.preventDefault();
      const targetId = href.substring(1); // Remove the # character
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
    }
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
         {/* Interactive cursor-following blob */}
      {/* <motion.div
        className="absolute rounded-full bg-gradient-to-r from-purple-300/40 to-pink-300/40 filter blur-3xl pointer-events-none"
        animate={{
          x: mousePosition.x - 75, // Adjusted to limit blob size
          y: mousePosition.y - 75, // Adjusted to limit blob size
          scale: 1.2,
        }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        style={{ width: "150px", height: "150px" }} // Adjusted to limit blob size
      /> */}
      
      {/* Animated background blob */}
      {/* <motion.div
        className="absolute rounded-full bg-purple-100/70 filter blur-3xl"
        initial={{ opacity: 0, scale: 0, x: "50%", y: "50%" }}
        animate={{ 
          opacity: isLoaded ? 0.6 : 0, 
          scale: isLoaded ? 1.5 : 0,
          x: "50%",
          y: "50%"
        }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        style={{ width: "80%", height: "80%", top: "-40%", right: "-40%" }}
      />
       */}
      {/* Additional light purple blob with low opacity */}
      {/* <motion.div
        className="absolute rounded-full bg-purple-200/40 filter blur-2xl"
        initial={{ opacity: 0, scale: 0, x: "-30%", y: "20%" }}
        animate={{ 
          opacity: isLoaded ? 0.35 : 0, 
          scale: isLoaded ? 1.2 : 0,
          x: "-30%",
          y: "20%"
        }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ width: "60%", height: "60%", bottom: "-20%", left: "-10%" }}
      /> */}
      
        
        <div className="flex justify-between items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex items-center"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center bg-transparent justify-center  font-bold shadow-md">
              <img src="/Logotype.svg" className="bg-transparent text-transparent" alt="Logo icon" width={30} height={30} />
            </div>
            <span className="font-['Instrument_Sans'] font-bold text-lg sm:text-xl text-[#111111]">Createathon</span>
          </motion.div>

          {/* Mobile menu button - now visible on lg screens too */}
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

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="hidden lg:flex space-x-4 xl:space-x-8"
          >
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                href={item.href}
                className={`text-[#333333] transition-colors font-['Instrument_Sans'] ${item.active ? "font-semibold" : "font-medium"}`}
                whileHover={{ 
                  scale: 1.1, 
                  color: "#9275E0",
                  transition: { duration: 0.2 }
                }}
                onClick={(e) => handleNavClick(e, item.href, item.offset)}
              >
                {item.title}
              </motion.a>
            ))}
          </motion.nav>

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
              onClick={() => window.open("https://t.me/+dKB7kUlsbFFkMDM1", "_blank")}
            >
              Get Started
            </MotionButton>
          </motion.div>
        </div>

        {/* Mobile menu - now properly aligned and available for lg screens */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:flex 2xl:flex mt-4 w-full"
          >
            <div className="flex flex-col space-y-3 pb-3">
              {navItems.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.href}
                  className={`text-[#333333] transition-colors font-['Instrument_Sans'] ${item.active ? "font-semibold" : "font-medium"}`}
                  whileHover={{ 
                    scale: 1.05, 
                    color: "#9275E0",
                    x: 5,
                    transition: { duration: 0.2 }
                  }}
                  onClick={(e) => handleNavClick(e, item.href, item.offset)}
                >
                  {item.title}
                </motion.a>
              ))}
              <MotionButton
                className="bg-gradient-to-b from-[#9275E0] to-[#6C43D0] text-white py-3 w-full rounded-[10px] text-[20px] font-['Instrument_Sans'] font-semibold shadow-[0px_4px_10px_rgba(147,117,224,0.4)] hover:shadow-[0px_5px_15px_rgba(147,117,224,0.85)] transition-all duration-300 mt-2"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0px 8px 20px rgba(147, 117, 224, 0.9)"
                }}
                whileTap={{ scale: 0.95 }}
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








// "use client";

// import React, { JSX, useState } from "react";

// import {
//   NavigationMenu,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
// } from "@/app/SubComponents/navigation-menu";
// import { Button } from "@/app/SubComponents/button";

// export const NavigationSection = (): JSX.Element => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // Navigation menu items data
//   const navItems = [
//     { title: "Home", active: true },
//     { title: "How it Works", active: false },
//     { title: "Collabrations", active: false },
//     { title: "Testimonials", active: false },
//   ];

//   return (
//     <nav className="w-full flex justify-center py-4">
//       <div className="w-[85%] flex flex-col md:flex-row  items-center justify-between px-4 sm:px-6 md:px-10 py-[15px] rounded-xl shadow-effect-8 shadow-lg [background:linear-gradient(180deg,rgba(246,239,255,1)_0%,rgba(255,255,255,1)_100%)] border border-solid border-[#d7dfe0]">
//         <div className="w-full md:w-auto flex justify-between items-center">
//           {/* Logo */}
//           <div className="relative h-8 md:h-10 flex items-center">
//             <img
//               className="w-[30px] md:w-[37px] h-8 md:h-10"
//               alt="Logo icon"
//               src="/group-5.png"
//             />
//             <img
//               className="h-[16px] md:h-[19px] ml-2"
//               alt="Logo text"
//               src="/group-6.png"
//             />
//           </div>

//           {/* Mobile menu button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden flex items-center p-2 rounded-md text-gray-700"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               {isMenuOpen ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//           </button>
//         </div>

//         {/* Desktop Navigation Menu */}
//         <div className={`hidden md:flex flex-col md:flex-row align-middle mx-auto items-center justify-center flex-1`}>
//           <NavigationMenu className="flex justify-center">
//             <NavigationMenuList className="flex gap-4 lg:gap-8 justify-center">
//               {navItems.map((item, index) => (
//                 <NavigationMenuItem key={index} className="flex justify-center">
//                   <NavigationMenuLink
//                     className={`relative w-fit [font-family:'Instrument_Sans',Helvetica] text-sm md:text-base tracking-[0] leading-6 whitespace-nowrap ${item.active ? "font-medium" : "font-normal"} text-black text-center`}
//                   >
//                     {item.title}
//                   </NavigationMenuLink>
//                 </NavigationMenuItem>
//               ))}
//             </NavigationMenuList>
//           </NavigationMenu>

//           {/* CTA Button */}
        
//         </div>
//         <div className="hidden md:flex ">
//         <Button className="ml-6 px-4 md:px-[30px] py-2 md:py-[15px] rounded-xl shadow-[0px_1px_7px_#935ada] [background:linear-gradient(180deg,rgba(147,90,218,1)_0%,rgba(78,31,136,1)_100%)] [font-family:'Instrument_Sans',Helvetica] font-semibold text-white text-sm md:text-[17px] tracking-[-0.34px] leading-[23.8px] h-auto">
//             Get Started
//           </Button>
//         </div>


//         {/* Mobile Navigation Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden w-full mt-4 flex flex-col space-y-4">
//             {navItems.map((item, index) => (
//               <a
//                 key={index}
//                 href="#"
//                 className={`[font-family:'Instrument_Sans',Helvetica] text-base tracking-[0] leading-6 ${item.active ? "font-medium" : "font-normal"} text-black`}
//               >
//                 {item.title}
//               </a>
//             ))}
//             <Button className="w-full mt-2 px-4 py-2 rounded-xl shadow-[0px_1px_7px_#935ada] [background:linear-gradient(180deg,rgba(147,90,218,1)_0%,rgba(78,31,136,1)_100%)] [font-family:'Instrument_Sans',Helvetica] font-semibold text-white text-sm tracking-[-0.34px] leading-[23.8px] h-auto">
//               Get Started
//             </Button>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };