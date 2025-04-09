 
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
