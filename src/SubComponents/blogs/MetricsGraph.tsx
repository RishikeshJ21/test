import { motion } from 'framer-motion';

interface MetricsGraphProps {
  postTags?: string[];
  slug?: string;
}

const MetricsGraph = ({ postTags, slug }: MetricsGraphProps) => {
  // Use slug to create a unique ID for analytics tracking
  const uniqueId = slug ? `challenge-${slug}` : 'challenge';
  
  return (
    <motion.div
      className="w-full bg-white rounded-xl border border-purple-200 p-5 shadow-sm overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      id={uniqueId}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-full -mr-8 -mt-8 z-0"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-purple-50 rounded-full -ml-10 -mb-10 z-0"></div>
      
      <div className="text-center relative z-10">
        <div className="flex items-center justify-center mb-2">
          <div className="bg-purple-100 rounded-lg py-1 px-3 inline-flex items-center justify-center">
            <h2 className="text-3xl font-bold text-purple-700 mr-2">21</h2>
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Days</span>
          </div>
        </div>
        
        <h3 className="mb-3 text-base font-bold text-gray-800 bg-gray-100 py-1 px-3 inline-block rounded-md">
          CHALLENGE
        </h3>
        
        {/* {postTags && postTags.length > 0 && (
          <p className="mb-3 text-xs text-gray-500">
            Related to: <span className="font-medium">{postTags[0]}</span>
          </p>
        )} */}
        
        <p className="mb-4 text-sm text-gray-700 font-medium">
          Build better habits in just 3 weeks
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: '#7e22ce' }}
          whileTap={{ scale: 0.98 }}
          className="mb-2 bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium w-full transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          JOIN NOW
        </motion.button>
        
        <p className="text-xs text-purple-600 font-medium">
          Get motivated and start your transformation!
        </p>
      </div>
    </motion.div>
  );
};

export default MetricsGraph;