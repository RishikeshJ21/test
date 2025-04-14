
import  { useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
 

interface StepCard {
  id: number;
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

const stepCardData: StepCard[] = [
  {
    id: 1,
    icon: "/frame-8.svg",
    title: "Fund Your Vibes",
    description:
      "Get the financial boost you need to bring your boldest ideas to life. Whether it's covering production costs or investing in gear upgrades, we've got your back—no strings attached. We're here to support your creative journey every step of the way.",
    bgColor: "bg-[#FFBDA8]",
  },
  {
    id: 2,
    icon: "/frame-10.svg",
    title: "Level Up Your Skills",
    description:
      "Learn from industry experts and successful creators through hands-on mentorship and expert guidance. Elevate your skills, perfect your craft, and make your content truly stand out in a competitive landscape.",
    bgColor: "bg-[#FFD5A8]",
  },
  {
    id: 3,
    icon: "/frame-7.svg",
    title: "Connect with Your Tribe",
    description:
      "Be part of a thriving community where creators inspire each other. Collaborate, share ideas, and build lasting connections with like-minded individuals who share your passion. Together, we can elevate our creative journeys and inspire one another to reach new heights.",
    bgColor: "bg-[#C7F1D1]",
  },
  {
    id: 4,
    icon: "/frame-4.svg",
    title: "Build a Sustainable Hustle",
    description:
      "Turn your passion into a career by mastering monetization and branding strategies. Learn how to secure partnerships and keep your creative journey thriving long term. We're here to support your creative journey every step of the way.",
    bgColor: "bg-[#FFB090]",
  },
];

export const SwipeCards = () => {
  const [cards, setCards] = useState<StepCard[]>(stepCardData);
  // const [currentIndex, setCurrentIndex] = useState(0);

  const handleCardSwiped = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    // setCurrentIndex((prev) => Math.min(prev + 1, stepCardData.length - 1));

    // If all cards have been swiped, reset after a delay
    if (cards.length === 1) {
      setTimeout(() => {
        setCards(stepCardData);
        // setCurrentIndex(0);
      }, 300);
    }
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl">
      {cards.map((card) => (
        <Card
          key={card.id}
          cards={cards}
          onSwiped={handleCardSwiped}
          {...card}
        />
      ))}
   
    </div>
  );
};

const Card = ({
  id,
  icon,
  title,
  description,
  bgColor,
  cards,
  onSwiped,
}: StepCard & {
  cards: StepCard[];
  onSwiped: (id: number) => void;
}) => {
  const y = useMotionValue(0);
  const x = useMotionValue(0);
  const rotate = useTransform(y, [-200, 200], [-5, 5]);
  const opacity = useTransform(y, [-100, 0, 100], [0, 1, 0]);

  const isFront = id === cards[cards.length - 1].id;

  const handleDragEnd = () => {
    if (y.get() < -100) {
      onSwiped(id);
    } else {
      // If not swiped far enough, animate back to center
      y.set(0);
      x.set(0);
    }
  };

  return (
    <motion.div
      className={`absolute top-0 left-0 w-full h-full ${title == "Connect with Your Tribe" ? "max-h-[330px]" : "max-h-[310px]"} ${bgColor} rounded-3xl shadow-lg border border-white/30`}
      style={{
        y,
        x,
        rotate,
        opacity,
        zIndex: isFront ? 10 : 5 - id,
      }}
      animate={{
        scale: isFront ? 1 : 0.95 - (cards.length - 1 - cards.findIndex(c => c.id === id)) * 0.03,
        top: isFront ? 0 : `${(cards.length - 1 - cards.findIndex(c => c.id === id)) * 15}px`,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      drag={isFront ? true : false}
      dragConstraints={{
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
    >
      <div className=" p-6 md:p-8 gap-4 flex flex-col h-full">
        {/* <div className="flex gap-2   items-start justify-start"> */}
        <div className="flex gap-4 ">

 
        <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm">
               <img className="w-6 h-6" alt={title} src={icon} width={24} height={24} />
         </div>

        <h3 className={` ${title == "Fund Your Vibes" || title == "Level Up Your Skills" ? "pt-2" : ""} text-[20px] md:text-3xl font-bold text-black `}>{title}</h3>
        </div>

        <p className="text-black text-base leading-snug">
             {description}
         </p>

        {isFront && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: id === 4 ? 15 :4 , x: -15 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="absolute bottom-6 text-center  text-sm text-gray-600 flex items-center justify-center ml-[25%]"
          >
            <motion.svg
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </motion.svg>
            <span>Swipe to see more</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SwipeCards; 













// "use client";

// import { useState } from "react";
// import { motion, useMotionValue, useTransform } from "framer-motion";

// interface StepCard {
//   id: number;
//   icon: string;
//   title: string;
//   description: string;
//   bgColor: string;
// }

// const stepCardData: StepCard[] = [
//   {
//     id: 1,
//     icon: "/frame-8.svg",
//     title: "Fund Your Vibes",
//     description:
//       "Get the financial boost you need to bring your boldest ideas to life. From production costs to gear upgrades, we've got your back—no strings attached.",
//     bgColor: "bg-[#FFBDA8]",
//   },
//   {
//     id: 2,
//     icon: "/frame-10.svg",
//     title: "Level Up Your Skills",
//     description:
//       "Learn from industry experts and successful creators through hands-on mentorship and expert guidance. Elevate your skills, perfect your craft, and make your content stand out.",
//     bgColor: "bg-[#FFD5A8]",
//   },
//   {
//     id: 3,
//     icon: "/frame-7.svg",
//     title: "Connect with Your Tribe",
//     description:
//       "Be part of a thriving community where creators inspire each other. Collaborate, share ideas, and build lasting connections with like-minded individuals who share your passion.",
//     bgColor: "bg-[#C7F1D1]",
//   },
//   {
//     id: 4,
//     icon: "/frame-4.svg",
//     title: "Build a Sustainable Hustle",
//     description:
//       "Turn your passion into a career by mastering monetization and branding strategies. Learn how to secure partnerships and keep your creative journey thriving long term.",
//     bgColor: "bg-[#FFB090]",
//   },
// ];

// // Card component for swipe interactions
// const Card: React.FC<{
//   id: number;
//   icon: string;
//   title: string;
//   description: string;
//   bgColor: string;
//   cards: StepCard[];
//   onSwiped: (id: number) => void;
// }> = ({ id, icon, title, description, bgColor, onSwiped }) => {
//   const x = useMotionValue(0);
//   const rotate = useTransform(x, [-200, 200], [-10, 10]);
//   const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

//   const handleDragEnd = (_: any, info: any) => {
//     if (Math.abs(info.offset.x) > 100) {
//       onSwiped(id);
//     }
//   };

//   return (
//     <motion.div
//       className="absolute w-full"
//       style={{ x, rotate, opacity }}
//       drag="x"
//       dragConstraints={{ left: 0, right: 0 }}
//       onDragEnd={handleDragEnd}
//     >
//       <div className={`${bgColor} rounded-3xl p-6 shadow-md w-full border border-white/30 font-['Instrument_Sans',Helvetica]`}>
//         <div className="flex flex-col">
//           <div className="flex items-start justify-start gap-4 mb-5">
//             <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm">
//               <img className="w-6 h-6" alt={title} src={icon} width={24} height={24} />
//             </div>
//             <h3 className="text-xl md:text-2xl font-bold  bg-clip-text text-transparent pt-1">
//               {title}
//             </h3>
//           </div>

//           <p className="text-black text-base leading-snug">
//             {description}
//           </p>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export const SwipeCards = () => {
//   const [cards, setCards] = useState<StepCard[]>(stepCardData);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handleCardSwiped = (id: number) => {
//     setCards((prevCards) => prevCards.filter((card) => card.id !== id));
//     setCurrentIndex((prev) => Math.min(prev + 1, stepCardData.length - 1));

//     // If all cards have been swiped, reset after a delay
//     if (cards.length === 1) {
//       setTimeout(() => {
//         setCards(stepCardData);
//         setCurrentIndex(0);
//       }, 300);
//     }
//   };

//   return (
//     <div className="relative w-full md:w-[90%] mx-auto h-[380px] overflow-hidden rounded-2xl">
//       {cards.map((card) => (
//         <Card
//           key={card.id}
//           cards={cards}
//           onSwiped={handleCardSwiped}
//           {...card}
//         />
//       ))}
//       <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
//         {stepCardData.map((_, index) => (
//           <div
//             key={index}
//             className={`h-2 rounded-full transition-all ${index === currentIndex
//               ? "bg-purple-600 w-6"
//               : "bg-gray-300 w-2"
//               }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SwipeCards;