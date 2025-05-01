import { useState } from "react";
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

  const handleCardSwiped = (id: number) => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== id));

    // If all cards have been swiped, reset after a delay
    if (cards.length === 1) {
      setTimeout(() => {
        setCards(stepCardData);
      }, 300);
    }
  };

  return (
    <div className="relative w-full min-h-[300px] rounded-2xl" aria-label="Interactive cards explaining how Createathon works">
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
      className={`absolute top-0 left-0 w-full ${bgColor} rounded-3xl shadow-lg border border-white/30`}
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
      role="article"
      aria-label={`${title} card - ${isFront ? 'Active' : 'Stacked'}`}
    >
      <div className="p-6 md:p-8 flex flex-col justify-between h-full">
        <div>
          <div className="flex gap-4 mb-3">
            <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg shadow-sm">
              <img
                className="w-6 h-6"
                alt={`${title} icon`}
                src={icon}
                width={24}
                height={24}
                loading="eager"
              />
            </div>
            <h3 className={`${title === "Fund Your Vibes" || title === "Level Up Your Skills" ? "pt-2" : ""} text-[20px] md:text-3xl font-bold text-black`}>
              {title}
            </h3>
          </div>

          <p className="text-black text-base leading-relaxed">
            {description}
          </p>
        </div>

        {isFront && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center text-sm text-gray-600 flex items-center justify-center w-full mt-4"
            aria-label="Swipe instruction"
          >
            <motion.svg
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
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