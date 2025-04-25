import { ArrowLeft, X, MessageCircle } from "lucide-react";
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
  fetchCommentsByBlogSlug,
  addCommentToBlog, 
  fetchRepliesByCommentId, 
  addReplyToComment, 
  toggleLike, 
  createOrUpdateBlogUser,
  fetchBlogUserById,
  deleteComment,
  deleteReply,
  fetchBlogUserByUsername,
  fetchAllBlogUsers,
  fetchBlogLikes
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
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [blogId, setBlogId] = useState<string | number | null>(null);
  const [userDataMap, setUserDataMap] = useState<Record<string, any>>({});
  const [likedContent, setLikedContent] = useState<Record<string, boolean>>({});
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const commentTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const replyTextAreaRef = useRef<HTMLTextAreaElement>(null!);
  const commentsRefLg = useRef<HTMLDivElement>(null);
  const commentsRefMobile = useRef<HTMLDivElement>(null);

  const currentCategory = tags.length > 0 ? tags[0] : undefined;

  useEffect(() => {
    const storedUserName = localStorage.getItem("user-name");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Reset blogId when slug changes
    setBlogId(null);
    
    let isMounted = true; // Flag to prevent state updates after unmount
    
    const fetchBlogDetails = async () => {
      try {
        // Get blog details first to get the ID
        const blogModule = await import("../../utils/apiClient");
        
        // Check if slug is available
        if (!slug) {
          console.error("No slug provided, cannot fetch blog details");
          return null;
        }
        
        try {
          const blogData = await blogModule.fetchBlogBySlug(slug);
          
          if (blogData && typeof blogData === 'object' && 'id' in blogData && blogData.id && isMounted) {
            setBlogId(blogData.id);
            return blogData.id;
          } else {
            console.error("Blog details incomplete or invalid format", blogData);
            // Try to use any available ID from the data if available
            if (blogData && typeof blogData === 'object' && 'id' in blogData) {
              return blogData.id;
            }
            return null;
          }
        } catch (fetchError) {
          console.error("Error in fetchBlogBySlug:", fetchError);
          // If we have a blog ID already from props or state, use that as fallback
          if (blogId) {
            return blogId;
          }
          return null;
        }
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
        // Use existing blogId if available as fallback
        if (blogId) {
          return blogId;
        }
        return null;
      }
    };

    const fetchComments = async () => {
      try {
        // First get the blog ID
        const id = await fetchBlogDetails();
        
        if (id && isMounted) {
          await loadComments(id);
        } else if (isMounted) {
          setComments(initialComments);
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error);
        if (isMounted) {
          setComments(initialComments);
        }
      }
    };

    // Only fetch once when component mounts or slug changes
    fetchComments();
    window.scrollTo(0, 0);
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Fetch and set user data from stored user info
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserData = localStorage.getItem("blog-user-data");
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUserName(userData.name || "");
          setUserEmail(userData.email || "");
          setUserAvatar(userData.avatar || "");
          
          // Try to fetch user ID if we have a username
          if (userData.username) {
            try {
              const userResponse = await fetchBlogUserByUsername(userData.username);
              if (userResponse.success && userResponse.data) {
                setUserId(userResponse.data.id.toString());
              } else {
                // Create user if not found
                const newUserResponse = await createOrUpdateBlogUser({
                  username: userData.username,
                  name: userData.name || userData.username,
                  email: userData.email || "",
                  avatar: userData.avatar || "/testimonial/1.webp",
                });
                
                if (newUserResponse.success && newUserResponse.data) {
                  setUserId(newUserResponse.data.id.toString());
                }
              }
            } catch (error) {
              console.error("Error fetching/creating user:", error);
            }
          }
        } catch (error) {
          console.error("Failed to parse user data", error);
        }
      }
    };
    
    fetchUserData();
  }, []);

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
        console.error("Failed to fetch related blogs:", error);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    getRelatedBlogs();
  }, [slug, currentCategory]);

  const handleAddComment = async () => {
    try {
      // Validate comment text and user info
      if (!commentText.trim()) {
        return;
      }

      if (!userName) {
        setShowUsernameModal(true);
        return;
      }

      // Show loading animation
      setIsSubmittingComment(true);

      // Check if we have a user ID or need to create/update a user
      let currentUserId = userId;
      if (!currentUserId) {
        try {
          // Create or update a user with the name
          const createResponse = await createOrUpdateBlogUser({
            username: userName,
            name: userName,
            email: userEmail || "",
            avatar: userAvatar || "",
          });
          
          if (createResponse.success && createResponse.data) {
            currentUserId = createResponse.data.id;
            setUserId(currentUserId);
            localStorage.setItem("blog_user_id", currentUserId.toString());
          } else {
            alert("Failed to create user. Please try again.");
            setIsSubmittingComment(false);
            return;
          }
        } catch (error) {
          console.error("Error creating user:", error);
          alert("An error occurred. Please try again.");
          setIsSubmittingComment(false);
          return;
        }
      }
      
      // Get the blog ID if we don't have it
      let currentBlogId = blogId;
      if (!currentBlogId && slug) {
        try {
          // Import fetchBlogBySlug from apiClient if needed
          const apiClient = await import("../../utils/apiClient");
          const blogResponse = await apiClient.fetchBlogBySlug(slug);
          if (blogResponse.success && blogResponse.data) {
            currentBlogId = blogResponse.data.id;
          } else {
            alert("Failed to fetch blog details. Please try again.");
            setIsSubmittingComment(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching blog:", error);
          alert("An error occurred. Please try again.");
          setIsSubmittingComment(false);
          return;
        }
      }
      
      if (!currentBlogId) {
        alert("Blog ID is missing. Cannot add comment.");
        setIsSubmittingComment(false);
        return;
      }
      
      // Prepare the comment data
      const commentData = {
        blog_id: currentBlogId,
        user_id: currentUserId,
        content: commentText.trim(),
      };
      
      // Submit the comment
      const response = await addCommentToBlog(commentData);
      
      if (response.success && response.data) {
        // Create a formatted comment object to add to our state
        const newComment = {
          id: response.data.id || `temp-${Date.now()}`,
          text: commentText,
          author: {
            name: userName,
            image: userAvatar || "/testimonial/1.webp",
          },
          date: new Date().toISOString(),
          likes: 0,
          isLiked: false,
          replies: [],
          showReplies: false, // Hide replies by default
          user_id: currentUserId,
        };
        
        // Add the new comment to the beginning of the comments array
        setComments([newComment, ...comments]);
        setCommentText("");
        
        // Reset the textarea height
        if (commentTextAreaRef.current) {
          commentTextAreaRef.current.style.height = "auto";
        }
      } else {
        alert("Failed to add comment. Please try again.");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("An error occurred. Please try again.");
    } finally {
      // Hide loading animation when done
      setIsSubmittingComment(false);
    }
  };

  const handleCloseComments = () => {
    if (onToggleComments) onToggleComments(false);
    setReplyingTo(null);
  };

  const handleLikeComment = async (commentId: string) => {
    if (!userId) {
      setShowUsernameModal(true);
      return;
    }

    try {
      const likeData = {
        user_id: userId,
        target_type: "comment" as "comment" | "blog" | "reply",
        target_id: commentId
      };
      
      // Use 'comment-{id}' format for key
      const likeKey = `comment-${commentId}`;
      
      // Check current liked status
      const currentLikedState = likedContent[likeKey] || false;
      const newLikedState = !currentLikedState;
      
      // Start optimistic update for UI
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId) {
          const newLikes = newLikedState
            ? comment.likes + 1
            : Math.max(0, comment.likes - 1);
          return { ...comment, likes: newLikes, isLiked: newLikedState };
        }
        return comment;
      });
      setComments(updatedComments);
      
      // Update the liked content map
      const updatedLikedContent = { ...likedContent };
      if (newLikedState) {
        updatedLikedContent[likeKey] = true;
      } else {
        delete updatedLikedContent[likeKey];
      }
      setLikedContent(updatedLikedContent);
      
      console.log("Updated like status:", updatedLikedContent); // Debugging
      
      // Then perform actual API call
      const response = await toggleLike(likeData);
      
      if (!response.success) {
        // Revert optimistic update if API call failed
        console.error("Failed to toggle like:", response.error);
        // Revert back to original state
        setComments(comments);
        setLikedContent(likedContent);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert back to original state
      setComments(comments);
      setLikedContent(likedContent);
    }
  };

  const handleLikeReply = async (commentId: string, replyId: string) => {
    if (!userId) {
      setShowUsernameModal(true);
      return;
    }

    try {
      const likeData = {
        user_id: userId,
        target_type: "reply" as "comment" | "blog" | "reply",
        target_id: replyId
      };
      
      // Use 'reply-{id}' format for key
      const likeKey = `reply-${replyId}`;
      
      // Check current liked status
      const currentLikedState = likedContent[likeKey] || false;
      const newLikedState = !currentLikedState;
      
      // Start optimistic update for UI
      const originalComments = [...comments];
      const updatedComments = comments.map((comment) => {
        if (comment.id === commentId && comment.replies) {
          const updatedReplies = comment.replies.map((reply) => {
            if (reply.id === replyId) {
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
      
      // Update the liked content map
      const updatedLikedContent = { ...likedContent };
      if (newLikedState) {
        updatedLikedContent[likeKey] = true;
      } else {
        delete updatedLikedContent[likeKey];
      }
      setLikedContent(updatedLikedContent);
      
      console.log("Updated reply like status:", updatedLikedContent); // Debugging
      
      // Then perform actual API call
      const response = await toggleLike(likeData);
      
      if (!response.success) {
        // Revert optimistic update if API call failed
        console.error("Failed to toggle reply like:", response.error);
        setComments(originalComments);
        setLikedContent(likedContent);
      }
    } catch (error) {
      console.error("Error toggling reply like:", error);
      setComments(comments);
      setLikedContent(likedContent);
    }
  };

  const toggleShowReplies = async (commentId: string) => {
    // Toggle UI state first for responsiveness
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, showReplies: !comment.showReplies };
      }
      return comment;
    });
    setComments(updatedComments);
    
    // Fetch replies if they haven't been loaded yet
    const comment = comments.find(c => c.id === commentId);
    if (comment && comment.showReplies && (!comment.replies || comment.replies.length === 0)) {
      try {
        const response = await fetchRepliesByCommentId(commentId);
        if (response.success && response.data) {
          // Update the comment with fetched replies
          const updatedCommentsWithReplies = comments.map((c) => {
            if (c.id === commentId) {
              return { 
                ...c, 
                replies: response.data.map((reply: any) => {
                  // Format author data
                  const authorData = {
                    name: reply.author_name || "Anonymous",
                    image: reply.author_image || "/testimonial/1.webp",
                  };
                  
                  // Check if this reply is liked by the current user
                  // Use the same format as loadLikeStatus
                  const replyLikeKey = `reply-${reply.id}`;
                  const isLiked = likedContent[replyLikeKey] || false;
                  
                  return {
                    id: reply.id,
                    author: authorData,
                    text: reply.content,
                    date: reply.created_at,
                    likes: reply.likes_count || 0,
                    isLiked: isLiked,
                    user_id: reply.user?.id || "",
                  };
                })
              };
            }
            return c;
          });
          setComments(updatedCommentsWithReplies);
        }
      } catch (error) {
        console.error("Failed to fetch replies:", error);
      }
    }
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

  const handleAddReply = async () => {
    try {
      // Validate reply and user info
      if (!replyText.trim()) {
        return;
      }
      if (!userName) {
        setShowUsernameModal(true);
        return;
      }
      
      // Show loading animation
      setIsSubmittingComment(true);
      
      // Make sure we have the user ID
      let currentUserId = userId;
      if (!currentUserId) {
        try {
          // Create or update the user
          const createResponse = await createOrUpdateBlogUser({
            username: userName,
            name: userName,
            email: userEmail || "",
            avatar: userAvatar || "", // Don't use default image here
          });
          
          if (createResponse.success && createResponse.data) {
            currentUserId = createResponse.data.id;
            setUserId(currentUserId);
            localStorage.setItem("blog_user_id", currentUserId.toString());
          } else {
            alert("Failed to create user. Please try again.");
            setIsSubmittingComment(false);
            return;
          }
        } catch (error) {
          console.error("Error creating user:", error);
          alert("An error occurred. Please try again.");
          setIsSubmittingComment(false);
          return;
        }
      }
      
      // Prepare the reply data
      const replyData = {
        comment_id: replyingTo || '',
        user_id: currentUserId,
        content: replyText.trim()
      };
      
      // Make sure we have a valid comment ID
      if (!replyingTo) {
        alert("Comment ID is missing. Cannot add reply.");
        setIsSubmittingComment(false);
        return;
      }
      
      // Submit the reply
      const response = await addReplyToComment(replyData);
      
      if (response.success && response.data) {
        // Update the UI with the new reply
        const updatedComments = comments.map(comment => {
          if (comment.id === replyingTo) {
            // Keep the current showReplies value
            const currentShowReplies = comment.showReplies;
            return {
              ...comment,
              replies: [...(comment.replies || []), {
                id: response.data.id || Date.now().toString(),
                author: {
                  name: userName,
                  image: userAvatar || "/testimonial/1.webp", // Only use default for UI
                },
                text: replyText.trim(),
                date: new Date().toISOString(),
                likes: 0,
                isLiked: false,
                user_id: currentUserId,
              }],
              showReplies: true, // Always show replies after adding one
            };
          }
          return comment;
        });
        
        setComments(updatedComments);
        setReplyText("");
        setReplyingTo(null);
        
        // Reset the textarea height
        if (replyTextAreaRef.current) {
          replyTextAreaRef.current.style.height = "auto";
        }
      } else {
        alert("Failed to add reply. Please try again.");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
      alert("An error occurred. Please try again.");
    } finally {
      // Hide loading animation when done
      setIsSubmittingComment(false);
    }
  };

  const handleUsernameSubmit = async (name: string) => {
    // Get user data from localStorage (set by UsernameModal)
    const storedUserData = localStorage.getItem("blog-user-data");
    
    let username = '';
    
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        setUserName(userData.name || name);
        setUserEmail(userData.email || "");
        setUserAvatar(userData.avatar || "");
        username = userData.username || name.toLowerCase().replace(/\s/g, '_');
      } catch (error) {
        console.error("Failed to parse user data", error);
        setUserName(name);
        username = name.toLowerCase().replace(/\s/g, '_');
      }
    } else {
      setUserName(name);
      username = name.toLowerCase().replace(/\s/g, '_');
    }
    
    // If we don't have an actual user avatar, don't use the default image in the backend
    const avatarToSend = userAvatar && userAvatar !== "/testimonial/1.webp" ? userAvatar : "";
    // Create or update user in the API
    try {
      const userResponse = await createOrUpdateBlogUser({
        username,
        name: name,
        email: userEmail || `${username}@example.com`,
        avatar: avatarToSend,
      });
      
      if (userResponse.success && userResponse.data) {
        setUserId(userResponse.data.id.toString());
      }
    } catch (error) {
      console.error("Failed to create/update user", error);
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

  const handleDeleteComment = async (commentId: string) => {
    if (!userId) {
      return;
    }

    try {
      const response = await deleteComment(commentId, userId);
      
      if (response.success) {
        // Update state by removing the deleted comment
        const updatedComments = comments.filter(comment => comment.id !== commentId);
        setComments(updatedComments);
        
        // Also refresh comments from server to ensure we have the latest data
        if (blogId) {
          const commentResponse = await fetchCommentsByBlogId(blogId);
          if (commentResponse.success && commentResponse.data) {
            // This will trigger a re-render with the latest data from the server
            // We would need to reformat the data but this is a simple way to refresh
            await loadComments(blogId);
          }
        }
      } else {
        console.error("Failed to delete comment:", response.error);
        alert("Failed to delete comment. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Helper function to reload comments
  const loadComments = async (blogId: string | number) => {
    try {
      // Prevent duplicate calls if already loading
      if (isLoadingComments) return;
      
      setIsLoadingComments(true);
      
      // Load all users first to avoid multiple API calls
      const userMap = await loadAllUserData();
      
      // Load the like status for this blog
      const likeMap = await loadLikeStatus(blogId);
      
      // Use the ID to fetch comments
      const response = await fetchCommentsByBlogId(blogId);
      
      if (response.success && response.data) {
        // Format the API response to match our Comment type
        const formattedComments = response.data.map((c: any) => {
          // Get user data from preloaded user map
          let authorData = { name: "Anonymous", image: "/testimonial/1.webp" };
          if (c.user && c.user.id && userMap[c.user.id]) {
            const userData = userMap[c.user.id];
            authorData = {
              name: userData.name || userData.username || "Anonymous",
              image: userData.avatar || "/testimonial/1.webp",
            };
          }
          
          // Check if this comment is liked by the current user
          // Use consistent key format with loadLikeStatus
          const commentLikeKey = `comment-${c.id}`;
          const isLiked = likeMap ? !!likeMap[commentLikeKey] : false;
          
          // Process replies if they exist
          let replies: any[] = [];
          if (Array.isArray(c.replies) && c.replies.length > 0) {
            replies = c.replies.map((r: any) => {
              // Get reply author data from preloaded user map
              let replyAuthorData = { name: "Anonymous", image: "/testimonial/1.webp" };
              if (r.user && r.user.id && userMap[r.user.id]) {
                const userData = userMap[r.user.id];
                replyAuthorData = {
                  name: userData.name || userData.username || "Anonymous",
                  image: userData.avatar || "/testimonial/1.webp",
                };
              }
              
              // Check if this reply is liked by the current user
              // Use consistent key format with loadLikeStatus
              const replyLikeKey = `reply-${r.id}`;
              const isReplyLiked = likeMap ? !!likeMap[replyLikeKey] : false;
              
              return {
                id: r.id || `temp-reply-${Date.now()}-${Math.random()}`,
                author: replyAuthorData,
                text: r.content || "",
                date: r.created_at || new Date().toISOString(),
                likes: r.likes_count || 0,
                isLiked: isReplyLiked,
                user_id: r.user?.id || "",
              };
            });
          }
          
          return {
            id: c.id || `temp-${Date.now()}`,
            author: authorData,
            text: c.content || "",
            date: c.created_at || new Date().toISOString(),
            likes: c.likes_count || 0,
            isLiked: isLiked,
            replies: replies,
            showReplies: false, // Ensure replies are hidden by default
            user_id: c.user?.id || "",
          };
        });
        
        setComments(formattedComments);
        
        // Update liked content state to match retrieved data for consistency
        if (likeMap) {
          setLikedContent(likeMap);
        }
      }
    } catch (error) {
      console.error("Failed to reload comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleDeleteReply = async (commentId: string, replyId: string) => {
    if (!userId) {
      return;
    }

    try {
      const response = await deleteReply(replyId, userId);
      
      if (response.success) {
        // Update state by removing the deleted reply
        const updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies?.filter(reply => reply.id !== replyId) || []
            };
          }
          return comment;
        });
        setComments(updatedComments);
      } else {
        console.error("Failed to delete reply:", response.error);
        alert("Failed to delete reply. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting reply:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Add a function to load user data efficiently
  const loadAllUserData = async () => {
    try {
      const response = await fetchAllBlogUsers();
      if (response.success && Array.isArray(response.data)) {
        // Create a map of user data for quick lookup
        const userMap: Record<string, any> = {};
        response.data.forEach(user => {
          if (user.id) {
            userMap[user.id.toString()] = user;
          }
        });
        setUserDataMap(userMap);
        return userMap;
      }
    } catch (error) {
      console.error("Failed to load users:", error);
    }
    return {};
  };

  // Add a function to check if the current user has liked the content
  const loadLikeStatus = async (blogId: string | number) => {
    try {
      // Check if we have a valid blog ID
      if (!blogId) {
        console.log("No blog ID provided, cannot load like status");
        return {};
      }
      
      // If user isn't logged in, we just return empty like status
      // instead of logging an error
      if (!userId) {
        // Log at debug level only, not an error
        console.log("No user ID available yet, skipping like status loading");
        return {};
      }

      const response = await fetchBlogLikes(blogId);
      
      if (response.success && Array.isArray(response.data)) {
        // Create a map of liked content for quick lookup
        const likeMap: Record<string, boolean> = {};
        
        // Format keys to match 'comment-{id}' and 'reply-{id}' used in the component
        response.data.forEach(like => {
          if (like && like.user_id && like.user_id.toString() === userId.toString()) {
            // Create key in the same format as used in handleLikeComment and handleLikeReply
            let key;
            if (like.target_type === 'comment') {
              key = `comment-${like.target_id}`;
            } else if (like.target_type === 'reply') {
              key = `reply-${like.target_id}`;
            } else {
              key = `${like.target_type}-${like.target_id}`;
            }
            likeMap[key] = true;
          }
        });
        
        setLikedContent(likeMap);
        return likeMap;
      } else {
        // Return empty object instead of logging error for unsuccessful responses
        return {};
      }
    } catch (error) {
      console.error("Failed to load like status:", error);
      return {};
    }
  };

  return (
    <div className="bg-white relative w-full">
      <style dangerouslySetInnerHTML={{ __html: blogContentStyles }} />
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
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">
                  Comments
                </h2>
                <span className="text-gray-500 text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {comments.length}{" "}
                  {comments.length === 1 ? "response" : "responses"}
                </span>
              </div>

              <div className="mb-12">
                <div className="flex gap-4 mb-10">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white flex-shrink-0 mt-1 overflow-hidden shadow-md">
                    {userAvatar ? (
                      <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-medium">
                        {userName ? userName.charAt(0).toUpperCase() : "?"}
                      </span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="bg-gray-50 rounded-xl p-4 shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200">
                      <textarea
                        value={commentText}
                        onChange={handleTextareaInput}
                        placeholder="What are your thoughts?"
                        className="w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-gray-800 min-h-[60px] placeholder-gray-400"
                        rows={1}
                        ref={commentTextAreaRef}
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <div className="flex gap-3">
                        <button
                          className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
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
                          disabled={isSubmittingComment || !commentText.trim()}
                          className={`px-5 py-2 rounded-md bg-purple-600 text-white ${
                            isSubmittingComment || !commentText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 shadow-sm hover:shadow'
                          } transition-all font-medium`}
                        >
                          {isSubmittingComment ? (
                            <div className="flex items-center justify-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </div>
                          ) : (
                            "Respond"
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {comments.length > 0 && (
                  <div className="space-y-8">
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
                      />
                    ))}

                    {comments.length > 3 && (
                      <div className="relative mt-12">
                        <div className="h-20"></div>
                        <div
                          className="absolute inset-0 bg-gradient-to-b from-transparent to-white"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9) 70%, rgba(255,255,255,1) 100%)",
                          }}
                        ></div>

                        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
                          <button
                            onClick={() => onToggleComments && onToggleComments(true)}
                            className="bg-white border border-purple-600 text-purple-600 px-6 py-2.5 rounded-full hover:bg-purple-50 transition-colors font-medium shadow-sm hover:shadow"
                          >
                            See more responses
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {!comments.length && (
                  <div className="flex items-center justify-center p-10 text-center bg-gray-50 rounded-xl mt-4 border border-gray-100 shadow-sm">
                    <p className="text-gray-600 font-medium">
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
                              className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                            >
                              {isSubmittingComment ? (
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                              ) : null}
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
                          handleDeleteComment={handleDeleteComment}
                          handleDeleteReply={handleDeleteReply}
                          currentUserId={userId}
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
                            disabled={!commentText.trim() || isSubmittingComment}
                            className="bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-300 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                          >
                            {isSubmittingComment ? (
                              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                            ) : null}
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