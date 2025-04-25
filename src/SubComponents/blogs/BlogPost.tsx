import { ArrowLeft, X, MessageCircle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../button";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { BlogPostProps, Comment, Reply, TocSection } from "./types";
import UsernameModal from "./UsernameModal";
import CommentItem from "./CommentItem";
import RelatedArticles from "./Most_View";
import MetricsGraph from "./MetricsGraph";
import { formatTimeAgo } from "./utils";
import { blogPosts } from "../../data/blog";
import { fetchRelatedBlogs, RelatedPost } from "./api";
import { 
  fetchCommentsByBlogId, 
  addCommentToBlog, 
  deleteComment, 
  addReplyToBlogComment, 
  deleteReply, 
  toggleLikeComment,
  toggleLikeReply, 
  createOrUpdateBlogUser,
  fetchBlogBySlug
} from "../../utils/apiClient";

// Add a style block at the top level of the component
const blogContentStyles = `
  .blog-content a {
    color: #8b5cf6 !important; /* violet-600 */
    font-weight: 500;
    text-decoration: underline;
    transition: color 0.2s ease;
  }
  
  .blog-content a:hover {
    color: #7c3aed !important; /* violet-700 */
  }
`;

const BlogPost = ({
  title,
  tags,
  content,
  imageSrc,
  slug,
  initialComments = [],
  tocSections = [],
  isCommentsOpen = false,
  onToggleComments,
}: BlogPostProps) => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [isAddingReply, setIsAddingReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [userAvatar, setUserAvatar] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [blogId, setBlogId] = useState<number | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [hasLoadedAllComments, setHasLoadedAllComments] = useState(false);
  const [isRespondAnimating, setIsRespondAnimating] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  
  // Use refs to prevent duplicate API calls
  const commentsLoadedRef = useRef(false);
  const blogIdLoadedRef = useRef(false);
  const isMountedRef = useRef(true);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextAreaRef = useRef<HTMLTextAreaElement>(null!);
  const commentsRefLg = useRef<HTMLDivElement>(null);
  const commentsRefMobile = useRef<HTMLDivElement>(null);

  const currentCategory = tags.length > 0 ? tags[0] : undefined;

  // Set isMounted on component initialization and cleanup
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // First, get the actual blog ID from the slug
  useEffect(() => {
    const getBlogId = async () => {
      // Skip if we already have the blog ID
      if (blogIdLoadedRef.current || blogId) return;
      
      try {
        // Fetch blog details to get the ID
        const blog = await fetchBlogBySlug(slug);
        
        // Check if component is still mounted before updating state
        if (isMountedRef.current && blog && blog.id) {
          setBlogId(blog.id);
          blogIdLoadedRef.current = true;
        }
      } catch (error) {
        // Error is already handled by API client
      }
    };

    getBlogId();
  }, [slug, blogId]);

  // Then use that ID to fetch comments and load user data
  useEffect(() => {
    // This function handles user data loading
    const loadUserData = () => {
      const storedUserData = localStorage.getItem("blog-user-data");
    const storedUserName = localStorage.getItem("user-name");

    if (storedUserName) {
      setUserName(storedUserName);
    }

      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          
          if (userData) {
            // Only set user data if we have it
            if (userData.name) setUserName(userData.name);
            if (userData.email) setUserEmail(userData.email);
            if (userData.avatar) setUserAvatar(userData.avatar);
            
            // For user_id, we need the numeric ID from the API response, not the username
            if (userData.id) {
              setUserId(userData.id.toString());
            } else if (userData.user_id) {
              setUserId(userData.user_id.toString());
            }
          }
        } catch (error) {
          // Error parsing user data - unable to set user data
        }
      }
    };

    // Load user data
    loadUserData();

    // Only fetch initial comments (with limit) if we have a blog ID
    const getInitialComments = async () => {
      // Don't proceed if any of these conditions are true
      if (!blogId || isLoadingComments || commentsLoadedRef.current || !isMountedRef.current) {
        return;
      }
      
      setIsLoadingComments(true);
      
      try {
        // Fetch only 3 comments initially
        const response = await fetchCommentsByBlogId(blogId.toString(), 4);
        
        // Check if component is still mounted before updating state
        if (!isMountedRef.current) return;
        
        if (response.success && response.data) {
          // Make sure we handle the response format correctly
          const commentsData = Array.isArray(response.data) ? response.data : [];
          
          // Map API response to Comment interface format with safety checks
          const formattedComments = commentsData.map((c: any) => {
            // Always create a safe author object with fallbacks
            const author = {
              name: c.user?.username || "Anonymous",
              image: c.user?.avatar || "/testimonial/1.webp",
              username: c.user?.username || "",
              user_id: c.user?.id?.toString() || ""
            };

            // Handle replies with safety checks
            const replies = Array.isArray(c.replies) 
              ? c.replies.map((r: any) => ({
                  id: r.id?.toString() || `reply-${Date.now()}-${Math.random()}`,
                  author: {
                    name: r.user?.username || "Anonymous",
                    image: r.user?.avatar || "/testimonial/1.webp",
                    username: r.user?.username || "",
                    user_id: r.user?.id?.toString() || ""
                  },
                  text: r.content || "",
                  date: r.created_at || new Date().toISOString(),
                  likes: r.likes_count || 0,
                  isLiked: Array.isArray(r.likes) && userId && r.likes.some((like: any) => 
                    like.user_id?.toString() === userId || like.username === userId
                  )
                }))
              : [];
            
            return {
              id: c.id?.toString() || `comment-${Date.now()}-${Math.random()}`,
              author,
              text: c.content || "",
              date: c.created_at || new Date().toISOString(),
              likes: c.likes_count || 0,
              isLiked: Array.isArray(c.likes) && userId && c.likes.some((like: any) => 
                like.user_id?.toString() === userId || like.username === userId
              ),
            showReplies: true,
              replies
            };
          });
          
          setComments(formattedComments);
          
          // Mark comments as loaded
          commentsLoadedRef.current = true;
        } else {
          setComments(initialComments);
        }
      } catch (error) {
        setComments(initialComments);
      } finally {
        if (isMountedRef.current) {
          setIsLoadingComments(false);
        }
      }
    };

    getInitialComments();
  }, [blogId, initialComments, userId]);

  // Reset loaded flags when the slug changes
  useEffect(() => {
    return () => {
      commentsLoadedRef.current = false;
      blogIdLoadedRef.current = false;
    };
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
        if (onToggleComments) onToggleComments(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCommentsOpen, onToggleComments]);

  useEffect(() => {
    const handleScroll = () => {
      if (tocSections.length === 0) return;
      
      // Get viewport metrics
      const viewportTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const viewportBottom = viewportTop + viewportHeight;
      const viewportMiddle = viewportTop + (viewportHeight / 2);
      
      // Find which section has its heading closest to 1/4 of the viewport
      // This prioritizes sections near the top of the viewport
      const targetPosition = viewportTop + (viewportHeight * 0.25); 
      
      let bestSection = null;
      let bestDistance = Infinity;
      
      // Find the section with heading closest to our target position
      for (const section of tocSections) {
        const element = document.getElementById(section.id);
        if (element) {
          // Get the position of the section heading
          const elemTop = element.getBoundingClientRect().top + window.scrollY;
          
          // Calculate the distance from our target position
          const distance = Math.abs(elemTop - targetPosition);
          
          // Update best section if this one is closer to target
          if (distance < bestDistance) {
            bestDistance = distance;
            bestSection = section.id;
        }
        }
      }
      
      // Special case: if we're at the very top, select the first section
      if (window.scrollY < 50 && tocSections.length > 0) {
        bestSection = tocSections[0].id;
      }
      
      setActiveTocId(bestSection);
    };

    // Set initial active section
    setTimeout(handleScroll, 100);

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tocSections]);

  useEffect(() => {
    const getRelatedBlogs = async () => {
      try {
        setIsLoadingRelated(true);
        const related = await fetchRelatedBlogs(slug, currentCategory, 6);
        setRelatedPosts(related);
      } catch (error) {
        // Error is already handled by API client
      } finally {
        setIsLoadingRelated(false);
      }
    };

    getRelatedBlogs();
  }, [slug, currentCategory]);

  // Function to load all comments when "See more responses" is clicked
  const handleLoadAllComments = async () => {
    if (!blogId || isLoadingComments || hasLoadedAllComments) return;
    
    setIsLoadingComments(true);
    
    try {
      // Fetch all comments without limit
      const response = await fetchCommentsByBlogId(blogId.toString());
      
      if (response.success && response.data) {
        // Format comments as before
        const commentsData = Array.isArray(response.data) ? response.data : [];
        
        const formattedComments = commentsData.map((c: any) => {
          const author = {
            name: c.user?.username || "Anonymous",
            image: c.user?.avatar || "/testimonial/1.webp",
            username: c.user?.username || "",
            user_id: c.user?.id?.toString() || ""
          };

          const replies = Array.isArray(c.replies) 
            ? c.replies.map((r: any) => ({
                id: r.id?.toString() || `reply-${Date.now()}-${Math.random()}`,
                author: {
                  name: r.user?.username || "Anonymous",
                  image: r.user?.avatar || "/testimonial/1.webp",
                  username: r.user?.username || "",
                  user_id: r.user?.id?.toString() || ""
                },
                text: r.content || "",
                date: r.created_at || new Date().toISOString(),
                likes: r.likes_count || 0,
                isLiked: Array.isArray(r.likes) && userId && r.likes.some((like: any) => 
                  like.user_id?.toString() === userId || like.username === userId
                )
              }))
            : [];
          
          return {
            id: c.id?.toString() || `comment-${Date.now()}-${Math.random()}`,
            author,
            text: c.content || "",
            date: c.created_at || new Date().toISOString(),
            likes: c.likes_count || 0,
            isLiked: Array.isArray(c.likes) && userId && c.likes.some((like: any) => 
              like.user_id?.toString() === userId || like.username === userId
            ),
            showReplies: true,
            replies
          };
        });
        
        setComments(formattedComments);
        setHasLoadedAllComments(true);
      }
    } catch (error) {
      // Error is already handled by API client
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    // Check if user is logged in
    if (!userName) {
      // Check sessionStorage to see if user just completed Google sign-in
      const isSignInComplete = sessionStorage.getItem("google-signin-complete");
      if (isSignInComplete) {
        // User has signed in already, try to get their data from localStorage instead
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            if (userData.name) {
              setUserName(userData.name);
              // Proceed with comment after getting user data
              setTimeout(() => handleAddComment(), 500);
              return;
            }
          } catch (e) {
            // Error parsing user data - continue to show login modal
          }
        }
      }
      
      // No valid session data, show the modal
      setShowUsernameModal(true);
      return;
    }

    // Trigger respond animation
    setIsRespondAnimating(true);
    setTimeout(() => setIsRespondAnimating(false), 800);
    
    // Set submitting state
    setIsSubmittingComment(true);

    // Get userId from state or try to get it from localStorage if missing
    let currentUserId = userId;
    let currentBlogId = blogId;
    
    if (!currentUserId) {
      try {
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserId = (userData.id || userData.user_id)?.toString();
          if (currentUserId) {
            setUserId(currentUserId); // Update state for future requests
          }
        }
      } catch (error) {
        // Error getting user ID from localStorage
      }
    }
    
    // Get blogId if missing by fetching from API
    if (!currentBlogId) {
      try {
        const blog = await fetchBlogBySlug(slug);
        if (blog && blog.id) {
          currentBlogId = blog.id;
          setBlogId(currentBlogId); // Update state for future requests
        }
      } catch (error) {
        // Error fetching blog ID
      }
    }

    // Final check if we have the required IDs
    if (!currentUserId || !currentBlogId) {
      // If we're missing user ID, prompt sign in
      if (!currentUserId) {
        setShowUsernameModal(true);
      }
      
      // Show error notification
      setNotificationType("error");
      setNotificationMessage("Failed to add comment. Please sign in again.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      // Set submitting state to false
      setIsSubmittingComment(false);
      return;
    }

    try {
      const response = await addCommentToBlog({
        blog_id: currentBlogId,
        content: commentText.trim(),
        user_id: currentUserId
      });

      if (response.success && response.data) {
        // Format the API response to match the Comment interface structure
        const apiComment = response.data;
        
        // Create a properly formatted comment object
        const formattedComment: Comment = {
          id: apiComment.id?.toString() || `comment-${Date.now()}`,
      author: {
            name: apiComment.user?.username || userName,
            image: apiComment.user?.avatar || userAvatar,
            username: apiComment.user?.username || userName,
            user_id: apiComment.user?.id?.toString() || currentUserId
      },
          text: apiComment.content || commentText.trim(),
          date: apiComment.created_at || new Date().toISOString(),
          likes: apiComment.likes_count || 0,
      isLiked: false,
      showReplies: true,
          replies: [],
          isNew: true // Add a flag to identify new comments for animation
    };

        // Add the new formatted comment to the beginning of the array
        const updatedComments = [formattedComment, ...comments];
    setComments(updatedComments);
    setCommentText("");

    if (commentTextAreaRef.current) {
      commentTextAreaRef.current.style.height = "auto";
    }

        // After a delay, remove the isNew flag
        setTimeout(() => {
          setComments(currentComments => 
            currentComments.map(comment => 
              comment.id === formattedComment.id 
                ? { ...comment, isNew: false } 
                : comment
            )
          );
        }, 2000);
        
        // Show success notification
        setNotificationType("success");
        setNotificationMessage("Comment added successfully!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        // Show error notification
        setNotificationType("error");
        setNotificationMessage("Failed to add comment. Please try again.");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      // Show error notification
      setNotificationType("error");
      setNotificationMessage("Error adding comment. Please try again.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      // Set submitting state to false
      setIsSubmittingComment(false);
    }
  };

  const handleCloseComments = () => {
    if (onToggleComments) onToggleComments(false);
    setReplyingTo(null);
  };

  const handleLikeComment = async (commentId: string) => {
    // First update the UI optimistically
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
    
    // Get userId from state or try to get it from localStorage if missing
    let currentUserId = userId;
    let currentBlogId = blogId;
    
    if (!currentUserId) {
      try {
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserId = (userData.id || userData.user_id)?.toString();
          if (currentUserId) {
            setUserId(currentUserId); // Update state for future requests
          }
        }
      } catch (error) {
        // Error getting user ID from localStorage
      }
    }
    
    // Get blogId if missing by fetching from API
    if (!currentBlogId) {
      try {
        const blog = await fetchBlogBySlug(slug);
        if (blog && blog.id) {
          currentBlogId = blog.id;
          setBlogId(currentBlogId); // Update state for future requests
        }
      } catch (error) {
        // Error fetching blog ID
      }
    }
    
    // Then update the server
    try {
      if (!currentUserId || !currentBlogId) {
        // If we're missing user ID, prompt sign in
        if (!currentUserId) {
          setShowUsernameModal(true);
        }
        return;
      }
      
      await toggleLikeComment({
        blog_id: currentBlogId,
        comment_id: commentId,
        user_id: currentUserId
      });
    } catch (error) {
      // Revert the optimistic update on error
      setComments(comments);
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    // First update the UI optimistically
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
    
    // Get userId from state or try to get it from localStorage if missing
    let currentUserId = userId;
    let currentBlogId = blogId;
    
    if (!currentUserId) {
      try {
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserId = (userData.id || userData.user_id)?.toString();
          if (currentUserId) {
            setUserId(currentUserId); // Update state for future requests
          }
        }
      } catch (error) {
        // Error getting user ID from localStorage
      }
    }
    
    // Get blogId if missing by fetching from API
    if (!currentBlogId) {
      try {
        const blog = await fetchBlogBySlug(slug);
        if (blog && blog.id) {
          currentBlogId = blog.id;
          setBlogId(currentBlogId); // Update state for future requests
        }
      } catch (error) {
        // Error fetching blog ID
      }
    }
    
    // Then update the server
    try {
      if (!currentUserId || !currentBlogId) {
        // If we're missing user ID, prompt sign in
        if (!currentUserId) {
          setShowUsernameModal(true);
        }
        return;
      }
      
      // Use the specific toggleLikeReply function for replies
      await toggleLikeReply({
        blog_id: currentBlogId,
        reply_id: replyId,
        user_id: currentUserId
      });
    } catch (error) {
      // Revert the optimistic update on error
      setComments(comments);
    }
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
    // Check if user is logged in
    if (!userName) {
      // Check sessionStorage to see if user just completed Google sign-in
      const isSignInComplete = sessionStorage.getItem("google-signin-complete");
      if (isSignInComplete) {
        // User has signed in already, try to get their data from localStorage instead
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          try {
            const userData = JSON.parse(storedUserData);
            if (userData.name) {
              setUserName(userData.name);
              // Retry the reply action after setting user name
              setTimeout(() => handleReplyComment(commentId), 500);
              return;
            }
          } catch (e) {
            // Error parsing user data - unable to set user data
          }
        }
      }
      
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

  const handleAddReply = async () => {
    if (!replyingTo || !replyText.trim()) return;
    if (!userName) {
      setShowUsernameModal(true);
      return;
    }

    // Set submitting state
    setIsSubmittingReply(true);

    // Get userId from state or try to get it from localStorage if missing
    let currentUserId = userId;
    let currentBlogId = blogId;
    
    if (!currentUserId) {
      try {
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserId = (userData.id || userData.user_id)?.toString();
          if (currentUserId) {
            setUserId(currentUserId); // Update state for future requests
          }
        }
      } catch (error) {
        // Error getting user ID from localStorage
      }
    }
    
    // Get blogId if missing by fetching from API
    if (!currentBlogId) {
      try {
        const blog = await fetchBlogBySlug(slug);
        if (blog && blog.id) {
          currentBlogId = blog.id;
          setBlogId(currentBlogId); // Update state for future requests
        }
      } catch (error) {
        // Error fetching blog ID
      }
    }
    
    // Final check if we have the required IDs
    if (!currentUserId || !currentBlogId) {
      // If we're missing user ID, prompt sign in
      if (!currentUserId) {
        setShowUsernameModal(true);
      }
      
      // Show error notification
      setNotificationType("error");
      setNotificationMessage("Failed to add reply. Please sign in again.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      
      setIsSubmittingReply(false);
      return;
    }

    // Create a temporary ID until we get the real one from the server
    const tempId = `temp-${Date.now()}`;
    const newReplyDate = new Date().toISOString();

    // Find the comment we're replying to
    const commentToUpdate = comments.find((comment) => comment.id === replyingTo);
    if (!commentToUpdate) return;

    // Prepare the new reply
    const newReply: Reply = {
      id: tempId,
      author: {
        name: userName,
        image: userAvatar,
        user_id: currentUserId
      },
      text: replyText.trim(),
      date: newReplyDate,
      likes: 0,
      isLiked: false,
      isLoading: true // Add loading state for the reply
    };

    // First update the UI optimistically
    const updatedComments = comments.map((comment) => {
      if (comment.id === replyingTo) {
        const existingReplies = comment.replies || [];
        return {
          ...comment,
          replies: [...existingReplies, newReply],
          showReplies: true
        };
      }
      return comment;
    });
    setComments(updatedComments);
    setReplyingTo(null);
    setReplyText("");

    // Trigger animation
    setIsRespondAnimating(true);
    setTimeout(() => setIsRespondAnimating(false), 800);

    // Then update the server
    try {
      const response = await addReplyToBlogComment({
        blog_id: currentBlogId,
        comment_id: replyingTo,
        content: replyText.trim(),
        user_id: currentUserId
      });

      if (response.success && response.data) {
        // Format the API response to match the Reply interface
        const apiReply = response.data;
        
        // Create a properly formatted reply object
        const formattedReply: Reply = {
          id: apiReply.id?.toString() || tempId,
          author: {
            name: apiReply.user?.username || userName,
            image: apiReply.user?.avatar || userAvatar,
            username: apiReply.user?.username || userName,
            user_id: apiReply.user?.id?.toString() || currentUserId
          },
          text: apiReply.content || replyText.trim(),
          date: apiReply.created_at || newReplyDate,
          likes: apiReply.likes_count || 0,
          isLiked: false,
          isLoading: false
        };
        
        // Replace the temporary reply with the properly formatted one from the server
        // Using the current state to avoid stale references
        setComments(prevComments => {
          return prevComments.map((comment) => {
            if (comment.id === replyingTo && comment.replies) {
              return {
                ...comment,
                replies: comment.replies.map((reply) => 
                  reply.id === tempId ? formattedReply : reply
                )
              };
            }
            return comment;
          });
        });
        
        // Show success notification
        setNotificationType("success");
        setNotificationMessage("Reply added successfully!");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      } else {
        // Revert the optimistic update
        setComments(prevComments => prevComments.map(comment => {
          if (comment.id === replyingTo && comment.replies) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== tempId)
            };
          }
          return comment;
        }));
        
        // Show error notification
        setNotificationType("error");
        setNotificationMessage("Failed to add reply. Please try again.");
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (error) {
      // Revert the optimistic update
      setComments(prevComments => prevComments.map(comment => {
        if (comment.id === replyingTo && comment.replies) {
          return {
            ...comment,
            replies: comment.replies.filter(reply => reply.id !== tempId)
          };
        }
        return comment;
      }));
      
      // Show error notification
      setNotificationType("error");
      setNotificationMessage("Error adding reply. Please try again.");
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    } finally {
      // Set submitting state to false
      setIsSubmittingReply(false);
    }
  };

  const handleUsernameSubmit = async (name: string) => {
    // Get user data from localStorage (set by UsernameModal)
    const storedUserData = localStorage.getItem("blog-user-data");
    
    let username = "";
    let email = "";
    let avatar = "";
    let user_id = "";
    
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserName(userData.name || name);
        setUserEmail(userData.email || "");
        setUserAvatar(userData.avatar || "");
        
        // Store the user info
        username = userData.username || "";
        email = userData.email || "";
        avatar = userData.avatar || "";
        
        // Create or update the user in the database
        try {
          if (username && email) {
            const response = await createOrUpdateBlogUser({
              username,
              name,
              email,
              avatar
            });
            
            // Extract the numeric user ID from the response
            if (response.success && response.data && response.data.id) {
              user_id = response.data.id.toString();
              
              // Update the stored user data with the numeric ID
              const updatedUserData = {
                ...userData,
                id: response.data.id,
                user_id: response.data.id
              };
              
              // Save the updated user data with ID
              localStorage.setItem("blog-user-data", JSON.stringify(updatedUserData));
              
              // Update state
              setUserId(user_id);
            }
          }
        } catch (error) {
          // Failed to create/update user
        }
      } catch (error) {
    setUserName(name);
      }
    } else {
      setUserName(name);
    }
    
    setShowUsernameModal(false);

    // Focus on the comment textarea after a slight delay to allow state updates
    setTimeout(() => {
      if (commentTextAreaRef.current) {
        commentTextAreaRef.current.focus();
      }
    }, 100);

    if (isAddingReply && replyingTo) {
      setIsAddingReply(false);
    } else if (commentText.trim()) {
      // If the user was trying to add a comment, proceed with it now
      handleAddComment();
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

  //  on clicking on the title in TOC how much to scroll is defined in the offsetTop
  const handleTocClick = (id: string, event: React.MouseEvent) => {
    event.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
      setActiveTocId(id);
    }
  };

  // Scroll to top only on initial load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteComment = async (commentId: string) => {
    // Get userId from state or try to get it from localStorage if missing
    let currentUserId = userId;
    let currentBlogId = blogId;
    
    if (!currentUserId) {
      try {
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserId = (userData.id || userData.user_id)?.toString();
          if (currentUserId) {
            setUserId(currentUserId); // Update state for future requests
          }
        }
      } catch (error) {
        // Error getting user ID from localStorage
      }
    }
    
    // Get blogId if missing by fetching from API
    if (!currentBlogId) {
      try {
        const blog = await fetchBlogBySlug(slug);
        if (blog && blog.id) {
          currentBlogId = blog.id;
          setBlogId(currentBlogId); // Update state for future requests
        }
      } catch (error) {
        // Error fetching blog ID
      }
    }
    
    // Make sure we have blog ID
    if (!currentBlogId) {
      return;
    }
    
    // First update the UI optimistically
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    
    try {
      // Call API to delete the comment
      const response = await deleteComment(currentBlogId, commentId);
      
      if (!response.success) {
        // Revert the optimistic update
        setComments(comments);
      }
    } catch (error) {
      // Revert the optimistic update
      setComments(comments);
    }
  };
  
  const handleDeleteReply = async (commentId: string, replyId: string) => {
    // Get userId from state or try to get it from localStorage if missing
    let currentUserId = userId;
    let currentBlogId = blogId;
    
    if (!currentUserId) {
      try {
        const storedUserData = localStorage.getItem("blog-user-data");
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          currentUserId = (userData.id || userData.user_id)?.toString();
          if (currentUserId) {
            setUserId(currentUserId); // Update state for future requests
          }
        }
      } catch (error) {
        // Error getting user ID from localStorage
      }
    }
    
    // Get blogId if missing by fetching from API
    if (!currentBlogId) {
      try {
        const blog = await fetchBlogBySlug(slug);
        if (blog && blog.id) {
          currentBlogId = blog.id;
          setBlogId(currentBlogId); // Update state for future requests
        }
      } catch (error) {
        // Error fetching blog ID
      }
    }
    
    // Make sure we have blog ID
    if (!currentBlogId) {
      return;
    }
    
    // First update the UI optimistically
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId && comment.replies) {
        const updatedReplies = comment.replies.filter(reply => reply.id !== replyId);
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    setComments(updatedComments);
    
    try {
      // Call API to delete the reply
      const response = await deleteReply(currentBlogId, commentId, replyId);
      
      if (!response.success) {
        // Revert the optimistic update
        setComments(comments);
      }
    } catch (error) {
      // Revert the optimistic update
      setComments(comments);
    }
  };

  return (
    <div className="bg-white relative w-full">
      <style dangerouslySetInnerHTML={{ __html: blogContentStyles }} />
      {/* Notification Popup */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg flex items-center z-50 ${
              notificationType === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {notificationType === "success" ? (
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">{notificationMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full max-w-none">
        <div className="lg:grid lg:grid-cols-12 lg:gap-6">
          {/* Left TOC sidebar - making narrower */}
          <div className="hidden lg:block lg:col-span-2 sticky top-28 h-fit max-h-[calc(100vh-200px)] self-start pl-4 pr-4">
            {/* Return to blog link above TOC */}
            <div className="mb-6 pl-0">
              <Link 
                to="/blog" 
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors text-base font-medium"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-2" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                  />
                </svg>
                Back to Blog Home
              </Link>
            </div>
            
            {/* Separator line */}
            <div className="h-px bg-gray-200 my-5"></div>
            
            {/* Table of Contents */}
            <div className="mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-5">Table of contents</h3>
              {tocSections.length > 0 ? (
                <nav>
                  <ul className="space-y-3">
                    {tocSections.map((section) => (
                      <li key={section.id} className="leading-tight">
                        <a
                          href={`#${section.id}`}
                          onClick={(e) => handleTocClick(section.id, e)}
                          className={`text-sm transition-colors block ${
                            activeTocId === section.id
                              ? 'text-purple-600 font-semibold'
                              : 'text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ) : (
                <p className="text-sm text-gray-500">No sections available</p>
              )}
            </div>
          </div>

          {/* Main content - making wider */}
          <div className="lg:col-span-7 px-4 md:px-6 sm:px-4 lg:px-0 mx-auto w-full max-w-3xl">
            <div className="mb-8 lg:hidden flex items-center justify-between">
              <Link
                to="/blog"
                className="flex items-center text-purple-600 hover:text-purple-800 transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                <span className="font-medium">Back to all articles</span>
              </Link>
              
              {/* Mobile TOC dropdown */}
              {tocSections.length > 0 && (
                <div className="relative inline-block text-left">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                    onClick={() => {
                      const tocElement = document.getElementById('mobile-toc');
                      if (tocElement) {
                        tocElement.classList.toggle('hidden');
                      }
                    }}
                  >
                    <span className="mr-2">Contents</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div id="mobile-toc" className="hidden absolute right-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-2 px-3">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Table of contents</h4>
                      <ul className="space-y-2">
                        {tocSections.map((section) => (
                          <li key={`mobile-${section.id}`} className="leading-tight">
                            <a
                              href={`#${section.id}`}
                              onClick={(e) => {
                                handleTocClick(section.id, e);
                                const tocElement = document.getElementById('mobile-toc');
                                if (tocElement) {
                                  tocElement.classList.add('hidden');
                                }
                              }}
                              className="text-sm text-gray-700 hover:text-purple-600 block py-1"
                            >
                              {section.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="md:px-0 sm:px-0 px-0"
            >
              {imageSrc && (
                <div className="relative w-full h-[200px] sm:h-[300px] md:h-[400px] lg:h-[450px] mb-8 rounded-lg overflow-hidden shadow-md">
                  <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none sm:prose-base prose-sm">
                {content.map((paragraph, index) => (
                  <div key={`content-${index}`} 
                       className="text-base md:text-lg sm:text-base text-sm leading-relaxed mb-6 text-gray-800 blog-content"
                       dangerouslySetInnerHTML={{ __html: paragraph }}>
                  </div>
                ))}
                
                {/* End of article marker */}
                <div className="flex items-center justify-center my-10 md:my-14 opacity-80">
                  <div className="flex items-center space-x-3 md:space-x-5">
                    <div className="h-px bg-gray-400 w-10 md:w-16"></div>
                    <div className="text-purple-600">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                        <circle cx="12" cy="12.003" r="4"></circle>
                        <circle cx="12" cy="12.003" r="8"></circle>
                      </svg>
                    </div>
                    <div className="h-px bg-gray-400 w-10 md:w-16"></div>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Right sidebar - show collapsible on mobile, below content */}
          <div className="lg:col-span-3 lg:sticky lg:top-28 h-fit lg:max-h-[calc(100vh-200px)] lg:self-start lg:pl-5 lg:pr-4">
            <div className="hidden lg:block space-y-6">
              <MetricsGraph postTags={tags} slug={slug} />
              
              {isLoadingRelated ? (
                <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex justify-center items-center" style={{ minHeight: "200px" }}>
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
                </div>
              ) : relatedPosts.length > 0 ? (
                <RelatedArticles 
                  relatedPosts={relatedPosts} 
                  currentCategory={currentCategory}
                />
              ) : null}
            </div>
            
            {/* Mobile version of Related Articles - show below content */}
            <div className="lg:hidden mt-10 mx-0 sm:mx-0 px-4 sm:px-6">
              <MetricsGraph postTags={tags} slug={slug} />
              
              {isLoadingRelated ? (
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-center items-center mt-6" style={{ minHeight: "100px" }}>
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-600"></div>
          </div>
              ) : relatedPosts.length > 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Related Articles</h3>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 3).map((post) => (
                      <Link 
                        key={post.id || post.slug} 
                        to={`/blog/${post.slug}`}
                        className="flex items-start space-x-3 group"
                      >
                        <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden">
                          <img 
                            src={post.image || '/placeholder-image.jpg'} 
                            alt={post.title} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">{post.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>        
      </div>

      {/* Add clear spacing between content and responses */}
      <div className="h-48"></div>
      
      {/* Responses section - full width */}
        <div className="w-full pt-10 border-t border-gray-200 bg-white">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl md:text-3xl text-gray-900 font-semibold">
                  Comments
                </h2>
                {/* <span className="text-gray-500 text-sm">
                  {comments.length}{" "}
                  {comments.length === 1 ? "response" : "responses"}
                </span> */}
              </div>

              <div className="mb-12">
                <div className="flex gap-4 mb-10">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1 overflow-hidden">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-medium">
                        {userName ? userName.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <motion.div
                      className="bg-gray-50 rounded-xl p-4 shadow-sm"
                      animate={isRespondAnimating ? {
                        scale: [1, 1.02, 1],
                        boxShadow: [
                          "0 1px 3px rgba(0,0,0,0.1)",
                          "0 4px 6px rgba(124,58,237,0.1)",
                          "0 1px 3px rgba(0,0,0,0.1)"
                        ]
                      } : {}}
                      transition={{ duration: 0.8 }}
                    >
                      <textarea
                        value={commentText}
                        onChange={handleTextareaInput}
                        placeholder="What are your thoughts?"
                        className="w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-800 min-h-[60px] placeholder-gray-400"
                        rows={1}
                        ref={commentTextAreaRef}
                      />
                    </motion.div>
                    {commentText && (
                      <div className="flex justify-end mt-4">
                        <div className="flex gap-3">
                          <button
                            className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-full text-sm font-medium"
                            onClick={() => {
                              setCommentText("");
                              if (commentTextAreaRef.current)
                                commentTextAreaRef.current.style.height = "auto";
                            }}
                            disabled={isSubmittingComment}
                          >
                            Cancel
                          </button>
                          <motion.button
                            onClick={handleAddComment}
                            disabled={!commentText.trim() || isSubmittingComment}
                            className={`px-4 py-2 rounded-full text-white text-sm font-medium ${
                              commentText.trim() && !isSubmittingComment
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "bg-gray-300 text-gray-600 cursor-not-allowed"
                            }`}
                            whileTap={{ scale: 0.95 }}
                          >
                            {isSubmittingComment ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                <span>Submitting...</span>
                              </div>
                            ) : (
                              "Respond"
                            )}
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {comments.length > 0 && (
                  <div className="space-y-6">
                    <AnimatePresence>
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
                          handleDeleteComment={handleDeleteComment}
                          handleDeleteReply={handleDeleteReply}
                          currentUserId={userId}
                          isSubmittingReply={isSubmittingReply}
                      />
                    ))}
                    </AnimatePresence>

                    {comments.length > 3 && (
                      <div className="relative mt-10">
                        <div className="h-20"></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-transparent to-white"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,1) 100%)",
                          }}
                        ></div>

                        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                          <button
                            onClick={() => {
                              handleLoadAllComments();
                              if (onToggleComments) onToggleComments(true);
                            }}
                            className="bg-white border border-purple-600 text-purple-600 px-6 py-2 rounded-full hover:bg-purple-50 transition-colors font-medium shadow-sm"
                            disabled={isLoadingComments}
                          >
                            {isLoadingComments ? (
                              <div className="flex items-center">
                                <div className="animate-spin h-4 w-4 border-2 border-purple-600 border-t-transparent rounded-full mr-2"></div>
                                Loading...
                              </div>
                            ) : (
                              "See more responses"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!comments.length && (
                  <div className="flex items-center justify-center p-8 text-center bg-gray-50 rounded-lg mt-4">
                    <p className="text-gray-600">
                      Be the first one to share what you think.
                    </p>
                  </div>
                )}
              </div>
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
                              disabled={!commentText.trim() || isSubmittingComment}
                              className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed"
                            >
                              {isSubmittingComment ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                  <span>Submitting...</span>
                                </div>
                              ) : (
                                "Respond"
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-center mt-2">
                          <Button
                            onClick={() => setShowUsernameModal(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                            disabled={isSubmittingComment}
                          >
                            {isSubmittingComment ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                <span>Submitting...</span>
                              </div>
                            ) : (
                              "Sign in to respond"
                            )}
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
                      <AnimatePresence>
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
                            handleDeleteComment={handleDeleteComment}
                            handleDeleteReply={handleDeleteReply}
                            currentUserId={userId}
                            isSubmittingReply={isSubmittingReply}
                        />
                      ))}
                      </AnimatePresence>
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
                onClick={() => handleCloseComments()}
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
                      <AnimatePresence>
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
                            handleDeleteComment={handleDeleteComment}
                            handleDeleteReply={handleDeleteReply}
                            currentUserId={userId}
                            isSubmittingReply={isSubmittingReply}
                        />
                      ))}
                      </AnimatePresence>
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
                            disabled={!commentText.trim() || isSubmittingComment}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed"
                          >
                            {isSubmittingComment ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                <span>Submitting...</span>
                              </div>
                            ) : (
                              "Respond"
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 pl-13 flex justify-start">
                        <Button
                          onClick={() => setShowUsernameModal(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          disabled={isSubmittingComment}
                        >
                          {isSubmittingComment ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            "Sign in to respond"
                          )}
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