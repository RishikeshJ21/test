import { Share2, Clock, Tag, ArrowLeft, Check } from "lucide-react";
import { Separator } from "./separator";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";


interface BlogPostProps {
  title: string;
  date: string;
  category: string;
  content: string[];
  imageSrc: string;
}

const BlogPost = ({ title, date, category, content, imageSrc }: BlogPostProps) => {
  const readingTime = Math.ceil(content.join(" ").split(" ").length / 200);
  const [isCopied, setIsCopied] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);

  // Scroll to top when the component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out this article: ${title}`,
      url: window.location.href,
    };

    setShareError(null); // Reset error state
    setIsCopied(false); // Reset copied state

    try {
      if (navigator.share) {
        // Use Web Share API if available
        await navigator.share(shareData);
        console.log('Article shared successfully');
      } else {
        // Fallback: Copy URL to clipboard
        await navigator.clipboard.writeText(shareData.url);
        setIsCopied(true);
        // Hide the "Copied" message after a few seconds
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Attempt to copy to clipboard as a final fallback if sharing fails
      try {
        await navigator.clipboard.writeText(shareData.url);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (copyErr) {
        console.error('Error copying URL:', copyErr);
        setShareError('Could not share or copy the link.');
      }
    }
  };


  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl text-black mx-auto px-4 py-8"
    >
      {/* Back to blog navigation */}
      <div className="mb-8">
        <Link to="/blog" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
          <ArrowLeft size={18} className="mr-2" />
          <span className="font-medium">Back to all articles</span>
        </Link>
      </div>

      <header className="space-y-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time>{date}</time>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{readingTime} min read</span>
            </div>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl text-black lg:text-6xl font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>{title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-purple-500">{category}</span>
          </div>
          <div className="ml-auto relative">
            <Button variant="outline" size="sm" onClick={handleShare}>
              {isCopied ? (
                <>
                  <Check size={16} className="mr-2 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <Share2 size={16} className="mr-2" />
                  Share
                </>
              )}
            </Button>
            {shareError && <p className="text-xs text-red-500 absolute -bottom-5 right-0">{shareError}</p>}
          </div>
        </div>
      </header>

      {imageSrc && (
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-12 rounded-lg overflow-hidden shadow-lg">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        {content.map((paragraph, index) => (
          <p key={index} className="text-lg leading-relaxed mb-6 text-gray-800">
            {paragraph}
          </p>
        ))}
      </div>

      {/* <footer className="mt-12 pt-8 border-t">
        ... (footer content remains the same) ...
      </footer> */}

      {/* Related articles section could be added here */}
    </motion.article>
  );
};

export default BlogPost;
