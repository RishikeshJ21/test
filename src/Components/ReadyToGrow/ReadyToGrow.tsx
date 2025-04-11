 
import  { JSX } from "react";
 
import { motion } from "framer-motion";
import { Button } from "../../SubComponents/button";
import { Card, CardContent } from "../../SubComponents/card";
 

export const ReadyToGrow = (): JSX.Element => {
  const stats = [
    {
      id: 1,
      icon: "/frame-4.svg",
      text: "5,000+ Creators Empowered",
      bgColor: "bg-[#ff7442bf]",
      position: "md:top-0 md:left-[289px] top-0 right-0",
    },
    {
      id: 2,
      icon: "/frame-2.svg",
      text: "100% Free Support",
      bgColor: "bg-[#a1e4b2bf]",
      position: "md:top-[340px] md:left-0 bottom-0 left-0",
      iconSize: "w-[18px] h-[18px] mt-[-4.00px] mb-[-4.00px]",
      iconContainer: "w-[30px] h-[30px] rounded-lg",
      gap: "gap-3",
    },
  ];

  return (
    <motion.section 
      className="relative w-full max-w-[85%] mx-auto p-7 sm:p-10 sm:pb-28 md:p-16 lg:p-[70px] bg-[#1a1d21] rounded-2xl my-12 md:my-16 md:min-h-auto sm:min-h-[900px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-10 md:gap-[90px]">
        {/* Left content section */}
        <div className="flex flex-col w-full md:w-[490px] items-center md:items-start gap-8 md:gap-[40px]">
          <div className="flex flex-col items-center md:items-start gap-5 w-full text-center md:text-left">
            <motion.h2 
              className="font-['Instrument_Sans',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight md:leading-[70px] max-w-[457px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ready to Grow Your Channel?
            </motion.h2>

            <motion.p 
              className="font-['Instrument_Sans',Helvetica] font-medium text-white text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-9"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Join thousands of creators who have transformed their journey with
              Createathon.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1"}
            
            className="px-8 sm:px-[35px] py-4 sm:py-[18px] bg-white rounded-xl hover:bg-white/90 mb-0 md:mb-0">
              <span className="font-['Instrument_Sans',Helvetica] font-semibold text-[#4e1f88] text-base sm:text-[17px] tracking-[-0.34px] leading-[23.8px]">
                Join Now for Free
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Right image section */}
        <div className="hidden md:block relative w-full sm:w-[430px] md:w-[520px] h-[300px] sm:h-[350px] md:h-[400px] mt-12 md:mt-0">
          <div className="relative h-full w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <img
                className="mx-auto md:mx-0 md:absolute w-[300px] sm:w-[340px] md:w-[380px] h-auto md:h-[380px] md:top-[23px] md:left-[74px] object-cover rounded-lg"
                alt="Rectangle"
                src="/rectangle-10.png"
                width={380}
                height={380}
              />
            </motion.div>

            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.2 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card
                  className={`absolute ${stat.position} bg-white rounded-xl p-3 w-[190px] sm:w-[220px] shadow-lg`}
                >
                  <CardContent className="p-0">
                    <div
                      className={`flex items-center ${
                        stat.gap || "gap-4"
                      } w-full`}
                    >
                      <motion.div
                        className={`${
                          stat.iconContainer ||
                          "w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
                        } ${
                          stat.bgColor
                        } shadow-effect-1 flex items-center justify-center gap-2.5 px-1 py-2.5`}
                        whileHover={{ rotate: 5 }}
                      >
                        <img
                          className={
                            stat.iconSize || "relative w-5 h-5 sm:w-6 sm:h-6"
                          }
                          alt="Icon"
                          src={stat.icon}
                          width={30}
                          height={30}
                        />
                      </motion.div>

                      <div className="flex flex-col items-start justify-center">
                        <div className="font-['Manrope',Helvetica] font-semibold text-black text-sm sm:text-base leading-tight sm:leading-[21px]">
                          {stat.text}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};









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
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="inline-block"
//             >
//               <Button
//                 onClick={() => window.location.href = "https://t.me/+dKB7kUlsbFFkMDM1"}
//                 className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//               >
//                 Join Now for Free
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
