import { JSX, useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Button } from "../../SubComponents/button";
import { Card, CardContent } from "../../SubComponents/card";
import { useAnalyticsEvent, EventCategory } from "../../lib/useAnalyticsEvent";


export const ReadyToGrow2 = (): JSX.Element => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const trackEvent = useAnalyticsEvent();

  // Check if screen is large (above 1600px)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 1600);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const stats = [
    {
      id: 1,
      icon: "/frame-4.svg",
      text: "5,000+ Creators Empowered",
      bgColor: "bg-[#ff7442bf]"
    },
    {
      id: 2,
      icon: "/frame-2.svg",
      text: "100% Free Support",
      bgColor: "bg-[#a1e4b2bf]",
      iconSize: "w-[18px] h-[18px] mt-[-4.00px] mb-[-4.00px]",
      iconContainer: "w-[30px] h-[30px] rounded-lg",
      gap: "gap-3"
    }
  ];

  return (
    <section className="flex flex-col w-full max-w-[94%] lg:max-w-[86%] items-center justify-center mx-auto py-1 sm:py-6 md:py-2 px-2 sm:px-6 lg:px-2">
      <motion.div
        id="ready-to-grow"
        className="relative w-full p-7 sm:p-10 sm:pb-28 md:p-16 lg:px-[70px] lg:py-[40px]  bg-[#1a1d21] rounded-2xl md:min-h-auto sm:min-h-[700px] 2xl:min-h-[300px] hover:bg-gradient-to-br hover:from-[#1a1d21] hover:to-[#2a2d35] transition-all duration-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{
          boxShadow: "0 0 50px rgba(138, 43, 226, 0.3)",
          scale: 1.01,
          transition: { duration: 0.4 }
        }}
      >
        {/* Decorative elements for large screens only */}
        {isLargeScreen && (
          <>
            {/* Animated floating orbs */}
            <motion.div
              className="absolute top-[-80px] left-[15%] w-32 h-32 rounded-full bg-purple-500/10 blur-xl hidden 2xl:block"
              animate={{
                y: [0, 15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.div
              className="absolute top-[-60px] right-[20%] w-24 h-24 rounded-full bg-blue-500/10 blur-xl hidden 2xl:block"
              animate={{
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />

            <motion.div
              className="absolute bottom-[-70px] left-[30%] w-40 h-28 rounded-full bg-purple-500/10 blur-xl hidden 2xl:block"
              animate={{
                x: [-20, 20, -20],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.div
              className="absolute bottom-[-50px] right-[10%] w-28 h-28 rounded-full bg-blue-500/10 blur-xl hidden 2xl:block"
              animate={{
                y: [0, 10, 0],
                scale: [1, 0.9, 1]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />

            {/* Floating icons */}
            {/* <motion.img
              src="/lightning.svg"
              alt="Lightning decoration"
              className="absolute -top-[50px] right-[35%] w-10 h-10 hidden 2xl:block opacity-80"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            /> */}

            {/* <motion.img
              src="/sparkle.svg"
              alt="Sparkle decoration"
              className="absolute -bottom-[30px] left-[25%] w-8 h-8 hidden 2xl:block opacity-80"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            /> */}

            {/* Additional decorative elements */}
            <motion.div
              className="absolute -top-[40px] left-[50%] w-1 h-16 bg-gradient-to-b from-purple-500/50 to-transparent hidden 2xl:block"
              animate={{ height: [16, 24, 16] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            <motion.div
              className="absolute -bottom-[40px] right-[40%] w-1 h-16 bg-gradient-to-t from-blue-500/50 to-transparent hidden 2xl:block"
              animate={{ height: [16, 28, 16] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center bg-repeat-x opacity-5 hidden 2xl:block pointer-events-none" />

            {/* Additional sparkle */}
            {/* <motion.img
              src="/sparkle.svg"
              alt="Sparkle decoration"
              className="absolute top-[10%] right-[5%] w-6 h-6 hidden 2xl:block opacity-60"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 0.9, 0.6],
                rotate: [0, 45, 0]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3
              }}
            /> */}

            {/* Additional lightning */}
            {/* <motion.img
              src="/lightning.svg"
              alt="Lightning decoration"
              className="absolute bottom-[15%] left-[8%] w-7 h-7 hidden 2xl:block opacity-70"
              animate={{
                y: [0, 8, 0],
                rotate: [0, -15, 0],
                opacity: [0.7, 0.9, 0.7]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            /> */}
          </>
        )}

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          animate={{
            background: [
              "radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.15), transparent 70%)",
              "radial-gradient(circle at 80% 80%, rgba(0, 123, 255, 0.15), transparent 70%)",
              "radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.15), transparent 70%)",
              "radial-gradient(circle at 80% 20%, rgba(0, 123, 255, 0.15), transparent 70%)",
              "radial-gradient(circle at 20% 20%, rgba(138, 43, 226, 0.15), transparent 70%)"
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-[90px] 2xl:gap-[120px] 2xl:py-8">
          {/* Left content section */}
          <div className="flex flex-col w-full md:w-[490px] 2xl:w-[580px] items-center md:items-start gap-8 md:gap-[40px] 2xl:gap-[50px]">
            <div className="flex flex-col items-center md:items-start gap-5 w-full text-center md:text-left">
              <motion.h2
                className="font-['Instrument_Sans',Helvetica] font-semibold text-white text-3xl sm:text-4xl md:text-5xl lg:text-[56px] 2xl:text-[64px] leading-tight md:leading-[70px] 2xl:leading-[80px] max-w-[457px] 2xl:max-w-[550px] relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{
                  textShadow: "0 0 8px rgba(255, 255, 255, 0.5)",
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white hover:from-purple-300 hover:to-blue-300 transition-all duration-300">
                  Ready to Grow Your Channel?
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.h2>

              <motion.p
                className="font-['Instrument_Sans',Helvetica] font-medium text-white text-lg sm:text-xl md:text-2xl leading-relaxed md:leading-9"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{
                  color: "#d8b4fe",
                  transition: { duration: 0.3 }
                }}
              >
                Join thousands of creators who have transformed their journey with
                Createathon.
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              whileHover={{
                scale: 1.08,
                boxShadow: "0 0 30px rgba(255, 255, 255, 0.6)",
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 1.5 }}
              className="relative group rounded-xl"
            >
              <div className="absolute  -inset-1 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse"></div>
              <Button
                onClick={() => {
                  // Track the "join now" button click event
                  trackEvent({
                    action: 'join_telegram_group',
                    category: EventCategory.CONVERSION,
                    label: 'Join Now For Free button'
                  });
                  window.open("https://t.me/+dKB7kUlsbFFkMDM1", "_blank");
                }}
                className="relative  px-10 sm:px-[40px] py-4 sm:py-[22px] bg-white rounded-xl hover:bg-white mb-0 md:mb-0 transition-all duration-300 group-hover:text-[#6e2db8] overflow-hidden"
              >
                <span className="font-['Instrument_Sans',Helvetica] font-semibold text-[#4e1f88] text-base sm:text-[20px] tracking-[-0.34px] leading-[23.8px] group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-blue-600 relative z-10">
                  Join Now for Free
                </span>
                <motion.span
                  className="absolute inset-0 w-full h-full rounded-xl bg-white/0"
                  whileHover={{
                    background: "radial-gradient(circle at var(--x) var(--y), rgba(255,255,255,0.8) 0%, transparent 60%)",
                  }}
                  onMouseMove={(e) => {
                    const x = e.nativeEvent.offsetX;
                    const y = e.nativeEvent.offsetY;
                    e.currentTarget.style.setProperty('--x', `${x}px`);
                    e.currentTarget.style.setProperty('--y', `${y}px`);
                  }}
                />
                <motion.span
                  className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-purple-600 to-blue-500"
                  animate={{ width: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
                />
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
                whileHover={{
                  scale: 1.05,
                  rotate: 1,
                  transition: { type: "spring", stiffness: 300, damping: 15 }
                }}
                className="relative"
              >
                <motion.div
                  className="absolute -inset-2 rounded-lg bg-gradient-to-r from-purple-500/30 to-blue-500/30 blur-md opacity-0 hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    background: [
                      "linear-gradient(to right, rgba(138, 43, 226, 0.3), rgba(0, 123, 255, 0.3))",
                      "linear-gradient(to right, rgba(0, 123, 255, 0.3), rgba(138, 43, 226, 0.3))",
                      "linear-gradient(to right, rgba(138, 43, 226, 0.3), rgba(0, 123, 255, 0.3))"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <img
                  className="mx-auto md:mx-0 md:absolute w-[300px] sm:w-[340px] md:w-[380px] h-auto md:h-[380px] md:top-[23px] lg:left-[74px] object-cover rounded-lg hover:shadow-[0_0_30px_rgba(138,43,226,0.4)] transition-shadow duration-300"
                  alt="Rectangle"
                  src="/rectangle-10.avif"
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
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  className={`absolute ${stat.id === 1
                    ? "top-0 right-0 md:right-auto md:left-[190px] lg:left-[289px]"
                    : "bottom-0 left-0 md:bottom-auto md:top-[360px] lg:top-[340px]"
                    }`}
                >
                  <Card
                    className="bg-white rounded-xl p-3 w-[190px] sm:w-[220px] shadow-lg hover:bg-gradient-to-br hover:from-white hover:to-purple-50 transition-all duration-300"
                  >
                    <CardContent className="p-0">
                      <div
                        className={`flex items-center ${stat.gap || "gap-4"
                          } w-full`}
                      >
                        <motion.div
                          className={`${stat.iconContainer ||
                            "w-10 h-10 sm:w-12 sm:h-12 rounded-xl"
                            } ${stat.bgColor
                            } shadow-effect-1 flex items-center justify-center gap-2.5 px-1 py-2.5`}
                          whileHover={{
                            rotate: 10,
                            scale: 1.15,
                            transition: { type: "spring", stiffness: 300, damping: 10 }
                          }}
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
                          <div className="font-['Manrope',Helvetica] font-semibold text-black text-sm sm:text-base leading-tight sm:leading-[21px] hover:text-purple-700 transition-colors duration-300">
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
      </motion.div>
    </section>
  );
};

