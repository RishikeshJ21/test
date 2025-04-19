import { Share, Bookmark, Heart, MessageCircle, ArrowLeft, X } from "lucide-react";
import { Button } from "./button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";

interface Comment {
  id: string;
  author: {
    name: string;
    image: string;
  };
  text: string;
  date: string;
  likes: number;
}

interface BlogPostProps {
  title: string;
  date: string;
  category: string;
  content: string[];
  imageSrc: string;
  slug: string;
  author:any;
}

const BlogPost = ({
  title,
  date,
  category,
  content,
  imageSrc,
  slug,
  author,
}: BlogPostProps) => {
  const readingTime = Math.ceil(content.join(" ").split(" ").length / 200);

  // State for interactive buttons
  const [likes, setLikes] = useState(88);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // State for comments
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  // Initial load from localStorage
  useEffect(() => {
    // Load likes and bookmarks status
    const storedLikeStatus = localStorage.getItem(`blog-${slug}-liked`);
    const storedBookmarkStatus = localStorage.getItem(`blog-${slug}-bookmarked`);
    const storedLikeCount = localStorage.getItem(`blog-${slug}-likes`);
    const storedComments = localStorage.getItem(`blog-${slug}-comments`);

    if (storedLikeStatus) setIsLiked(storedLikeStatus === 'true');
    if (storedBookmarkStatus) setIsBookmarked(storedBookmarkStatus === 'true');
    if (storedLikeCount) setLikes(parseInt(storedLikeCount));
    if (storedComments) setComments(JSON.parse(storedComments));

    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle like button click
  const handleLike = () => {
    const newLikeStatus = !isLiked;
    const newLikeCount = newLikeStatus ? likes + 1 : likes - 1;

    setIsLiked(newLikeStatus);
    setLikes(newLikeCount);

    localStorage.setItem(`blog-${slug}-liked`, String(newLikeStatus));
    localStorage.setItem(`blog-${slug}-likes`, String(newLikeCount));
  };

  // Handle bookmark button click
  const handleBookmark = () => {
    const newBookmarkStatus = !isBookmarked;
    setIsBookmarked(newBookmarkStatus);
    localStorage.setItem(`blog-${slug}-bookmarked`, String(newBookmarkStatus));
  };

  // Handle share button click
  const handleShare = async () => {
    const shareData = {
      title: title,
      text: `Check out this article: ${title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback - copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Handle adding a new comment
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: "You",
        image: "/testimonial/2.webp",
      },
      text: commentText,
      date: new Date().toLocaleDateString(),
      likes: 0
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setCommentText("");

    // Save to localStorage
    localStorage.setItem(`blog-${slug}-comments`, JSON.stringify(updatedComments));
  };

  // Handle comment button click to open comments panel
  const handleCommentClick = () => {
    setIsCommentsOpen(true);
  };

  // Handle closing comments panel
  const handleCloseComments = () => {
    setIsCommentsOpen(false);
  };

  return (
    <div className="min-h-screen bg-white py-8 relative">
      <div className={`transition-all duration-300 ${isCommentsOpen ? 'lg:pr-[400px]' : ''}`}>
        {/* Back to blog navigation */}
        <div className="max-w-3xl xl:max-w-2xl mx-auto px-4 mb-8">
          <Link to="/blog" className="flex items-center text-purple-600 hover:text-purple-800 transition-colors">
        <ArrowLeft size={18} className="mr-2" />
        <span className="font-medium">Back to all articles</span>
          </Link>
        </div>

        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl xl:max-w-2xl mx-auto px-4"
        >
          {/* Category Badge - Shown above title */}
          <div className="mb-3">
        <span className="text-sm font-medium text-purple-600 bg-purple-100 rounded-full px-3 py-1">
          {category}
        </span>
          </div>

          {/* Title */}
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl text-black font-bold mb-6" style={{ fontFamily: '"Playfair Display", serif' }}>
        {title}
          </h1>

          {/* Author info section */}
          <div className="flex items-center mb-4">
        <img
          src={author.image}
          alt={author.name}
          className="w-12 h-12 rounded-full mr-3"
        />
        <div>
          <div className="flex items-center">
            <span className="font-medium text-gray-900">{author.name}</span>
            <Button variant="ghost" size="sm" className="ml-2 text-sm h-8 px-3 py-0 text-purple-600 hover:text-purple-700  hover:bg-purple-100 ">
          Follow
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            <span>{readingTime} min read</span>
            <span className="mx-1">·</span>
            <span>{date}</span>
          </div>
        </div>
          </div>

          {/* Icons in a single line */}
          <div className="flex items-center space-x-6 mb-8 border-t pt-5 mt-10 border-gray-200 pb-5">
        <button
          onClick={handleLike}
          className="flex items-center text-gray-500 hover:text-gray-700 group"
        >
          <Heart
            size={20}
            className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover:text-red-500'} transition-colors`}
          />
          <span className={`ml-1 text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>{likes}</span>
        </button>

        <button
          onClick={handleCommentClick}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <MessageCircle size={20} className="text-gray-500" />
          <span className="ml-1 text-sm text-gray-500">{comments.length}</span>
        </button>

        <div className="flex-grow"></div>

        <button
          onClick={handleBookmark}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <Bookmark
            size={20}
            className={`${isBookmarked ? 'text-purple-600 fill-purple-600' : 'text-gray-500'} transition-colors`}
          />
        </button>

        <button
          onClick={handleShare}
          className="flex items-center text-gray-500 hover:text-gray-700"
        >
          <Share size={20} className="text-gray-500" />
        </button>
          </div>

          {/* Featured Image */}
          {imageSrc && (
        <div className="relative w-full h-[250px] md:h-[350px] lg:h-[450px] mb-8 rounded-lg overflow-hidden shadow-md">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
        {content.map((paragraph, index) => (
          <p key={index} className="text-base md:text-lg leading-relaxed mb-6 text-gray-800">
            {paragraph}
          </p>
        ))}
          </div>

          {/* Bottom engagement section */}
          <div className="mt-12 pt-6  ">
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Example tags - replace with actual tags if available */}
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Content Strategy</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Community Building</span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">Creator Economy</span>
        </div>

        {/* Same icon layout as the top */}
        <div className="flex items-center space-x-6 mb-6">
          <button
            onClick={handleLike}
            className="flex items-center text-gray-500 hover:text-gray-700 group"
          >
            <Heart
          size={20}
          className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover:text-red-500'} transition-colors`}
            />
            <span className={`ml-1 text-sm ${isLiked ? 'text-red-500' : 'text-gray-500 group-hover:text-red-500'}`}>{likes}</span>
          </button>

          <button
            onClick={handleCommentClick}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <MessageCircle size={20} className="text-gray-500" />
             <span className="ml-1 text-sm text-gray-500">{comments.length}</span>
          </button>

          <div className="flex-grow"></div>

          <button
            onClick={handleBookmark}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <Bookmark
          size={20}
          className={`${isBookmarked ? 'text-purple-600 fill-purple-600' : 'text-gray-500'} transition-colors`}
            />
          </button>

          <button
            onClick={handleShare}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <Share size={20} className="text-gray-500" />
          </button>
        </div>
          </div>

          {/* Join the Conversation Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-playfair text-3xl md:text-4xl text-black font-bold" style={{ fontFamily: '"Playfair Display", serif' }}>
          Share Your Thoughts
          </h2>
          <span className="text-gray-500 text-sm mt-2">Comments {comments.length}</span>
        </div>
        <p className="text-gray-600 mb-6">
          One Community. Many Voices. Create a free account to share your thoughts. Read our community guidelines <a href="#" className="text-blue-600 hover:underline">here</a>.
        </p>
        <button
          onClick={handleCommentClick}
          className="inline-flex items-center justify-center px-5 py-2 border border-blue-600 rounded-full text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
        >
          See All Comments ({comments.length})
        </button>
          </div>
        </motion.article>
      </div>

      {/* Desktop Side Panel Comments (lg and above) */}
      <AnimatePresence>
        {isCommentsOpen && (
          <>
            {/* Desktop comments panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 w-[400px] bg-white shadow-lg hidden lg:flex flex-col z-40 border-l border-gray-200"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30 }}
            >
              <div className="flex justify-between items-center text-black p-5 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Responses</h2>
                <button
                  onClick={handleCloseComments}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 border-b border-gray-200">
                <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-gray-500"
                    >
                      <path
                      fillRule="evenodd"
                      d="M12 2a6 6 0 100 12 6 6 0 000-12zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                      clipRule="evenodd"
                      />
                    </svg>
                    </div>
                  <p className="text-gray-500">Write a response</p>
                </div>

                <textarea
                  ref={commentInputRef}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={(e) => e.target.style.height = "auto"}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = "auto";
                  }}
                  placeholder="What are your thoughts?"
                  className="w-full text-black p-3 bg-gray-100 rounded-lg border-none resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none transition-all duration-300"
                  style={{ height: commentText.trim() ? "auto" : "50px", overflow: "hidden" }}
                  rows={4}
                />
                <div className="flex justify-end mt-3">
                  <Button
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300"
                  >
                    Respond
                  </Button>
                </div>
              </div>

              {/* Comments list */}
              <div className="overflow-y-auto flex-grow">
                {comments.length > 0 ? (
                  <div className="p-5 space-y-6">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex">
                                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center p-2 mr-3">
                   <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-10 h-10 rounded-full  text-gray-500"
                    >
                      <path
                      fillRule="evenodd"
                      d="M12 2a6 6 0 100 12 6 6 0 000-12zm0 14c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z"
                      clipRule="evenodd"
                      />
                    </svg>
                    </div>
                        {/* <img
                          src={comment.author.image}
                          alt={comment.author.name}
                          className="w-10 h-10 rounded-full mr-3"
                        /> */}
                        <div>
                          <div className="flex items-center mb-1">
                            <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                            <span className="text-gray-500 text-sm ml-2">{comment.date}</span>
                          </div>
                          <p className="text-gray-800">{comment.text}</p>
                          <div className="flex items-center mt-2">
                            <button className="text-gray-500 text-sm flex items-center">
                              <Heart size={16} className="mr-1" /> {comment.likes}
                            </button>
                            <button className="text-gray-500 text-sm flex items-center ml-4">
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                    <p className="mb-1 italic">There are currently no responses for this story.</p>
                    <p>Be the first to respond.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Mobile full screen overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-white z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">Responses</h2>
                  <button
                    onClick={handleCloseComments}
                    className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center mb-3">
                    <img
                      src="/testimonial/2.webp"
                      alt="Your profile"
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <p className="text-gray-500">Write a response</p>
                  </div>

                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="What are your thoughts?"
                    className="w-full p-3 bg-gray-100 rounded-lg border-none resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none"
                    rows={4}
                  />

                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={handleAddComment}
                      disabled={!commentText.trim()}
                      className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300"
                    >
                      Respond
                    </Button>
                  </div>
                </div>

                {/* Comments list - mobile */}
                <div className="overflow-y-auto flex-grow">
                  {comments.length > 0 ? (
                    <div className="p-4 space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="flex">
                          <img
                            src={comment.author.image}
                            alt={comment.author.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <div className="flex items-center mb-1">
                              <h4 className="font-medium text-gray-900">{comment.author.name}</h4>
                              <span className="text-gray-500 text-sm ml-2">{comment.date}</span>
                            </div>
                            <p className="text-gray-800">{comment.text}</p>
                            <div className="flex items-center mt-2">
                              <button className="text-gray-500 text-sm flex items-center">
                                <Heart size={16} className="mr-1" /> {comment.likes}
                              </button>
                              <button className="text-gray-500 text-sm flex items-center ml-4">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                      <p className="mb-1 italic">There are currently no responses for this story.</p>
                      <p>Be the first to respond.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPost;
