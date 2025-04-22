import { motion } from 'framer-motion';

const MetricsGraph = () => {
  return (
    <motion.div
      className="w-full bg-white rounded-2xl border-2 border-purple-600 p-4 shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, type: "spring" }}
    >
      <div className="text-center">
        <h2 className="text-5xl font-extrabold text-purple-700 mb-2">21</h2>
        <div className="bg-purple-100 rounded-md py-1 px-3 inline-block">
          <span className="text-xl font-bold text-black">DAYS</span>
        </div>
        <h3 className="mt-2 text-2xl font-bold text-white bg-black py-1 px-3 inline-block rounded">
          CHALLENGE
        </h3>
        <p className="mt-4 text-base text-gray-700 font-medium">
          Build better habits <br /> in just 3 weeks
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-5 bg-black text-white px-7 py-2 rounded-full font-semibold w-full"
        >
          JOIN NOW
        </motion.button>
        <p className="mt-4 text-xs text-purple-700 font-semibold">
          Get motivated and start your transformation!
        </p>
      </div>
    </motion.div>
  );
};

export default MetricsGraph;