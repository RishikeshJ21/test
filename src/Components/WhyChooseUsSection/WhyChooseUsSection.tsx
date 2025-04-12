import React from "react"

import { cn } from "../../lib/utils"

import IconGrid from "./WCU"

// Define the Card component with forwardRef
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
))
Card.displayName = "Card"

// Define the CardContent component
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props} />
)
CardContent.displayName = "CardContent"

export const WhyChooseUsSection = () => {
  return (
    <section className="flex mt-10 flex-col w-full max-w-[1800px] items-center justify-center gap-[20px] mx-auto py-1 sm:py-6 md:py-2 px-2 sm:px-6 lg:px-2">
      <div className="flex flex-col sm:flex-col justify-between items-start w-full gap-2">
        <div className="mb-1 md:mb-1">
          <h2 className="group font-[&apos;Instrument_Sans&apos;,Helvetica] font-bold text-gray-900 text-3xl sm:text-4xl md:text-5xl lg:text-[56px] leading-tight inline-block">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Us?</span>
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500"></span>
          </h2>
          <p className="mt-1 text-gray-600 max-w-full text-lg">
            At Createathon, we redefine content creation by empowering creators with the right tools, mentorship, and
            community support—completely free of cost. We&apos;re not just a platform; we&apos;re your creative partner in
            growth and success.
          </p>
        </div>
      </div>

      <div>
        <IconGrid variant='bordered' />
      </div>

    </section>
  );
};



































// Benefit Cards
// <CardHoverEffectContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-[18px_27px] w-full">
//   {/* First two cards */}
//   {benefitCards.slice(0, 2).map((card: { id: number; icon: string; title: string; description: string }, idx: number) => (
//     <CardHoverEffectWrapper key={card.id} index={idx} className="lg:col-span-6 h-full">
//       <div className="group relative h-full">
//         {/* Animated border glow effect */}
//         <motion.div
//           className="absolute -inset-[2px] rounded-xl z-10 opacity-0 group-hover:opacity-100 overflow-hidden transition-opacity duration-300"
//           style={{ background: "transparent" }}
//         >
//           <motion.div
//             className="absolute inset-0 rounded-xl"
//             style={{
//               border: "2px solid transparent",
//               borderRadius: "0.75rem",
//               backgroundClip: "padding-box, border-box",
//               backgroundOrigin: "padding-box, border-box",
//               background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #39C0FF, #9453F5, #4B37FF, #39C0FF) border-box",
//               backgroundSize: "300% 100%",
//             }}
//             animate={{
//               backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
//             }}
//             transition={{
//               duration: 2,
//               ease: "linear",
//               repeat: Infinity,
//             }}
//           />
//         </motion.div>

//         <Card className="border-2 border-solid border-purple-200 shadow-[0px_2px_8px_rgba(147,90,218,0.2)] bg-white rounded-xl h-full relative overflow-hidden group z-20 flex flex-col transition-transform duration-300 group-hover:scale-[1.02] group-hover:border-purple-300">
//           {/* Rainbow background effect */}
//           <motion.div
//             className="absolute inset-0 rounded-xl overflow-hidden"
//             initial={{ opacity: 0 }}
//             whileHover={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div
//               className="absolute -inset-[2px] rounded-xl"
//               style={{
//                 background: "conic-gradient(from 0deg at 50% 50%, #FF5E5E, #FFBB2B, #52FF57, #4385FF, #B026FF, #FF51C0, #FF5E5E)",
//                 backgroundSize: "200% 200%",
//               }}
//               animate={{
//                 backgroundPosition: ["0% 0%", "100% 100%"],
//               }}
//               transition={{
//                 duration: 8,
//                 ease: "linear",
//                 repeat: Number.POSITIVE_INFINITY,
//               }}
//             />
//             <div className="absolute inset-[1px] bg-white rounded-xl" />
//           </motion.div>

//           <CardContent className="flex flex-col items-start gap-[20px] p-6 sm:p-9 relative z-10 h-full">
//             <div className="flex flex-row gap-5 items-center justify-center">
//               {/* Icon container with animation */}
//               <motion.div
//                 className="flex w-[50px] sm:w-[66px] h-[50px] sm:h-[66px] items-center justify-center gap-2.5 px-1 py-2.5 bg-white rounded-lg shadow-lg border border-purple-100"
//                 whileHover={{
//                   rotate: [0, 5, -5, 0],
//                   transition: { duration: 0.5 }
//                 }}
//               >
//                 <motion.img
//                   className="w-6 sm:w-8 h-6 sm:h-8"
//                   alt="Feature icon"
//                   src={card.icon || "/placeholder.svg"}
//                   width={32}
//                   height={32}
//                   whileHover={{ scale: 1.2 }}
//                   transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                 />
//               </motion.div>

//               <motion.h3
//                 className="text-start [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[20px] sm:text-[24px] md:text-[28px] tracking-[0] leading-7"
//                 initial={{ x: 0 }}
//                 whileHover={{
//                   x: 5,
//                   transition: { type: "spring", stiffness: 400 }
//                 }}
//               >
//                 {card.title}
//               </motion.h3>
//             </div>

//             <motion.p
//               className="self-stretch [font-family:'Instrument_Sans',Helvetica] font-normal text-[#222222] text-base sm:text-lg md:text-xl tracking-[0] leading-[25px]"
//               initial={{ opacity: 0.9 }}
//               whileHover={{ opacity: 1 }}
//             >
//               {card.description}
//             </motion.p>
//           </CardContent>

//           {/* Enhanced glow effect */}
//           <motion.div
//             className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
//             initial={{ opacity: 0 }}
//             whileHover={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             style={{
//               boxShadow: "0 0 20px rgba(147, 90, 218, 0.4), inset 0 0 10px rgba(147, 90, 218, 0.2)",
//             }}
//           />
//         </Card>
//       </div>
//     </CardHoverEffectWrapper>
//   ))}

//   {/* Second two cards */}
//   {benefitCards.slice(2, 4).map((card: { id: number; icon: string; title: string; description: string }, idx: number) => (
//     <CardHoverEffectWrapper key={card.id} index={idx + 2} className="lg:col-span-6 h-full">
//       <div className="group relative h-full">
//         {/* Animated border glow effect */}
//         <motion.div
//           className="absolute -inset-[2px] rounded-xl z-10 opacity-0 group-hover:opacity-100 overflow-hidden transition-opacity duration-300"
//           style={{ background: "transparent" }}
//         >
//           <motion.div
//             className="absolute inset-0 rounded-xl"
//             style={{
//               border: "2px solid transparent",
//               borderRadius: "0.75rem",
//               backgroundClip: "padding-box, border-box",
//               backgroundOrigin: "padding-box, border-box",
//               background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #39C0FF, #9453F5, #4B37FF, #39C0FF) border-box",
//               backgroundSize: "300% 100%",
//             }}
//             animate={{
//               backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
//             }}
//             transition={{
//               duration: 2,
//               ease: "linear",
//               repeat: Infinity,
//             }}
//           />
//         </motion.div>

//         <Card className="border-2 border-solid border-purple-200 shadow-[0px_2px_8px_rgba(147,90,218,0.2)] bg-white rounded-xl h-full relative overflow-hidden group z-20 flex flex-col transition-transform duration-300 group-hover:scale-[1.02] group-hover:border-purple-300">
//           {/* Rainbow background effect */}
//           <motion.div
//             className="absolute inset-0 rounded-xl overflow-hidden"
//             initial={{ opacity: 0 }}
//             whileHover={{ opacity: 1 }}
//             transition={{ duration: 0.5 }}
//           >
//             <motion.div
//               className="absolute -inset-[2px] rounded-xl"
//               style={{
//                 background: "conic-gradient(from 0deg at 50% 50%, #FF5E5E, #FFBB2B, #52FF57, #4385FF, #B026FF, #FF51C0, #FF5E5E)",
//                 backgroundSize: "200% 200%",
//               }}
//               animate={{
//                 backgroundPosition: ["0% 0%", "100% 100%"],
//               }}
//               transition={{
//                 duration: 8,
//                 ease: "linear",
//                 repeat: Number.POSITIVE_INFINITY,
//               }}
//             />
//             <div className="absolute inset-[1px] bg-white rounded-xl" />
//           </motion.div>

//           <CardContent className="flex flex-col items-start gap-[20px] p-6 sm:p-9 relative z-10 h-full">
//             <div className="flex flex-row gap-5 items-center justify-center">
//               {/* Icon container with animation */}
//               <motion.div
//                 className="flex w-[50px] sm:w-[66px] h-[50px] sm:h-[66px] items-center justify-center gap-2.5 px-1 py-2.5 bg-white rounded-lg shadow-lg border border-purple-100"
//                 whileHover={{
//                   rotate: [0, 5, -5, 0],
//                   transition: { duration: 0.5 }
//                 }}
//               >
//                 <motion.img
//                   className="w-6 sm:w-8 h-6 sm:h-8"
//                   alt="Feature icon"
//                   src={card.icon || "/placeholder.svg"}
//                   width={32}
//                   height={32}
//                   whileHover={{ scale: 1.2 }}
//                   transition={{ type: "spring", stiffness: 400, damping: 10 }}
//                 />
//               </motion.div>

//               <motion.h3
//                 className="text-start [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[20px] sm:text-[24px] md:text-[28px] tracking-[0] leading-7"
//                 initial={{ x: 0 }}
//                 whileHover={{
//                   x: 5,
//                   transition: { type: "spring", stiffness: 400 }
//                 }}
//               >
//                 {card.title}
//               </motion.h3>
//             </div>

//             <motion.p
//               className="self-stretch [font-family:'Instrument_Sans',Helvetica] font-normal text-[#222222] text-base sm:text-lg md:text-xl tracking-[0] leading-[25px]"
//               initial={{ opacity: 0.9 }}
//               whileHover={{ opacity: 1 }}
//             >
//               {card.description}
//             </motion.p>
//           </CardContent>

//           {/* Enhanced glow effect */}
//           <motion.div
//             className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
//             initial={{ opacity: 0 }}
//             whileHover={{ opacity: 1 }}
//             transition={{ duration: 0.3 }}
//             style={{
//               boxShadow: "0 0 20px rgba(147, 90, 218, 0.4), inset 0 0 10px rgba(147, 90, 218, 0.2)",
//             }}
//           />
//         </Card>
//       </div>
//     </CardHoverEffectWrapper>
//   ))}

//   {/* Last full-width card */}
//   <CardHoverEffectWrapper key={benefitCards[4].id} index={4} className="lg:col-span-12 h-full">
//     <div className="group relative h-full">
//       {/* Animated border glow effect */}
//       <motion.div
//         className="absolute -inset-[2px] rounded-xl z-10 opacity-0 group-hover:opacity-100 overflow-hidden transition-opacity duration-300"
//         style={{ background: "transparent" }}
//       >
//         <motion.div
//           className="absolute inset-0 rounded-xl"
//           style={{
//             border: "2px solid transparent",
//             borderRadius: "0.75rem",
//             backgroundClip: "padding-box, border-box",
//             backgroundOrigin: "padding-box, border-box",
//             background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #39C0FF, #9453F5, #4B37FF, #39C0FF) border-box",
//             backgroundSize: "300% 100%",
//           }}
//           animate={{
//             backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
//           }}
//           transition={{
//             duration: 2,
//             ease: "linear",
//             repeat: Infinity,
//           }}
//         />
//       </motion.div>

//       <Card className="border-2 border-solid border-purple-200 shadow-[0px_2px_8px_rgba(147,90,218,0.2)] bg-white rounded-xl h-full relative overflow-hidden group z-20 flex flex-col transition-transform duration-300 group-hover:scale-[1.01] group-hover:border-purple-300">
//         {/* Rainbow background effect */}
//         <motion.div
//           className="absolute inset-0 rounded-xl overflow-hidden"
//           initial={{ opacity: 0 }}
//           whileHover={{ opacity: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <motion.div
//             className="absolute -inset-[2px] rounded-xl"
//             style={{
//               background: "conic-gradient(from 0deg at 50% 50%, #FF5E5E, #FFBB2B, #52FF57, #4385FF, #B026FF, #FF51C0, #FF5E5E)",
//               backgroundSize: "200% 200%",
//             }}
//             animate={{
//               backgroundPosition: ["0% 0%", "100% 100%"],
//             }}
//             transition={{
//               duration: 8,
//               ease: "linear",
//               repeat: Number.POSITIVE_INFINITY,
//             }}
//           />
//           <div className="absolute inset-[1px] bg-white rounded-xl" />
//         </motion.div>

//         <CardContent className="flex flex-col items-start gap-[20px] p-6 sm:p-9 relative z-10 h-full">
//           <div className="flex flex-row gap-5 items-center justify-center">
//             {/* Icon container with animation */}
//             <motion.div
//               className="flex w-[50px] sm:w-[66px] h-[50px] sm:h-[66px] items-center justify-center gap-2.5 px-1 py-2.5 bg-white rounded-lg shadow-lg border border-purple-100"
//               whileHover={{
//                 rotate: [0, 5, -5, 0],
//                 transition: { duration: 0.5 }
//               }}
//             >
//               <motion.img
//                 className="w-6 sm:w-8 h-6 sm:h-8"
//                 alt="Feature icon"
//                 src={benefitCards[4].icon || "/placeholder.svg"}
//                 width={32}
//                 height={32}
//                 whileHover={{ scale: 1.2 }}
//                 transition={{ type: "spring", stiffness: 400, damping: 10 }}
//               />
//             </motion.div>

//             <motion.h3
//               className="text-start [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[20px] sm:text-[24px] md:text-[28px] tracking-[0] leading-7"
//               initial={{ x: 0 }}
//               whileHover={{
//                 x: 5,
//                 transition: { type: "spring", stiffness: 400 }
//               }}
//             >
//               {benefitCards[4].title}
//             </motion.h3>
//           </div>

//           <motion.p
//             className="self-stretch [font-family:'Instrument_Sans',Helvetica] font-normal text-[#222222] text-base sm:text-lg md:text-xl tracking-[0] leading-[25px]"
//             initial={{ opacity: 0.9 }}
//             whileHover={{ opacity: 1 }}
//           >
//             {benefitCards[4].description}
//           </motion.p>
//         </CardContent>

//         {/* Enhanced glow effect */}
//         <motion.div
//           className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
//           initial={{ opacity: 0 }}
//           whileHover={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//           style={{
//             boxShadow: "0 0 20px rgba(147, 90, 218, 0.4), inset 0 0 10px rgba(147, 90, 218, 0.2)",
//           }}
//         />
//       </Card>
//     </div>
//   </CardHoverEffectWrapper>
// </CardHoverEffectContainer>