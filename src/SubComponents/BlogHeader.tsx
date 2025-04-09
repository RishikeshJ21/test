"use client";

import { motion } from 'framer-motion';

export default function BlogHeader() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background blobs/gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-purple-200/15 blur-[100px]" />
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] rounded-full bg-[rgba(255,146,86,0.15)] blur-[100px] opacity-90" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[rgba(158,116,255,0.15)] blur-[100px] opacity-90" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center">
          <motion.div
            className="mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex -space-x-4">
                <img
                  src="/images/blog/profile1.jpg"
                  alt="Creator profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white w-10 h-10 object-cover"
                />
                <img
                  src="/images/blog/profile2.jpg"
                  alt="Creator profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white w-10 h-10 object-cover"
                />
                <img
                  src="/images/blog/profile3.jpg"
                  alt="Creator profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white w-10 h-10 object-cover"
                />
                <img
                  src="/images/blog/profile4.jpg"
                  alt="Creator profile"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-white w-10 h-10 object-cover"
                />
              </div>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-purple-800"
                    >
                      <path
                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                        fill="#4E1F88"
                        stroke="#4E1F88"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-[#555555] text-sm md:text-base">Trusted by 200+ Creators</span>
              </div>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-6xl lg:text-[76px] font-semibold text-center mb-8 tracking-[-4%] leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stay Inspired, Stay Ahead
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[#222222] text-center max-w-3xl leading-[1.805]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore expert insights, creator tips, and success stories designed to fuel your growth.
            Whether you&apos;re looking for content strategies, industry trends, or monetization hacks—we&apos;ve got you covered!
          </motion.p>
        </div>
      </div>
    </section>
  );
}