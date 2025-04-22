import { Share, Heart, MessageCircle, ArrowLeft, X } from "lucide-react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { BlogPostProps, Comment, Reply } from "./types";
import UsernameModal from "./UsernameModal";
import CommentItem from "./CommentItem";
import MostView from "./Most_View";
import MetricsGraph from "./MetricsGraph";
import { formatTimeAgo } from "./utils";
import { blogPosts } from "../../data/blog";

// Placeholder TOC Item Interface
interface TocItem {
  id: string;
  title: string;
  level: number; // For potential indentation
}

const BlogPost = ({
  title,
  tags,
  content,
  imageSrc,
  slug,
  initialComments = [],
}: BlogPostProps) => {
  const [likes, setLikes] = useState(88);
  const [isLiked, setIsLiked] = useState(false);

  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isAddingReply, setIsAddingReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [activeTocId, setActiveTocId] = useState<string | null>(null);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextAreaRef = useRef<HTMLTextAreaElement>(null!);
  const commentsRefLg = useRef<HTMLDivElement>(null);
  const commentsRefMobile = useRef<HTMLDivElement>(null);

  const tocItems: TocItem[] = [
    { id: "section-1", title: "Making docs search easier and faster", level: 1 },
    { id: "section-2", title: "An AI assistant to help keep you in flow", level: 1 },
  ];

  useEffect(() => {
    const storedLikeStatus = localStorage.getItem(`blog-${slug}-liked`);
    const storedLikeCount = localStorage.getItem(`blog-${slug}-likes`);
    const storedComments = localStorage.getItem(`blog-${slug}-comments`);
    const storedUserName = localStorage.getItem("user-name");

    if (storedUserName) {
      setUserName(storedUserName);
    }

    if (storedLikeStatus) setIsLiked(storedLikeStatus === "true");
    if (storedLikeCount) setLikes(parseInt(storedLikeCount));
    if (storedComments) {
      try {
        const parsedComments: Comment[] = JSON.parse(storedComments);
        setComments(
          parsedComments.map((c) => ({
            ...c,
            isLiked: c.isLiked ?? false,
            showReplies: true,
          }))
        );
      } catch (error) {
        console.error("Failed to parse comments from localStorage", error);
        setComments(initialComments);
      }
    } else if (initialComments.length > 0) {
      setComments(
        initialComments.map((c) => ({
          ...c,
          showReplies: true,
        }))
      );
    }

    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    const handleResize = () => {
      if (isCommentsOpen && window.innerWidth < 1024) {
        document.body.style.overflow = "auto";
      } else if (isCommentsOpen && window.innerWidth >= 1024) {
        document.body.style.overflow = "hidden";
      }
    };

    if (isCommentsOpen && window.innerWidth >= 1024) {
      document.body.style.overflow = "hidden";
      window.addEventListener("resize", handleResize);
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("resize", handleResize);
    };
  }, [isCommentsOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isCommentsOpen) return;

      const target = event.target as Node;

      const isOutsideLg =
        commentsRefLg.current && !commentsRefLg.current.contains(target);
      const isOutsideMobile =
        commentsRefMobile.current &&
        !commentsRefMobile.current.contains(target);

      const commentButton = document.querySelector(
        '[aria-label="Show comments"]'
      );
      const isOutsideCommentButton =
        !commentButton || !commentButton.contains(target);

      if (isOutsideLg && isOutsideMobile && isOutsideCommentButton) {
        setIsCommentsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCommentsOpen]);

  useEffect(() => {
    const handleScroll = () => {
      let currentId: string | null = null;
      const scrollPosition = window.scrollY + 100;

      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentId = item.id;
        }
      });
      setActiveTocId(currentId);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocItems]);

  const handleLike = () => {
    const newLikeStatus = !isLiked;
    const newLikeCount = newLikeStatus ? likes + 1 : likes - 1;

    setIsLiked(newLikeStatus);
    setLikes(newLikeCount);

    localStorage.setItem(`blog-${slug}-liked`, String(newLikeStatus));
    localStorage.setItem(`blog-${slug}-likes`, String(newLikeCount));
  };

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
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    if (!userName) {
      setShowUsernameModal(true);
      return;
    }

    addNewComment();
  };

  const addNewComment = () => {
    if (!commentText.trim() || !userName) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: {
        name: userName,
        image: "/testimonial/1.webp",
      },
      text: commentText.trim(),
      date: "just now",
      likes: 0,
      isLiked: false,
      replies: [],
      showReplies: true,
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    setCommentText("");

    if (commentTextAreaRef.current) {
      commentTextAreaRef.current.style.height = "auto";
    }

    localStorage.setItem(
      `blog-${slug}-comments`,
      JSON.stringify(updatedComments)
    );
  };

  const handleCommentClick = () => {
    setIsCommentsOpen(true);
  };

  const handleCloseComments = () => {
    setIsCommentsOpen(false);
    setReplyingTo(null);
  };

  const handleLikeComment = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        const newLikedState = !(comment.isLiked ?? false);
        const newLikes = newLikedState
          ? comment.likes + 1
          : Math.max(0, comment.likes - 1);
        return { ...comment, likes: newLikes, isLiked: newLikedState };
      }
      return comment;
    });
    setComments(updatedComments);
    localStorage.setItem(`blog-${slug}-comments`, JSON.stringify(updatedComments));
  };

  const handleLikeReply = (commentId: string, replyId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId && comment.replies) {
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            const newLikedState = !(reply.isLiked ?? false);
            const newLikes = newLikedState
              ? reply.likes + 1
              : Math.max(0, reply.likes - 1);
            return { ...reply, likes: newLikes, isLiked: newLikedState };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    setComments(updatedComments);
    localStorage.setItem(`blog-${slug}-comments`, JSON.stringify(updatedComments));
  };

  const toggleShowReplies = (commentId: string) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, showReplies: !comment.showReplies };
      }
      return comment;
    });
    setComments(updatedComments);
  };

  const handleReplyComment = (commentId: string) => {
    if (!userName) {
      setIsAddingReply(true);
      setReplyingTo(commentId);
      setShowUsernameModal(true);
      return;
    }

    if (replyingTo === commentId) {
      setReplyingTo(null);
      setReplyText("");
      return;
    }

    setReplyingTo(commentId);
    setReplyText("");

    requestAnimationFrame(() => {
      if (replyTextAreaRef.current) {
        replyTextAreaRef.current.focus({ preventScroll: true });
      }
    });
  };

  const handleAddReply = () => {
    if (!replyText.trim() || !replyingTo || !userName) return;

    const commentToReply = comments.find((c) => c.id === replyingTo);
    if (!commentToReply) return;

    const newReply: Reply = {
      id: Date.now().toString(),
      author: {
        name: userName,
        image: "/testimonial/1.webp",
      },
      text: replyText.trim(),
      date: "just now",
      likes: 0,
      isLiked: false,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === replyingTo) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply],
          showReplies: true,
        };
      }
      return comment;
    });

    setComments(updatedComments);
    setReplyText("");
    setReplyingTo(null);

    localStorage.setItem(`blog-${slug}-comments`, JSON.stringify(updatedComments));
  };

  const handleUsernameSubmit = (name: string) => {
    setUserName(name);
    localStorage.setItem("user-name", name);
    setShowUsernameModal(false);

    if (isAddingReply && replyingTo) {
      setIsAddingReply(false);
    } else {
      addNewComment();
    }
  };

  const handleTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setCommentText(textarea.value);
  };

  const handleReplyTextareaInput = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setReplyText(textarea.value);
  };

  const handleTocClick = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveTocId(id);
    }
  };

  const mostViewedPosts = blogPosts
    .filter((post) => post.slug !== slug)
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-white relative">
      <div className="max-w-[1600px] mx-auto lg:px-10 flex flex-col lg:flex-row lg:gap-10 xl:gap-6 pt-8">

        <div className="hidden lg:block lg:w-54 xl:w-72 flex-shrink-0 lg:sticky lg:top-24 self-start pr-4 mt-8">
          <div className="p-5 rounded-lg border border-gray-100 shadow-sm">
            <div className="mb-6">
              <Link
                to="/blog"
                className="flex items-center text-gray-600 hover:text-purple-700 transition-colors text-sm"
              >
                <ArrowLeft size={16} className="mr-1.5" />
                Back to Blog Home
              </Link>
            </div>
            <hr className="border-gray-200 mb-4" />
            <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Table of contents</h3>
            <nav>
              <ul>
                {tocItems.map((item) => (
                  <li key={item.id} className="mb-1.5">
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => handleTocClick(item.id, e)}
                      className={`text-sm transition-colors ${activeTocId === item.id
                        ? 'text-purple-600 font-medium'
                        : 'text-gray-500 hover:text-gray-800'
                        }`}
                      style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
                    >
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <hr className="border-gray-200 my-4" />
            <a href="#" className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium">
              <svg className="w-4 h-4 mr-1.5 fill-current" viewBox="0 0 16 16"><path d="M5 10H3v4h2v-4zm4 0H7v4h2v-4zm4 0h-2v4h2v-4zM5 4H3v4h2V4zm4 0H7v4h2V4zm4 0h-2v4h2V4zM2 0v16h12V0H2zm10 14H4V2h8v12z" /></svg>
              Try it out today
            </a>
          </div>
        </div>

        <div className="flex-1 min-w-0 px-4 lg:px-0">
          <div className="mb-8 lg:hidden">
            <Link
              to="/blog"
              className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              <span className="font-medium">Back to all articles</span>
            </Link>
          </div>



          {/* <div className="mb-3 flex flex-wrap gap-2 justify-start">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="text-sm font-medium text-purple-600 bg-purple-100 rounded-full px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div> */}

          <div className="flex items-center justify-between space-x-6 mb-8  pt-1 mt-1    pb-5">
            <div className="flex items-center space-x-8">
              <button
                onClick={handleLike}
                className="flex items-center text-gray-500 hover:text-gray-700 group"
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart
                  size={20}
                  className={`${isLiked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-500 group-hover:text-red-500"
                    } transition-colors`}
                />
                <span
                  className={`ml-1 text-sm ${isLiked
                    ? "text-red-500"
                    : "text-gray-500 group-hover:text-red-500"
                    }`}
                >
                  {likes}
                </span>
              </button>

              <button
                onClick={handleCommentClick}
                className="flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Show comments"
              >
                <MessageCircle size={20} className="text-gray-500" />
                <span className="ml-1 text-sm text-gray-500">
                  {comments.length}
                </span>
              </button>
            </div>
            <div>
              <button
                onClick={handleShare}
                className="flex items-center text-gray-500 hover:text-gray-700"
                aria-label="Share post"
              >
                <Share size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {imageSrc && (
              <div className="relative w-full h-[250px] md:h-[350px] lg:h-[450px] mb-8 rounded-lg overflow-hidden shadow-md">
                <img
                  src={imageSrc}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              <section id="section-1" className="mb-10 scroll-mt-20">
                {content.slice(0, Math.ceil(content.length / 2)).map((paragraph, index) => (
                  <p key={`p1-${index}`} className="text-base md:text-lg leading-relaxed mb-6 text-gray-800">
                    {paragraph}
                  </p>
                ))}
              </section>
              <section id="section-2" className="mb-10 scroll-mt-20">
                {content.slice(Math.ceil(content.length / 2)).map((paragraph, index) => (
                  <p key={`p2-${index}`} className="text-base md:text-lg leading-relaxed mb-6 text-gray-800">
                    {paragraph}
                  </p>
                ))}
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h2
                  className="font-playfair text-3xl md:text-4xl text-black font-bold"
                  style={{ fontFamily: '"Playfair Display", serif' }}
                >
                  {comments.length > 0 ? "Responses" : "Responses"}
                </h2>
                <span className="text-gray-500 text-sm mt-2">
                  {comments.length}{" "}
                  {comments.length === 1 ? "response" : "responses"}
                </span>
              </div>

              <div className="mb-8">
                <div className="flex items-start space-x-3 mb-6">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <span className="font-medium">H</span>
                  </div>
                  <div className="flex-grow relative bg-gray-100 rounded-lg p-4">
                    <textarea
                      value={commentText}
                      onChange={handleTextareaInput}
                      placeholder="What are your thoughts?"
                      className="w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-black"
                      rows={1}
                      ref={commentTextAreaRef}
                    />
                    {commentText && (
                      <div className="flex justify-end items-center mt-4">
                        <div className="flex space-x-2">
                          <button
                            className="px-3 py-1 text-gray-700 hover:text-gray-900 rounded"
                            onClick={() => {
                              setCommentText("");
                              if (commentTextAreaRef.current)
                                commentTextAreaRef.current.style.height = "auto";
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            className={`px-3 py-1 rounded text-white ${commentText.trim()
                              ? "bg-purple-600 hover:bg-purple-700"
                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                              }`}
                          >
                            Respond
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {comments.length > 0 && (
                  <div>
                    {comments.slice(0, 3).map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        handleLikeComment={handleLikeComment}
                        handleLikeReply={handleLikeReply}
                        toggleShowReplies={toggleShowReplies}
                        handleReplyComment={handleReplyComment}
                        replyingTo={replyingTo}
                        replyText={replyText}
                        handleReplyTextareaInput={handleReplyTextareaInput}
                        handleAddReply={handleAddReply}
                        replyTextAreaRef={replyTextAreaRef}
                        formatTimeAgo={formatTimeAgo}
                      />
                    ))}

                    {comments.length > 3 && (
                      <div className="relative">
                        <div className="h-20"></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-white"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,1) 100%)",
                          }}
                        ></div>

                        <div className="absolute bottom-0 left-0 right-0 flex justify-start pb-4">
                          <button
                            onClick={() => setIsCommentsOpen(true)}
                            className="bg-transparent border border-black text-black px-6 py-2 rounded-full hover:bg-purple-700 hover:text-white transition-colors font-medium shadow-md"
                          >
                            See more responses
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {!comments.length && (
                <p className="text-gray-600 mb-6">
                  Be the first one to share what you think.
                </p>
              )}
            </div>
          </motion.article>
        </div>

        <div className="hidden lg:block lg:w-[350px] xl:w-[400px] flex-shrink-0 sticky lg:top-28 h-fit max-h-[calc(100vh-200px)] self-start pl-4 mt-8 overflow-hidden">
          <div className="space-y-6 pb-6">
            <MetricsGraph postTags={tags} slug={slug} />
            {mostViewedPosts.length > 0 && (
              <MostView relatedPosts={mostViewedPosts} />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showUsernameModal && (
          <UsernameModal
            isOpen={showUsernameModal}
            onClose={() => {
              setShowUsernameModal(false);
              setIsAddingReply(false);
              if (replyingTo && isAddingReply) {
                setReplyingTo(null);
              }
            }}
            onSubmit={handleUsernameSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCommentsOpen && (
          <>
            <motion.div
              ref={commentsRefLg}
              className="fixed top-0 right-0 bottom-0 w-[450px] bg-white shadow-lg hidden lg:flex flex-col z-40 border-l border-gray-200 overflow-y-auto"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center text-black p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="text-xl font-semibold">
                  Comments ({comments.length})
                </h2>
                <button
                  onClick={handleCloseComments}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                  aria-label="Close comments"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 border-b border-gray-200">
                {!replyingTo ? (
                  <>
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
                    {userName ? (
                      <>
                        <textarea
                          ref={commentInputRef}
                          value={commentText}
                          onChange={handleTextareaInput}
                          placeholder="What are your thoughts?"
                          className="w-full text-black p-3 bg-gray-50 rounded-md border border-gray-200 resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none transition-all duration-150 overflow-hidden"
                          rows={2}
                          style={{ minHeight: "50px" }}
                        />
                        <div className="flex justify-end mt-3">
                          <Button
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed"
                          >
                            Respond
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-center mt-2">
                        <Button
                          onClick={() => setShowUsernameModal(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Sign in to respond
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    Replying in thread...
                  </div>
                )}
              </div>

              <div className="px-5 flex-grow overflow-y-auto">
                {comments.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        handleLikeComment={handleLikeComment}
                        handleLikeReply={handleLikeReply}
                        toggleShowReplies={toggleShowReplies}
                        handleReplyComment={handleReplyComment}
                        replyingTo={replyingTo}
                        replyText={replyText}
                        handleReplyTextareaInput={handleReplyTextareaInput}
                        handleAddReply={handleAddReply}
                        replyTextAreaRef={replyTextAreaRef}
                        formatTimeAgo={formatTimeAgo}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 min-h-[200px]">
                    <MessageCircle size={40} className="mb-4 text-gray-400" />
                    <p className="mb-1 font-semibold">No responses yet.</p>
                    <p>Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>
            </motion.div>

            <div
              className="fixed inset-0 bg-transparent z-30 hidden lg:block"
              onClick={() => setIsCommentsOpen(false)}
            ></div>

            <motion.div
              ref={commentsRefMobile}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-white z-50 lg:hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-xl text-black font-semibold">
                  Responses ({comments.length})
                </h2>
                <button
                  onClick={handleCloseComments}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100"
                  aria-label="Close comments"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto flex-grow p-4">
                {comments.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {comments.map((comment) => (
                      <CommentItem
                        key={comment.id}
                        comment={comment}
                        handleLikeComment={handleLikeComment}
                        handleLikeReply={handleLikeReply}
                        toggleShowReplies={toggleShowReplies}
                        handleReplyComment={handleReplyComment}
                        replyingTo={replyingTo}
                        replyText={replyText}
                        handleReplyTextareaInput={handleReplyTextareaInput}
                        handleAddReply={handleAddReply}
                        replyTextAreaRef={replyTextAreaRef}
                        formatTimeAgo={formatTimeAgo}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                    <MessageCircle size={40} className="mb-4 text-gray-400" />
                    <p className="mb-1 font-semibold">No responses yet.</p>
                    <p>Be the first to share your thoughts!</p>
                  </div>
                )}
              </div>

              {!replyingTo && (
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
                  <div className="flex items-start mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-1">
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
                    <p className="text-gray-500 pt-2">Write a response</p>
                  </div>

                  {userName ? (
                    <div className="pl-13">
                      <textarea
                        ref={commentTextAreaRef}
                        value={commentText}
                        onChange={handleTextareaInput}
                        placeholder="What are your thoughts?"
                        className="w-full p-3 bg-gray-50 rounded-md border border-gray-200 resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none text-black"
                        rows={1}
                        style={{ minHeight: "44px" }}
                      />
                      <div className="flex justify-end mt-2">
                        <Button
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                          className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed"
                        >
                          Respond
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 pl-13 flex justify-start">
                      <Button
                        onClick={() => setShowUsernameModal(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Sign in to respond
                      </Button>
                    </div>
                  )}
                </div>
              )}
              {replyingTo && (
                <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0 text-sm text-gray-500">
                  Replying in thread...
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BlogPost;