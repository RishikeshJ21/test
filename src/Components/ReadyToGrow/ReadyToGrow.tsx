import { ArrowRight, Zap, Users, BarChart3, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../SubComponents/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 }
  }
};

export function ReadyToGrow() {
  return (
    <section id="ready-to-grow" className="flex flex-col w-full max-w-[94%] items-center justify-center gap-[60px] mx-auto py-1 sm:py-6 md:py-2 px-2 sm:px-6 lg:px-2">
      {/* Background with animation */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-50">
        <motion.div 
          className="absolute -top-20 -right-20 w-80 h-80 bg-creator-gradient-1 rounded-full filter blur-3xl opacity-20"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-creator-gradient-5 rounded-full filter blur-3xl opacity-20" 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8,
            delay: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        ></motion.div>
        
        <div className="relative z-10 w-full p-8 sm:p-12 md:p-16">
          <motion.div 
            className="bg-white rounded-3xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl border border-purple-100"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <motion.div 
              className="text-center mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <motion.div 
                className="inline-block p-3 bg-purple-100 rounded-full mb-3"
                variants={itemVariants}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Star className="h-6 w-6 text-purple-600" />
              </motion.div>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold leading-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-['Instrument_Sans',Helvetica]"
                variants={itemVariants}
              >
                Ready to Grow Your Creator Journey?
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-700 mt-3 max-w-3xl mx-auto"
                variants={itemVariants}
              >
                Join thousands of creators who have accelerated their growth with our completely free platform.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className="grid md:grid-cols-3 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-purple-100"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
              >
                <div className="bg-purple-100 p-2 rounded-xl inline-block mb-3">
                  <Zap className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-black font-['Instrument_Sans',Helvetica]">Boost Your Visibility</h3>
                <p className="text-gray-600 text-sm">Get discovered by new audiences with our advanced recommendation engine.</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-purple-100"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15,
                  delay: 0.05
                }}
              >
                <div className="bg-pink-100 p-2 rounded-xl inline-block mb-3">
                  <Users className="h-5 w-5 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-black font-['Instrument_Sans',Helvetica]">Connect With Your Community</h3>
                <p className="text-gray-600 text-sm">Build stronger relationships with your audience through interactive features.</p>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border border-purple-100"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 15,
                  delay: 0.1
                }}
              >
                <div className="bg-blue-100 p-2 rounded-xl inline-block mb-3">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-black font-['Instrument_Sans',Helvetica]">Analyze Your Performance</h3>
                <p className="text-gray-600 text-sm">Get detailed analytics to understand what works and optimize your content.</p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1"}
                  className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-5 h-auto text-lg group shadow-md hover:shadow-lg"
                >
                  Get Started Today - It's Free!
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      repeatType: "loop"
                    }}
                  >
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}














// import  { JSX } from "react";
 
// import { motion } from "framer-motion";
// import { Button } from "../../SubComponents/button";
// import { Card, CardContent } from "../../SubComponents/card";
 

// export const ReadyToGrow = (): JSX.Element => {
//   const stats = [
//     {
//       id: 1,
//       icon: "/frame-4.svg",
//       text: "5,000+ Creators Empowered",
//       bgColor: "bg-[#ff7442bf]",
//       position: "md:top-0 md:left-[289px] top-0 right-0",
//     },
//     {
//       id: 2,
//       icon: "/frame-2.svg",
//       text: "100% Free Support",
//       bgColor: "bg-[#a1e4b2bf]",
//       position: "md:top-[340px] md:left-0 bottom-0 left-0",
//       iconSize: "w-[18px] h-[18px] mt-[-4.00px] mb-[-4.00px]",
//       iconContainer: "w-[30px] h-[30px] rounded-lg",
//       gap: "gap-3",
//     },
//   ];

//   return (
//     <motion.section 
//       className="relative w-full max-w-[85%] mx-auto p-7 sm:p-10 sm:pb-28 md:p-16 lg:p-[70px] bg-[#1a1d21] rounded-2xl my-12 md:my-16 md:min-h-auto sm:min-h-[900px] hover:bg-gradient-to-br hover:from-[#1a1d21] hover:to-[#2a2d35] transition-all duration-700"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//       whileHover={{ 
//         boxShadow: "0 0 50px rgba(138, 43, 226, 0.3)",
//         scale: 1.01,
//         transition: { duration: 0.4 }
//       }}
//     >
//       <motion.div 
//         className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
//         animate={{ 
//           background: [
//             "radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.15), transparent 70%)",
//             "radial-gradient(circle at 80% 80%, rgba(0, 123, 255, 0.15), transparent 70%)",
//             "radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.15), transparent 70%)",
//             "radial-gradient(circle at 80% 20%, rgba(0, 123, 255, 0.15), transparent 70%)",
//             "radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.15), transparent 70%)"
//           ]
//         }}
//         transition={{ 
//           duration: 15, 
//           repeat: Infinity,
//           ease: "linear" 
//         }}
//       />
      
//       <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-[90px]">
//         {/* Left content section */}
//         <div className="flex flex-col w-full md:w-[490px] items-center md:items-start gap-8 md:gap-[40px]">
//           <div className="flex flex-col items-center md:items-start gap-5 w-full text-center md:text-left">
//             <motion.h2 
//               className="font-['Instrument_Sans',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight md:leading-[70px] max-w-[457px] relative"
//               initial={{ opacity: 0, x: -20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               whileHover={{ 
//                 textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
//                 scale: 1.02,
//                 transition: { duration: 0.2 }
//               }}
//             >
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white hover:from-purple-300 hover:to-blue-300 transition-all duration-300">
//                 Ready to Grow Your Channel?
//               </span>
//               <motion.span 
//                 className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
//                 whileHover={{ width: "100%" }}
//                 transition={{ duration: 0.3 }}
//               />
//             </motion.h2>

//             <motion.p 
//               className="font-['Instrument_Sans',Helvetica] font-medium text-white text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-9"
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               whileHover={{ 
//                 color: "#d8b4fe",
//                 transition: { duration: 0.3 }
//               }}
//             >
//               Join thousands of creators who have transformed their journey with
//               Createathon.
//             </motion.p>
//           </div>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.3, delay: 0.6 }}
//             whileHover={{ 
//               scale: 1.08,
//               boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)",
//               transition: { type: "spring", stiffness: 400, damping: 10 }
//             }}
//             whileTap={{ scale: 0.95 }}
//             className="relative group"
//           >
//             <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
//             <Button
//               onClick={() => window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1"}
//               className="relative px-8 sm:px-[35px] py-4 sm:py-[18px] bg-white rounded-xl hover:bg-white mb-0 md:mb-0 transition-all duration-300 group-hover:text-[#6e2db8] overflow-hidden"
//             >
//               <span className="font-['Instrument_Sans',Helvetica] font-semibold text-[#4e1f88] text-base sm:text-[17px] tracking-[-0.34px] leading-[23.8px] group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-blue-600 relative z-10">
//                 Join Now for Free
//               </span>
//               <motion.span 
//                 className="absolute inset-0 w-full h-full rounded-xl bg-white/0"
//                 whileHover={{ 
//                   background: "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.8) 0%, transparent 60%)",
//                 }}
//                 onMouseMove={(e) => {
//                   const x = e.nativeEvent.offsetX;
//                   const y = e.nativeEvent.offsetY;
//                   e.currentTarget.style.setProperty('--x', `${x}px`);
//                   e.currentTarget.style.setProperty('--y', `${y}px`);
//                 }}
//               />
//               <motion.span 
//                 className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-600 to-blue-500"
//                 animate={{ width: ["0%", "100%", "0%"] }}
//                 transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
//               />
//             </Button>
//           </motion.div>
//         </div>

//         {/* Right image section */}
//         <div className="hidden md:block relative w-full sm:w-[430px] md:w-[520px] h-[300px] sm:h-[350px] md:h-[400px] mt-12 md:mt-0">
//           <div className="relative h-full w-full">
//             <motion.div
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.7, delay: 0.3 }}
//               whileHover={{ 
//                 scale: 1.05,
//                 rotate: 1,
//                 transition: { type: "spring", stiffness: 300, damping: 15 }
//               }}
//               className="relative"
//             >
//               <motion.div 
//                 className="absolute -inset-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"
//                 animate={{ 
//                   background: [
//                     "linear-gradient(to right, rgba(138, 43, 226, 0.3), rgba(0, 123, 255, 0.3))",
//                     "linear-gradient(to right, rgba(0, 123, 255, 0.3), rgba(138, 43, 226, 0.3))",
//                     "linear-gradient(to right, rgba(138, 43, 226, 0.3), rgba(0, 123, 255, 0.3))"
//                   ]
//                 }}
//                 transition={{ duration: 3, repeat: Infinity }}
//               />
//               <img
//                 className="mx-auto md:mx-0 md:absolute w-[300px] sm:w-[340px] md:w-[380px] h-auto md:h-[380px] md:top-[23px] md:left-[74px] object-cover rounded-lg hover:shadow-[0_0_30px_rgba(138,43,226,0.4)] transition-shadow duration-300"
//                 alt="Rectangle"
//                 src="/rectangle-10.png"
//                 width={380}
//                 height={380}
//               />
//             </motion.div>

//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
//                 whileHover={{ 
//                   scale: 1.1,
//                   y: -5,
//                   boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
//                   transition: { type: "spring", stiffness: 400, damping: 10 }
//                 }}
//               >
//                 <Card
//                   className={`absolute ${stat.position} bg-white rounded-xl p-3 w-[190px] sm:w-[220px] shadow-lg hover:bg-gradient-to-br hover:from-white hover:to-purple-50 transition-all duration-300`}
//                 >
//                   <CardContent className="p-0">
//                     <div
//                       className={`flex items-center ${
//                         stat.gap || "gap-4"
//                       } w-full`}
//                     >
//                       <motion.div
//                         className={`${
//                           stat.iconContainer ||
//                           "w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
//                         } ${
//                           stat.bgColor
//                         } shadow-effect-1 flex items-center justify-center gap-2.5 px-1 py-2.5`}
//                         whileHover={{ 
//                           rotate: 10,
//                           scale: 1.15,
//                           transition: { type: "spring", stiffness: 300, damping: 10 }
//                         }}
//                       >
//                         <img
//                           className={
//                             stat.iconSize || "relative w-5 h-5 sm:w-6 sm:h-6"
//                           }
//                           alt="Icon"
//                           src={stat.icon}
//                           width={30}
//                           height={30}
//                         />
//                       </motion.div>

//                       <div className="flex flex-col items-start justify-center">
//                         <div className="font-['Manrope',Helvetica] font-semibold text-black text-sm sm:text-base leading-tight sm:leading-[21px] hover:text-purple-700 transition-colors duration-300">
//                           {stat.text}
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </motion.section>
//   );
// };








// import { JSX } from "react";
// import { motion } from "framer-motion";
// import { Button } from "../../SubComponents/button";

// export const ReadyToGrow = (): JSX.Element => {
//   const features = [
//     {
//       id: 1,
//       icon: "/frame-4.svg",
//       title: "5,000+ Creators",
//       description: "Join our thriving community",
//     },
//     {
//       id: 2,
//       icon: "/frame-2.svg",
//       title: "Free Support",
//       description: "24/7 dedicated assistance",
//     },
//   ];

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.2,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { opacity: 0, y: 20 },
//     visible: {
//       opacity: 1,
//       y: 0,
//       transition: {
//         duration: 0.6,
//       },
//     },
//   };

//   return (
//     <section className="relative w-full bg-gradient-to-b from-[#1a1d21] to-[#2a2d35] py-20 overflow-hidden">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] -top-48 -left-24 animate-pulse" />
//         <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] -bottom-24 -right-24 animate-pulse" />
//         <div className="absolute w-full h-full bg-[url('/grid-pattern.png')] opacity-10" />
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className="flex flex-col lg:flex-row items-center justify-between gap-16"
//         >
//           {/* Left Content */}
//           <motion.div
//             variants={itemVariants}
//             className="flex-1 text-center lg:text-left"
//           >
//             <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
//               Ready to Grow
//               <br />
//               Your Channel?
//             </h2>
//             <p className="text-gray-300 text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl">
//               Join thousands of creators who have transformed their journey with
//               Createathon. Start your success story today.
//             </p>

//             <motion.div
//               whileHover={{ 
//                 scale: 1.05,
//                 transition: { duration: 0.3 }
//               }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-block relative group"
//             >
//               <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:animate-pulse"></div>
//               <Button
//                 onClick={() => window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1"}
//                 className="relative bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all duration-300 transform hover:-translate-y-1 group-hover:animate-shimmer"
//               >
//                 <span className="relative z-10 flex items-center justify-center gap-2">
//                   Join Now for Free
//                   <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
//                   </svg>
//                 </span>
//               </Button>
//             </motion.div>
//           </motion.div>

//           {/* Right Content */}
//           <motion.div
//             variants={itemVariants}
//             className="flex-1 relative"
//           >
//             {/* Main Image */}
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               className="relative z-10"
//             >
//               <div className="relative">
//                 <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/30 to-blue-500/30 rounded-2xl blur-lg" />
//                 <img
//                   src="/rectangle-10.png"
//                   alt="Creator"
//                   className="relative rounded-2xl w-full max-w-lg mx-auto shadow-2xl"
//                 />
//               </div>
//             </motion.div>

//             {/* Feature Cards */}
//             <div className="absolute w-full h-full top-0 left-0 z-20">
//               {features.map((feature, index) => (
//                 <motion.div
//                   key={feature.id}
//                   initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.6, delay: 0.3 + index * 0.2 }}
//                   className={`absolute ${index === 0 ? 'top-4 -left-4' : 'bottom-4 -right-4'
//                     } bg-white/90 backdrop-blur-lg rounded-xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-[240px]`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${index === 0 ? 'bg-gradient-to-r from-orange-400 to-pink-500' : 'bg-gradient-to-r from-green-400 to-emerald-500'
//                       }`}>
//                       <img
//                         src={feature.icon}
//                         alt={feature.title}
//                         className="w-6 h-6"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{feature.title}</h3>
//                       <p className="text-sm text-gray-600">{feature.description}</p>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </motion.div>
//         </motion.div>
//       </div>
//     </section>
//   );
// };
