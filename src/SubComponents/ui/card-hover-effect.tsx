"use client"

import { useState, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CardHoverEffectWrapperProps {
  children: ReactNode
  index: number
  className?: string
}

export const CardHoverEffectWrapper = ({ children, index, className = "" }: CardHoverEffectWrapperProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{
        scale: 1.03,
        transition: { duration: 0.3 },
      }}
      onMouseEnter={() => setHoveredIndex(index)}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <AnimatePresence>
        {hoveredIndex === index && (
          <motion.span
            className="absolute inset-0  w-full bg-neutral-200/10   block  rounded-[8px] z-0"
            layoutId="hoverBackground"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { duration: 0.15 },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.15, delay: 0.2 },
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.div>
  )
}

export const CardHoverEffectContainer = ({
  children,
  className = "",
}: {
  children: ReactNode
  className?: string
}) => {
  return <div className={`relative ${className}`}>{children}</div>
}
















// "use client";

// import { cn } from "@/app/lib/utils";
// import { WhyChooseUsSection } from "@/app/screens/WhyChooseUsSection";
// import { AnimatePresence, motion } from "framer-motion";
// import Link from "next/link";
// import { useState } from "react";

// interface CardItem {
//   title: string;
//   description: string;
//   link: string;
// }

// const items: CardItem[] = [
//   {
//     title: "Why Choose Us",
//     description: "Discover the benefits of our platform",
//     link: "#why-choose-us"
//   }
// ];

// export const HoverEffect = ({
//   children,
//   className,
// }: {
//   className?: string;
// }) => {
//   let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

//   return (
//     <div
//       className={cn(
//         "py-10",
//         className
//       )}
//     >
//       <div
//         className="relative group block h-full w-full"
//         onMouseEnter={() => setHoveredIndex(0)}
//         onMouseLeave={() => setHoveredIndex(null)}
//       >
//         <AnimatePresence>
//           {hoveredIndex === 0 && (
//             <motion.span
//               className="absolute inset-0 h-full w-full bg-purple-50 dark:bg-transparent block rounded-3xl"
//               layoutId="hoverBackground"
//               initial={{ opacity: 0 }}
//               animate={{
//                 opacity: 1,
//                 transition: { duration: 0.2 },
//               }}
//               exit={{
//                 opacity: 0,
//                 transition: { duration: 0.2, delay: 0.1 },
//               }}
//             />
//           )}
//         </AnimatePresence>
//         <Card className={hoveredIndex === 0 ? "transform transition-all duration-300 scale-[1.01]" : ""}>
//           {/* <WhyChooseUsSection /> */}
//           {children}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export const Card = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <div
//       className={cn(
//         "rounded-2xl h-full w-full p-2 overflow-hidden border border-transparent dark:border-white/[0.2]  relative z-20 transition-all duration-300",
//         className
//       )}
//     >
//       <div className="relative z-50">
//         <div className="p-2">{children}</div>
//       </div>
//     </div>
//   );
// };

// export const CardTitle = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
//       {children}
//     </h4>
//   );
// };

// export const CardDescription = ({
//   className,
//   children,
// }: {
//   className?: string;
//   children: React.ReactNode;
// }) => {
//   return (
//     <p
//       className={cn(
//         "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
//         className
//       )}
//     >
//       {children}
//     </p>
//   );
// };
