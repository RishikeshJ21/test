import { motion } from 'framer-motion';
import { Calendar, Clock, Award, TrendingUp } from 'lucide-react';

interface MetricsGraphProps {
  postTags?: string[];
  slug?: string;
}

const MetricsGraph = ({ postTags, slug }: MetricsGraphProps) => {
  // Use slug to create a unique ID for analytics tracking
  const uniqueId = slug ? `challenge-${slug}` : 'challenge';
  
  return (
    <motion.div
      className="w-full bg-white rounded-xl border border-purple-200 p-4 shadow-md overflow-hidden relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      id={uniqueId}
    >
      {/* Professional gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-purple-100 z-0"></div>
      
      {/* Decorative circle elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-full -mr-8 -mt-8 z-0 opacity-80"></div>
      <div className="absolute bottom-0 left-0 w-28 h-28 bg-purple-100 rounded-full -ml-10 -mb-10 z-0 opacity-80"></div>
      
      {/* Decorative dots pattern */}
      <div className="absolute right-6 bottom-12 z-0">
        <div className="grid grid-cols-3 gap-1.5">
          {[...Array(9)].map((_, i) => (
            <div key={`dot-${i}`} className="w-1.5 h-1.5 rounded-full bg-purple-300 opacity-60"></div>
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
        {/* Challenge badge with icon */}
        <div className="flex justify-center mb-5">
          <div className="bg-purple-100 rounded-full py-1 px-3 inline-flex items-center">
            <Award className="w-4 h-4 mr-1.5 text-purple-700" />
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Challenge</span>
          </div>
        </div>
        
        {/* Days counter with enhanced visuals */}
        <div className="text-center mb-5">
          <div className="flex flex-col items-center">
            <div className="rounded-lg py-2 px-6 bg-gradient-to-r from-purple-500 to-purple-600 shadow-sm">
              <h2 className="text-2xl font-bold text-white mb-0">21</h2>
              <div className="flex items-center justify-center mt-1">
                <span className="text-xs font-medium text-purple-100 uppercase tracking-wider">Days</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* Descriptive text with icon */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-gray-700 font-medium">
              Build better habits in just 3 weeks
            </p>
          </div>
          
          {/* CTA button with enhanced design */}
          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: '#7e22ce' }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium w-full transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
            onClick={() => window.open("https://t.me/+dKB7kUlsbFFkMDM1", "_blank")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            JOIN NOW
          </motion.button>
          {/* Motivational text */}
          <p className="text-xs text-center text-purple-600 font-medium pt-1">
            Get motivated and start your transformation!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default MetricsGraph;