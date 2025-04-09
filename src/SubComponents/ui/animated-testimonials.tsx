"use client"

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"
import { motion, AnimatePresence } from "motion/react"
import { useEffect, useState, useCallback, useRef } from "react"

type Testimonial = {
  quote: string
  name: string
  designation: string
  src: string
}
export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[]
  autoplay?: boolean
}) => {
  const [active, setActive] = useState(0)
  const [isMouseOver, setIsMouseOver] = useState(false)
  // Store rotation values to ensure consistency between server/client
  const [rotationValues] = useState(() =>
    testimonials.map(() => 0) // Start with 0 for all, will update on client-side only
  )
  const hasMounted = useRef(false)

  // Update rotation values once on client-side to avoid hydration mismatch
  useEffect(() => {
    if (!hasMounted.current) {
      // Only run once after initial hydration
      hasMounted.current = true;
      // Update rotation values with random values after hydration
      rotationValues.forEach((_, index) => {
        rotationValues[index] = Math.floor(Math.random() * 21) - 10;
      });
    }
  }, [rotationValues]);

  const handleNext = useCallback(() => {
    if (!isMouseOver) {
      setActive((prev) => (prev + 1) % testimonials.length)
    }
  }, [isMouseOver, testimonials.length])

  const handlePrev = () => {
    if (!isMouseOver) {
      setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
  }

  const isActive = (index: number) => {
    return index === active
  }

  useEffect(() => {
    if (autoplay && !isMouseOver) {
      const interval = setInterval(handleNext, 6000)
      return () => clearInterval(interval)
    }
  }, [autoplay, isMouseOver, handleNext])

  return (
    <div className="mx-auto max-w-sm pt-10 px-2 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex justify-center items-center ">
          <div className="relative h-80 w-full max-w-[300px]">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: 0, // Start with 0 to avoid hydration mismatches
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    // rotate: isActive(index) ? 0 : randomRotateY(),
                    rotate: isActive(index) ? 0 : (index % 2 === 0 ? 8 : -8),
                    zIndex: isActive(index) ? 40 : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                  onMouseEnter={() => setIsMouseOver(true)}
                  onMouseLeave={() => setIsMouseOver(false)}
                >
                  <img
                    src={testimonial.src || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex flex-col justify-between py-4 px-4">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          >
            <h3 className="text-2xl font-bold text-black  ">{testimonials[active].name}</h3>
            <p className="text-sm text-gray-500  ">{testimonials[active].designation}</p>
            <motion.p className="mt-8 text-lg text-gray-500 ">
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-4 pt-12 justify-center md:justify-self-start  md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100  "
            >
              <IconArrowLeft className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:rotate-12 " />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-7 w-7 items-center justify-center rounded-full bg-gray-100  "
            >
              <IconArrowRight className="h-5 w-5 text-black transition-transform duration-300 group-hover/button:-rotate-12 " />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

