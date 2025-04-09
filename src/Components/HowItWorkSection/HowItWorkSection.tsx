// "use client"
// import React, { useEffect, useState, useRef } from 'react';
// import { MoveRight, CheckCircle, BadgeCheck, PlusCircle, MousePointer, ArrowDown } from 'lucide-react';
// import { motion, useInView, useScroll, useTransform } from "framer-motion";
 

// const steps = [
//   {
//     id: 1,
//     title: "Create your profile",
//     description: "Set up your creator profile with your bio, portfolio, and social media links.",
//     icon: PlusCircle
//   },
//   {
//     id: 2,
//     title: "Share your content",
//     description: "Upload your best work and share it with our growing community of creators and supporters.",
//     icon: BadgeCheck
//   },
//   {
//     id: 3,
//     title: "Build your audience",
//     description: "Engage with your fans and leverage our tools to grow your following organically.",
//     icon: CheckCircle
//   }
// ];

// const HowItWorks = () => {
//   const [visibleCards, setVisibleCards] = useState<number[]>([]);
//   const sectionRef = useRef<HTMLDivElement>(null);
//   const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
//   const [hasTriggeredOnce, setHasTriggeredOnce] = useState(false);
//   const [showScrollHint, setShowScrollHint] = useState(true);
  
//   const { scrollYProgress } = useScroll({
//     target: sectionRef,
//     offset: ["start end", "end start"]
//   });
  
//   const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
//   const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);
  
//   useEffect(() => {
//     // Animate cards appearance
//     if (isInView && !hasTriggeredOnce) {
//       setHasTriggeredOnce(true);
//       const timer = setTimeout(() => {
//         const interval = setInterval(() => {
//           setVisibleCards(prev => {
//             if (prev.length < steps.length) {
//               return [...prev, prev.length];
//             } else {
//               clearInterval(interval);
//               return prev;
//             }
//           });
//         }, 600);
        
//         return () => clearInterval(interval);
//       }, 300);
      
//       return () => clearTimeout(timer);
//     }

//     // Hide scroll hint after some time
//     const scrollTimeout = setTimeout(() => {
//       setShowScrollHint(false);
//     }, 6000);

//     return () => clearTimeout(scrollTimeout);
//   }, [isInView, hasTriggeredOnce]);
  
//   return (
//     <section 
//       id="how-it-works" 
//       ref={sectionRef}
//       className="section-padding bg-gradient-to-b from-white to-purple-50 min-h-[90vh] flex items-center relative"
//     >
//       <motion.div 
//         className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center"
//         initial={{ opacity: 1 }}
//         animate={{ opacity: showScrollHint ? [1, 0.5, 1] : 0, y: showScrollHint ? [0, 10, 0] : 0 }}
//         transition={{ duration: 2, repeat: Infinity }}
//       >
//         <p className="mb-2 text-sm text-gray-600">Scroll to explore</p>
//         <ArrowDown className="text-gray-600 animate-bounce" />
//       </motion.div>

//       <motion.div 
//         className="container mx-auto px-4"
//         style={{ opacity, scale }}
//       >
//         <motion.div 
//           className="text-center mb-12"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, margin: "-100px" }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div 
//             className="inline-flex items-center gap-2 bg-creator-purple/10 py-2 px-4 rounded-full mb-4"
//             animate={{
//               boxShadow: [
//                 "0 0 0 rgba(139, 92, 246, 0)", 
//                 "0 0 15px rgba(139, 92, 246, 0.5)", 
//                 "0 0 0 rgba(139, 92, 246, 0)"
//               ]
//             }}
//             transition={{ duration: 2, repeat: Infinity }}
//           >
//             <MousePointer size={16} className="text-creator-purple" />
//             <span className="text-sm font-medium text-creator-purple">Simple 3-step process</span>
//           </motion.div>
          
//           <motion.h2 
//             className="text-3xl md:text-4xl font-bold mb-4"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.5, delay: 0.2 }}
//           >How It Works</motion.h2>
//           <motion.p 
//             className="text-gray-600 max-w-2xl mx-auto"
//             initial={{ opacity: 0 }}
//             animate={isInView ? { opacity: 1 } : { opacity: 0 }}
//             transition={{ duration: 0.5, delay: 0.4 }}
//           >
//             Getting started with Creatathon is simple. Follow these steps to begin your creator journey.
//           </motion.p>
//         </motion.div>
        
//         <div className="grid md:grid-cols-3 gap-8 relative">
//           {steps.map((step, index) => {
//             const StepIcon = step.icon;
//             return (
//               <motion.div 
//                 key={step.id}
//                 className={`bg-white rounded-xl p-6 shadow-lg border border-gray-100 relative ${
//                   visibleCards.includes(index) ? 'animate-scale-up' : 'opacity-0'
//                 }`}
//                 style={{ animationDelay: `${index * 0.3}s` }}
//                 initial={{ opacity: 0, y: 50 }}
//                 whileInView={{ 
//                   opacity: 1,
//                   y: 0,
//                 }}
//                 viewport={{ once: true, amount: 0.3 }}
//                 transition={{ 
//                   duration: 0.5,
//                   delay: index * 0.3
//                 }}
//                 whileHover={{ 
//                   y: -10,
//                   boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
//                 }}
//               >
//                 <motion.div 
//                   className="bg-creator-purple/10 rounded-full p-3 w-fit mb-4"
//                   whileHover={{ 
//                     scale: 1.1,
//                     backgroundColor: "rgba(139, 92, 246, 0.2)"
//                   }}
//                   animate={isInView && visibleCards.includes(index) ? 
//                     { rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] } : 
//                     {}
//                   }
//                   transition={{ duration: 0.5, delay: index * 0.4 + 0.5 }}
//                 >
//                   <StepIcon className="text-creator-purple" size={24} />
//                 </motion.div>
                
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={isInView && visibleCards.includes(index) ? { opacity: 1 } : { opacity: 0 }}
//                   transition={{ duration: 0.5, delay: index * 0.4 + 0.7 }}
//                 >
//                   <h3 className="text-xl font-bold mb-2">
//                     <span className="text-creator-purple mr-2">{step.id}.</span> 
//                     {step.title}
//                   </h3>
                  
//                   <p className="text-gray-600 mb-4">
//                     {step.description}
//                   </p>

//                   <motion.div
//                     className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-purple-500 to-purple-300 rounded-b-xl"
//                     initial={{ scaleX: 0 }}
//                     animate={isInView && visibleCards.includes(index) ? { scaleX: 1 } : { scaleX: 0 }}
//                     transition={{ duration: 1, delay: index * 0.4 + 1 }}
//                   />
//                 </motion.div>
                
//                 {index < steps.length - 1 && (
//                   <motion.div 
//                     className="absolute right-[-30px] top-1/2 transform -translate-y-1/2 z-10 hidden md:block"
//                     animate={{
//                       x: [0, 10, 0],
//                       scale: isInView ? [1, 1.2, 1] : 1,
//                       transition: {
//                         duration: 1.5,
//                         repeat: Infinity,
//                         ease: "easeInOut"
//                       }
//                     }}
//                   >
//                     <MoveRight className="text-creator-purple" />
//                   </motion.div>
//                 )}
//               </motion.div>
//             );
//           })}
//         </div>
        
//         <motion.div 
//           className="text-center mt-12"
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: 0.6, duration: 0.5 }}
//         >
//           {/* <MotionButton 
//             className="bg-[#1a1f2c] hover:bg-black text-white px-8 py-6 rounded-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-purple-500/20 font-semibold text-base"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//           >
//             Start Your Creator Journey
//           </MotionButton> */}
//         </motion.div>
//       </motion.div>
//     </section>
//   );
// };

// export default HowItWorks;