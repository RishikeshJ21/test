 

import React from "react"
import { motion } from "framer-motion"

import { cn } from "../../lib/utils"
import { CardHoverEffectContainer, CardHoverEffectWrapper } from "../../SubComponents/ui/card-hover-effect"
import { benefitCards } from "../../data/WhyChooseUs"

// Define the Card component with forwardRef
const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow", className)} {...props} />
))
Card.displayName = "Card"

// Define the CardContent component
const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-6", className)} {...props} />
)
CardContent.displayName = "CardContent"

export const WhyChooseUsSection = () => {
  // Define the card data for mapping


  return (
    <section className="flex mt-10 flex-col w-full max-w-[1800px] items-center justify-center gap-[60px] mx-auto py-1 sm:py-6 md:py-2 px-2 sm:px-6 lg:px-2">
      {/* Title and Description */}
      <div className="flex flex-col sm:flex-col justify-between  items-start w-full gap-6"></div>
      <div className="flex flex-col sm:flex-col justify-between  items-start w-full gap-6">
        <h2 className="w-full  [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[36px] sm:text-[48px] md:text-[56px] tracking-[0] leading-[1.2]">
          Why Choose Us?
        </h2>

        <p className="w-full  leading-7 sm:leading-9 [font-family:'Instrument_Sans',Helvetica] font-medium text-[#222222] text-lg sm:text-xl md:text-2xl tracking-[0]">
          At Createathon, we redefine content creation by empowering creators with the right tools, mentorship, and
          community support—completely free of cost. We&apos;re not just a platform; we&apos;re your creative partner in
          growth and success.
        </p>
      </div>

      {/* Benefit Cards */}
      <CardHoverEffectContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-[18px_27px] w-full">
        {/* First row - 2 cards, each taking 6 columns on large screens */}
        {benefitCards.slice(0, 2).map((card: { id: number; icon: string; title: string; description: string }, idx: number) => (
          <CardHoverEffectWrapper key={card.id} index={idx} className="lg:col-span-6 h-full">
            <div className="group relative h-full">
              {/* Animated border - like the image */}
              <motion.div
                className="absolute -inset-[3px] rounded-lg z-10 opacity-0 group-hover:opacity-100 overflow-hidden"
                style={{
                  background: "transparent",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: "3px solid transparent",
                    borderRadius: "0.75rem",
                    backgroundClip: "padding-box, border-box",
                    backgroundOrigin: "padding-box, border-box",
                    background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #39C0FF, #9453F5, #4B37FF, #39C0FF) border-box",
                    backgroundSize: "300% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              <Card className="border border-solid border-[#4e1f8880] shadow-[0px_1px_7px_#935ada80] [background:linear-gradient(135deg,rgba(220,202,243,0.25)_0%,rgba(220,202,243,0)_100%)] rounded-lg h-full relative overflow-hidden group z-20 flex flex-col">
                <motion.div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute -inset-[2px] rounded-xl"
                    style={{
                      background:
                        "conic-gradient(from 0deg at 50% 50%, #FF5E5E, #FFBB2B, #52FF57, #4385FF, #B026FF, #FF51C0, #FF5E5E)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 8,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <div className="absolute inset-[1px] bg-white rounded-xl" />
                </motion.div>

                <CardContent className="flex flex-col items-start gap-[20px] p-6 sm:p-9 relative z-10 h-full">
                  <div className="flex flex-row gap-5 items-center justify-center">

                    <div className="flex w-[50px] sm:w-[66px] h-[50px] sm:h-[66px] items-center justify-center gap-2.5 px-1 py-2.5 bg-white rounded-lg shadow-effect-1">
                      <img
                        className="w-6 sm:w-8 h-6 sm:h-8"
                        alt="Feature icon"
                        src={card.icon || "/placeholder.svg"}
                        width={32}
                        height={32}
                      />
                    </div>

                    <h3 className=" text-start [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[20px] sm:text-[24px] md:text-[28px] tracking-[0] leading-7 ">
                      {card.title}
                    </h3>

                  </div>
                  <p className="self-stretch [font-family:'Instrument_Sans',Helvetica] font-normal text-[#222222] text-base sm:text-lg md:text-xl tracking-[0] leading-[25px]">
                    {card.description}
                  </p>
                </CardContent>

                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: "0 0 15px rgba(147, 90, 218, 0.6), inset 0 0 15px rgba(147, 90, 218, 0.6)",
                  }}
                />
              </Card>
            </div>
          </CardHoverEffectWrapper>
        ))}

        {/* Second row - 2 cards, each taking 6 columns on large screens */}
        {benefitCards.slice(2, 4).map((card: { id: number; icon: string; title: string; description: string }, idx: number) => (
          <CardHoverEffectWrapper key={card.id} index={idx + 2} className="lg:col-span-6 h-full">
            <div className="group relative h-full">
              {/* Animated border - like the image */}
              <motion.div
                className="absolute -inset-[3px] rounded-lg z-10 opacity-0 group-hover:opacity-100 overflow-hidden"
                style={{
                  background: "transparent",
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-xl"
                  style={{
                    border: "3px solid transparent",
                    borderRadius: "0.75rem",
                    backgroundClip: "padding-box, border-box",
                    backgroundOrigin: "padding-box, border-box",
                    background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #39C0FF, #9453F5, #4B37FF, #39C0FF) border-box",
                    backgroundSize: "300% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              <Card className="border border-solid border-[#4e1f8880] shadow-[0px_1px_7px_#935ada80] [background:linear-gradient(135deg,rgba(220,202,243,0.25)_0%,rgba(220,202,243,0)_100%)] rounded-lg h-full relative overflow-hidden group z-20 flex flex-col">
                <motion.div
                  className="absolute inset-0 rounded-lg overflow-hidden"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute -inset-[2px] rounded-xl"
                    style={{
                      background:
                        "conic-gradient(from 0deg at 50% 50%, #FF5E5E, #FFBB2B, #52FF57, #4385FF, #B026FF, #FF51C0, #FF5E5E)",
                      backgroundSize: "200% 200%",
                    }}
                    animate={{
                      backgroundPosition: ["0% 0%", "100% 100%"],
                    }}
                    transition={{
                      duration: 8,
                      ease: "linear",
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <div className="absolute inset-[1px] bg-white rounded-xl" />
                </motion.div>

                <CardContent className="flex flex-col items-start gap-[20px] p-6 sm:p-9 relative z-10 h-full">
                  <div className="flex flex-row gap-5 items-center justify-center">

                    <div className="flex w-[50px] sm:w-[66px] h-[50px] sm:h-[66px] items-center justify-center gap-2.5 px-1 py-2.5 bg-white rounded-lg shadow-effect-1">
                      <img
                        className="w-6 sm:w-8 h-6 sm:h-8"
                        alt="Feature icon"
                        src={card.icon || "/placeholder.svg"}
                        width={32}
                        height={32}
                      />
                    </div>

                    <h3 className="text-start [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[20px] sm:text-[24px] md:text-[28px] tracking-[0] leading-7 ">
                      {card.title}
                    </h3>

                  </div>

                  <p className="self-stretch [font-family:'Instrument_Sans',Helvetica] font-normal text-[#222222] text-base sm:text-lg md:text-xl tracking-[0] leading-[25px]">
                    {card.description}
                  </p>
                </CardContent>

                <motion.div
                  className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    boxShadow: "0 0 15px rgba(147, 90, 218, 0.6), inset 0 0 15px rgba(147, 90, 218, 0.6)",
                  }}
                />
              </Card>
            </div>
          </CardHoverEffectWrapper>
        ))}

        {/* Third row - 1 card taking full width (12 columns) on large screens */}
        <CardHoverEffectWrapper key={benefitCards[4].id} index={4} className="lg:col-span-12 h-full">
          <div className="group relative h-full">
            {/* Animated border - like the image */}
            <motion.div
              className="absolute -inset-[3px]  z-10 opacity-0 group-hover:opacity-100 overflow-hidden"
              style={{
                background: "transparent",
              }}
            >
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  border: "3px solid transparent",
                  borderRadius: "0.75rem",
                  backgroundClip: "padding-box, border-box",
                  backgroundOrigin: "padding-box, border-box",
                  background: "linear-gradient(white, white) padding-box, linear-gradient(90deg, #39C0FF, #9453F5, #4B37FF, #39C0FF) border-box",
                  backgroundSize: "300% 100%",
                }}
                animate={{
                  backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
                }}
                transition={{
                  duration: 2,
                  ease: "linear",
                  repeat: Infinity,
                }}
              />
            </motion.div>

            <Card className="border border-solid border-[#4e1f8880] shadow-[0px_1px_7px_#935ada80] [background:linear-gradient(135deg,rgba(220,202,243,0.25)_0%,rgba(220,202,243,0)_100%)]   h-full relative overflow-hidden group z-20 flex flex-col">
              <motion.div
                className="absolute inset-0 rounded-lg overflow-hidden"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <motion.div
                  className="absolute -inset-[2px] rounded-xl"
                  style={{
                    background:
                      "conic-gradient(from 0deg at 50% 50%, #FF5E5E, #FFBB2B, #52FF57, #4385FF, #B026FF, #FF51C0, #FF5E5E)",
                    backgroundSize: "200% 200%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "100% 100%"],
                  }}
                  transition={{
                    duration: 8,
                    ease: "linear",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />
                <div className="absolute inset-[1px] bg-white rounded-xl" />
              </motion.div>

              <CardContent className="flex flex-col items-start gap-[20px] p-6 sm:p-9 relative z-10 h-full">

                <div className="flex flex-row gap-5 items-center justify-center">
                  <div className="flex w-[50px] sm:w-[66px] h-[50px] sm:h-[66px] items-center justify-center gap-2.5 px-1 py-2.5 bg-white rounded-lg shadow-effect-1">
                    <img
                      className="w-6 sm:w-8 h-6 sm:h-8"
                      alt="Feature icon"
                      src={benefitCards[4].icon || "/placeholder.svg"}
                      width={32}
                      height={32}
                    />
                  </div>


                  <h3 className=" text-start [font-family:'Instrument_Sans',Helvetica] font-semibold text-black text-[20px] sm:text-[24px] md:text-[28px] tracking-[0] leading-7 ">
                    {benefitCards[4].title}
                  </h3>
                </div>

                <p className="self-stretch [font-family:'Instrument_Sans',Helvetica] font-normal text-[#222222] text-base sm:text-lg md:text-xl tracking-[0] leading-[25px]">
                  {benefitCards[4].description}
                </p>
              </CardContent>

              <motion.div
                className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  boxShadow: "0 0 15px rgba(147, 90, 218, 0.6), inset 0 0 15px rgba(147, 90, 218, 0.6)",
                }}
              />
            </Card>
          </div>
        </CardHoverEffectWrapper>
      </CardHoverEffectContainer>
    </section>
  )
}




