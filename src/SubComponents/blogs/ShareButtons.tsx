import { motion } from 'framer-motion';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  
  // Encode URL and title for sharing
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  // Check if Web Share API is supported
  const isWebShareSupported = typeof navigator !== 'undefined' && navigator.share;

  // Handle native device sharing
  const handleNativeShare = async () => {
    try {
      await navigator.share({
        title: title,
        text: `Check out this article: ${title}`,
        url: url
      });
      setShareStatus('Shared successfully!');
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(url);
        setShareStatus('Link copied to clipboard!');
      } catch (clipboardError) {
        setShareStatus('Sharing failed, please try again');
      }
    } finally {
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setShareStatus('Link copied to clipboard!');
      setTimeout(() => setShareStatus(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      setShareStatus('Failed to copy link');
      setTimeout(() => setShareStatus(null), 2000);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Share</h3>
      <div className="flex items-center space-x-5 mb-6 relative">
        {/* X (Twitter) */}
        <motion.a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 rounded-xl w-14 h-14 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all hover:bg-purple-700"
          aria-label="Share on X (Twitter)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="currentColor" 
              d="M8 2H1L9.26086 13.0145L1.44995 22H4.09998L10.4883 14.431L16 22H23L14.3917 10.5223L21.8001 2H19.1501L13.1643 9.0681L8 2ZM17 20L5 4H7L19 20H17Z"
            />
          </svg>
        </motion.a>

        {/* Facebook */}
        <motion.a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 rounded-xl w-14 h-14 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all hover:bg-purple-700"
          aria-label="Share on Facebook"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="currentColor" 
              d="M12.001 2C6.47813 2 2.00098 6.47715 2.00098 12C2.00098 16.9913 5.65783 21.1283 10.4385 21.8785V14.8906H7.89941V12H10.4385V9.79688C10.4385 7.29063 11.9314 5.90625 14.2156 5.90625C15.3097 5.90625 16.4541 6.10156 16.4541 6.10156V8.5625H15.1931C13.9509 8.5625 13.5635 9.33334 13.5635 10.1242V12H16.3369L15.8936 14.8906H13.5635V21.8785C18.3441 21.1283 22.001 16.9913 22.001 12C22.001 6.47715 17.5238 2 12.001 2Z"
            />
          </svg>
        </motion.a>

        {/* LinkedIn */}
        <motion.a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 rounded-xl w-14 h-14 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all hover:bg-purple-700"
          aria-label="Share on LinkedIn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              fill="currentColor" 
              d="M6.94 5C6.94 5.99 6.19 6.78 5.25 6.78C4.31 6.78 3.56 5.99 3.56 5C3.56 4.01 4.31 3.22 5.25 3.22C6.19 3.22 6.94 4.01 6.94 5ZM7 8.48H3.5V21H7V8.48ZM13.32 8.48H9.97V21H13.29V14.43C13.29 11.77 17.28 11.54 17.28 14.43V21H20.6V13.07C20.6 7.9 14.93 8.13 13.32 10.29V8.48Z"
            />
          </svg>
        </motion.a>
        
        {/* Copy link button */}
        <motion.button
          onClick={copyToClipboard}
          whileHover={{ scale: 1.05, backgroundColor: "#9333ea" }}
          whileTap={{ scale: 0.95 }}
          className="bg-purple-600 rounded-xl w-14 h-14 flex items-center justify-center text-white shadow-sm hover:shadow-md transition-all"
          aria-label="Copy link"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M9 17H7C4.79086 17 3 15.2091 3 13C3 10.7909 4.79086 9 7 9H9" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M15 17H17C19.2091 17 21 15.2091 21 13C21 10.7909 19.2091 9 17 9H15" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
            <path 
              d="M8 13H16" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </motion.button>

        {/* Status message */}
        {shareStatus && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute top-full left-0 right-0 mt-3 text-sm text-center py-2.5 px-4 bg-purple-100 rounded-md text-purple-800 font-medium shadow-sm border border-purple-200"
          >
            {shareStatus}
          </motion.div>
        )}
      </div>
      
      {/* Separator line */}
      <div className="h-px bg-gray-200 mb-6"></div>
    </div>
  );
};

export default ShareButtons; 