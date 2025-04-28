import BlogPost from "../../SubComponents/blogDetails";
import { useParams, useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { blogPosts } from "../../data/blog";
import { BlogAPIResponse, fetchBlogBySlugName } from "../../SubComponents/blogs/api";
import { fetchCommentsByBlogId, fetchBlogById, toggleLikeBlog, fetchLikesForBlog } from "../../utils/apiClient";
import Loader from "../../SubComponents/Loader";
import BlogDetailsSkeleton from '../../SubComponents/BlogDetailsSkeleton';
import { NavigationSection } from "../../Components/NavigationSection/NavigationSection";
import { motion } from "framer-motion";
import { Share, Heart, MessageCircle } from "lucide-react";
import { formatDateDDMMYYYY, getMatchedColors } from "../../SubComponents/blogs/utils";
import UsernameModal from "../../SubComponents/blogs/UsernameModal";

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState<BlogAPIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollY = useRef(0);
  const [activeTocId, setActiveTocId] = useState<string | null>(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [themeColors, setThemeColors] = useState(() => getMatchedColors(slug));
  const loginProcessingRef = useRef(false);

  // Get blog ID from location state or URL query parameters
  const [searchParams] = useSearchParams();
  const idFromQuery = searchParams.get('id');
  const idFromState = useLocation().state?.id;
  const blogIdFromParams = idFromQuery || idFromState;

  // Strict control flags for API calls
  const fetchInitiated = useRef(false);
  const commentsLoaded = useRef(false);
  const blogDataLoaded = useRef(false);
  const likesLoaded = useRef(false);
  const isMountedRef = useRef(true);

  // Effect for mounting/unmounting
  useEffect(() => {
    console.log(`[Blog Details] Component Mounted, ID:`, blogIdFromParams);
    isMountedRef.current = true;
    fetchInitiated.current = false;
    commentsLoaded.current = false;
    blogDataLoaded.current = false;
    likesLoaded.current = false;

    // Remove specific localStorage item as requested
    localStorage.removeItem('blog-designing-for-accessibility-inclusive-ux-likes');

    // Clean up any potential stale data for this blog
    if (slug) {
      // We only remove like counts, but keep the like status
      // as it represents user preference
      const likeCountKey = `blog-${slug}-likes`;
      localStorage.removeItem(likeCountKey);
      console.log(`[Blog] Cleared like count for: ${likeCountKey}`);
    }

    return () => {
      console.log(`[Blog Details] Component Unmounting`);
      isMountedRef.current = false;
    };
  }, []);

  // Load user data - runs once
  useEffect(() => {
    const storedUserData = localStorage.getItem("blog-user-data");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Handle navbar visibility on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (window.innerWidth < 768) {
        setShowNavbar(currentScrollY <= lastScrollY.current || currentScrollY <= 100);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll);
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load like status from localStorage first for immediate UI feedback
  useEffect(() => {
    if (!slug) return;
    const storedLikeStatus = localStorage.getItem(`blog-${slug}-liked`);
    // We'll no longer use localStorage for like counts, relying on API instead
    if (storedLikeStatus) setIsLiked(storedLikeStatus === "true");
  }, [slug]);

  // Main data fetch effect - STRICTLY controlled
  useEffect(() => {
    // ---> RESET STATE ON ID CHANGE <---
    console.log(`[Blog] ID Change Detected. Resetting state for ID: ${blogIdFromParams}`);
    setIsLoading(true);
    setBlogData(null);
    setError(null);
    // Reset fetch control flags for the new ID
    fetchInitiated.current = false;
    commentsLoaded.current = false;
    blogDataLoaded.current = false;
    likesLoaded.current = false;
    // Reset like/comment counts
    setLikes(0);
    setCommentsCount(0);
    setIsLiked(false); // Reset like status until fetched

    // Load like status from localStorage for immediate UI feedback *after* reset
    if (slug) {
      const storedLikeStatus = localStorage.getItem(`blog-${slug}-liked`);
      if (storedLikeStatus) setIsLiked(storedLikeStatus === "true");
    }
    // ---> END RESET <---

    console.log(`[Blog] Main Fetch Effect Triggered. blogId: ${blogIdFromParams}, fetchInitiated: ${fetchInitiated.current}`);

    const controller = new AbortController();
    const signal = controller.signal;

    // Primary Guard: Only run if we have an ID.
    // fetchInitiated check is removed from here as we reset it above.
    if (!blogIdFromParams) {
      console.log(`[Blog] Skipping main fetch (no ID).`);
      setIsLoading(false); // Ensure loading stops if there's no ID
      setError("Blog ID is missing."); // Provide a specific error
      return;
    }

    // Check if fetch has already been initiated *for this specific render cycle*
    // This prevents re-fetching if another state update triggers a re-render
    // before the ID actually changes.
    if (fetchInitiated.current) {
      console.log(`[Blog] Skipping main fetch (already initiated for this ID cycle).`);
      // Keep isLoading true if already initiated
      return;
    }

    const fetchBlogData = async () => {
      // Mark fetch as initiated *immediately* for this ID
      fetchInitiated.current = true;
      // setIsLoading(true); // Already set at the beginning of the effect
      console.log(`⚡ [Blog] STARTING blog fetch for ID: ${blogIdFromParams}`);

      try {
        // Use the efficient fetchBlogById since we have the ID
        const blogResponse = await fetchBlogById(blogIdFromParams, signal);

        if (signal.aborted) {
          console.log("[Blog] Blog fetch aborted.");
          return;
        }

        if (blogResponse) {
          console.log(`✅ [Blog] <-- fetchBlogById SUCCESS`);
          setBlogData(blogResponse);
          blogDataLoaded.current = true; // Mark blog data as loaded

          // Set likes and comments counts from the response
          if (blogResponse.likes_count !== undefined) {
            setLikes(blogResponse.likes_count);
          }

          if (blogResponse.comments_count !== undefined) {
            setCommentsCount(blogResponse.comments_count);
          }

          const blogId = blogResponse.id;

          // Only fetch likes status for logged-in users
          if (blogId && userData?.id && !likesLoaded.current) {
            console.log(`⚡ [Blog] Triggering likes fetch (user logged in, only once)`);
            likesLoaded.current = true; // Mark as initiated *before* async call
            try {
              const likesResponse = await fetchLikesForBlog(blogId, signal);
              if (signal.aborted) return; // Check abort after await
              if (likesResponse.success) {
                console.log(`✅ [Blog] <-- fetchLikesForBlog SUCCESS`);
                const likesData = likesResponse.data;
                let userLiked = false;
                // @ts-ignore
                if (Array.isArray(likesData)) {
                  // @ts-ignore
                  userLiked = likesData.some((like: { user_id: string | number }) => like.user_id === userData.id);
                  // @ts-ignore
                } else if (likesData?.user_likes && Array.isArray(likesData.user_likes)) {
                  // @ts-ignore
                  userLiked = likesData.user_likes.some((like: { user_id: string | number }) => like.user_id === userData.id);
                }
                setIsLiked(userLiked);
                localStorage.setItem(`blog-${slug}-liked`, String(userLiked));
              } else {
                console.error(`❌ [Blog] Failed to fetch likes: ${likesResponse.error}`);
              }
            } catch (likesError) {
              if (!(likesError instanceof Error && likesError.name === 'AbortError')) {
                console.error(`❌ [Blog] Error during likes fetch:`, likesError);
              }
            }
          }
        } else {
          // Handle case where fetchBlogById returns null/undefined
          console.warn(`⚠️ [Blog] fetchBlogById returned no data for ID: ${blogIdFromParams}. Falling back to slug.`);
          // ---- Fallback to SLUG (only if ID fetch failed) ----
          if (slug) {
            console.log(`⚡ [Blog] Attempting fallback fetch by SLUG: ${slug}`);
            try {
              const fallbackResponse = await fetchBlogBySlugName(slug); // This one uses fetchBlogBySlug internally
              if (signal.aborted) return;
              if (fallbackResponse) {
                console.log(`✅ [Blog] Fallback fetch by SLUG succeeded.`);
                setBlogData(fallbackResponse);
                blogDataLoaded.current = true;

                // Set likes and comments counts from the fallback response
                if (fallbackResponse.likes_count !== undefined) {
                  setLikes(fallbackResponse.likes_count);
                }

                if (fallbackResponse.comments_count !== undefined) {
                  setCommentsCount(fallbackResponse.comments_count);
                }

                // Only check likes status for logged-in users
                if (fallbackResponse.id && userData?.id && !likesLoaded.current) {
                  // Similar logic for fetching user-specific like status
                  // Code omitted for brevity, follows same pattern as above
                }
              } else {
                console.error(`❌ [Blog] Fallback fetch by SLUG failed.`);
                setError("Blog post not found");
                if (!signal.aborted) setTimeout(() => navigate("/blog"), 2000);
              }
            } catch (fallbackError) {
              if (!(fallbackError instanceof Error && fallbackError.name === 'AbortError')) {
                console.error(`❌ [Blog] Error during fallback fetch by slug:`, fallbackError);
                setError("Failed to load blog post");
              }
            }
          } else {
            setError("Blog post not found"); // No ID and no slug
          }
          // ---- End Fallback ----
        }
      } catch (err) {
        // Catch errors from fetchBlogById (including AbortError)
        if (!(err instanceof Error && err.name === 'AbortError')) {
          console.error(`❌ [Blog] Error during initial fetchBlogById:`, err);
          setError("An unexpected error occurred.");
        }
      } finally {
        if (isMountedRef.current && !signal.aborted) {
          console.log(`🏁 [Blog] Data fetch completed`);
          setIsLoading(false);
        }
      }
    };

    fetchBlogData();

    return () => {
      console.log("[Blog] Cleanup: Aborting controller for main fetch.");
      controller.abort();
      // Optional: Reset state on unmount *if* desired,
      // but the reset at the start of the effect is usually sufficient
      // setIsLoading(true);
      // setBlogData(null);
    };

    // DEPENDENCIES: Only re-run if the ID we intend to fetch changes.
  }, [blogIdFromParams, slug, navigate]); // Added slug and navigate for safety, though ID is primary driver

  // Separate Effect for Likes triggered by User Change (if blog data already loaded)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const currentBlogId = blogData?.id; // Get ID from state

    console.log(`[Blog] User/Likes Effect Triggered. UserID: ${userData?.id}, BlogID: ${currentBlogId}, BlogLoaded: ${blogDataLoaded.current}, LikesLoaded: ${likesLoaded.current}`);

    // Only fetch likes if: blog data IS loaded, likes ARE NOT loaded, we HAVE a user, and we HAVE a blog ID.
    if (blogDataLoaded.current && !likesLoaded.current && userData?.id && currentBlogId) {
      console.log(`⚡ [Blog] Triggering likes fetch due to user/blog state change.`);
      likesLoaded.current = true; // Mark as initiated
      const fetchLikesData = async () => {
        try {
          const likesResponse = await fetchLikesForBlog(currentBlogId, signal);
          if (signal.aborted) return;
          if (likesResponse.success) {
            console.log(`✅ [Blog] <-- fetchLikesForBlog SUCCESS (User Effect)`);
            const likesData = likesResponse.data;

            // Only update the likes count if it's present in the response and not 0
            // This prevents overriding the blog API likes_count with 0
            // @ts-ignore
            if (likesData?.total_likes && likesData.total_likes > 0) {
              // @ts-ignore
              setLikes(likesData.total_likes);
            }

            let userLiked = false;
            // @ts-ignore
            if (Array.isArray(likesData)) {
              // @ts-ignore
              userLiked = likesData.some((like: { user_id: string | number }) => like.user_id === userData.id);
              // @ts-ignore
            } else if (likesData?.user_likes && Array.isArray(likesData.user_likes)) {
              // @ts-ignore
              userLiked = likesData.user_likes.some((like: { user_id: string | number }) => like.user_id === userData.id);
            }
            setIsLiked(userLiked);
            // Only update localStorage if slug exists
            if (slug) {
              localStorage.setItem(`blog-${slug}-liked`, String(userLiked));
            }
          } else {
            console.error(`❌ [Blog] Failed to fetch likes (User Effect): ${likesResponse.error}`);
          }
        } catch (error) {
          if (!(error instanceof Error && error.name === 'AbortError')) {
            console.error(`❌ [Blog] Error fetching likes (User Effect):`, error);
          }
        }
      };
      fetchLikesData();
    }

    return () => {
      console.log("[Blog] Cleanup: Aborting controller for user/likes effect.");
      controller.abort();
    };
    // DEPENDENCIES: Re-run only if user ID or blog ID (from state) changes.
  }, [userData?.id, blogData?.id, slug]);

  // Handler for like button click
  const handleLike = async () => {
    const blogId = blogData?.id;

    if (!slug || !blogId) {
      console.warn(`[Blog] Cannot like: Missing blogId`);
      return;
    }

    if (!userData?.id) {
      setShowLoginModal(true);
      return;
    }

    // Optimistic UI updates
    const newLikeStatus = !isLiked;
    const newLikeCount = newLikeStatus ? likes + 1 : Math.max(0, likes - 1); // Ensure we don't go below 0
    setIsLiked(newLikeStatus);
    setLikes(newLikeCount);
    // Only update localStorage if slug exists
    if (slug) {
      localStorage.setItem(`blog-${slug}-liked`, String(newLikeStatus));
    }
    // No longer storing likes count in localStorage

    try {
      console.log(`⚡ [Blog] Toggling like for blog ID: ${blogId}`);
      const response = await toggleLikeBlog({ blog_id: blogId, user_id: userData.id });
      console.log(`✅ [Blog] Like response:`, response);

      // If API call fails, revert the optimistic updates
      if (!response.success) {
        console.error(`❌ [Blog] Failed to toggle like:`, response.error);
        setIsLiked(!newLikeStatus);
        setLikes(newLikeStatus ? newLikeCount - 1 : newLikeCount + 1);
        // Only update localStorage if slug exists
        if (slug) {
          localStorage.setItem(`blog-${slug}-liked`, String(!newLikeStatus));
        }
      }
    } catch (error) {
      console.error(`❌ [Blog] Error toggling like:`, error);
      // Revert optimistic updates on error
      setIsLiked(!newLikeStatus);
      setLikes(newLikeStatus ? newLikeCount - 1 : newLikeCount + 1);
      // Only update localStorage if slug exists
      if (slug) {
        localStorage.setItem(`blog-${slug}-liked`, String(!newLikeStatus));
      }
    }
  };

  // Handler for share button click
  const handleShare = async () => {
    if (!blogData) return;

    // Include the ID in the shared URL to ensure it works when shared
    const shareUrl = new URL(window.location.href);
    if (blogData.id && !shareUrl.searchParams.has('id')) {
      shareUrl.searchParams.set('id', blogData.id.toString());
    }

    const shareData = {
      title: blogData.title,
      text: `Check out this article: ${blogData.title}`,
      url: shareUrl.toString(),
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl.toString());
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  // Handler for comment button click - Only fetch full comments when needed
  const handleCommentClick = () => {
    const blogId = blogData?.id;

    // Only fetch if comments are NOT loaded and we have an ID
    if (!isCommentsOpen && blogId && !commentsLoaded.current) {
      console.log(`⚡ [Blog] Fetching full comments for blog ID: ${blogId}`);
      commentsLoaded.current = true; // Mark as attempting load here

      const fetchFullComments = async () => {
        // Note: No AbortController here as it's a direct user interaction
        try {
          // Fetch all comments without limit
          const commentsResponse = await fetchCommentsByBlogId(blogId);
          console.log(`✅ [Blog] Total comments response: `, commentsResponse);

          if (commentsResponse?.success) {
            console.log(`✅ [Blog] Successfully fetched full comments`);
            const commentsData = commentsResponse.data; // Already guaranteed array by API client

            if (Array.isArray(commentsData)) {
              // We don't need to update commentsCount here as we already have it from blog response
              // But we'll store the full comments data for display

              // Store the full comments data in localStorage to be used by the BlogPost component
              if (blogData && slug) {
                // This allows the BlogPost component to access the full comments data
                localStorage.setItem(`blog-${slug}-comments`, JSON.stringify(commentsData));
                console.log(`✅ [Blog] Processed ${commentsData.length} comments for display`);
              }
            }
          } else {
            console.error(`❌ [Blog] Failed to fetch full comments: ${commentsResponse.error}`);
            commentsLoaded.current = false; // Allow retry if fetch failed
          }
        } catch (error) {
          console.error(`❌ [Blog] Error fetching full comments:`, error);
          commentsLoaded.current = false; // Allow retry if fetch failed
        }
      };
      fetchFullComments();
    } else if (commentsLoaded.current) {
      console.log(`[Blog] Comments already loaded or fetch in progress, skipping fetch`);
    }

    setIsCommentsOpen(true);
  };

  // Handler for login success
  const handleLoginSuccess = (name: string) => {
    // Prevent multiple executions
    if (loginProcessingRef.current) return;
    loginProcessingRef.current = true;

    console.log(`[Blog] User logged in: ${name}`);
    const storedUserData = localStorage.getItem("blog-user-data");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData); // This will trigger the useEffect to fetch likes
        setShowLoginModal(false);
      } catch (error) {
        console.error("Error parsing user data after login:", error);
      }
    }

    // Reset the flag after a short delay to prevent any race conditions
    setTimeout(() => {
      loginProcessingRef.current = false;
    }, 500);
  };

  // Transform blog data for rendering
  let content: string[] = [];
  let tags: string[] = [];
  let imageSrc: string = '';
  const sections: { id: string; title: string }[] = [];

  if (blogData) {
    // Process API blog data
    content = blogData.content.flatMap((section, index) => {
      const sectionId = `section-${index + 1}`;
      sections.push({
        id: sectionId,
        title: section.sub_title
      });
      return [`<h2 id="${sectionId}" class="text-xl md:text-2xl font-bold mb-4 mt-8">${section.sub_title}</h2>`, ...section.des];
    });
    tags = [blogData.category];
    imageSrc = blogData.image;
  } else {
    // Fallback to static data if needed
    const staticBlogData = blogPosts.find((post) => post.slug === slug);
    if (staticBlogData) {
      // Handle static data (fix TypeError: staticBlogData.fullContent is undefined)
      // @ts-ignore - Ignoring the fullContent property not existing on type - this is static fallback
      if (staticBlogData.fullContent) {
        // @ts-ignore
        staticBlogData.fullContent.forEach((paragraph: string, index: number) => {
          if (index % 2 === 0 && paragraph.trim()) {
            const sectionId = `static-section-${Math.floor(index / 2) + 1}`;
            sections.push({
              id: sectionId,
              title: paragraph
            });
            content.push(`<h2 id="${sectionId}" class="text-xl md:text-2xl font-bold mb-4 mt-8">${paragraph}</h2>`);
          } else {
            content.push(paragraph);
          }
        });
      }

      // If no content was processed, use a fallback
      if (content.length === 0) {
        content = [
          `<p>${staticBlogData?.excerpt || "No excerpt available"}</p>`,
          "<p>No detailed content available for this post yet.</p>",
        ];
      }

      tags = staticBlogData?.tags || [];
      imageSrc = staticBlogData?.imageSrc || "";
    }
  }

  // Default author information
  const author = {
    name: "Muhammad Faeez Shabbir",
    image: "/testimonial/1.webp",
  };

  // Generate gradient colors based on theme
  const getGradientColors = () => {
    const baseColor = themeColors.background.replace('#', '');
    const baseColorRgb = {
      r: parseInt(baseColor.substring(0, 2), 16),
      g: parseInt(baseColor.substring(2, 4), 16),
      b: parseInt(baseColor.substring(4, 6), 16)
    };
    const lighterShade = `rgba(${baseColorRgb.r + 15}, ${baseColorRgb.g + 15}, ${baseColorRgb.b + 20}, 0.8)`;
    const darkerShade = `rgba(${Math.max(baseColorRgb.r - 15, 0)}, ${Math.max(baseColorRgb.g - 15, 0)}, ${Math.max(baseColorRgb.b - 10, 0)}, 0.9)`;

    return {
      gradient: `linear-gradient(135deg, ${lighterShade} 0%, ${themeColors.background} 50%, ${darkerShade} 100%)`,
      accent: themeColors.badge
    };
  };

  const gradientColors = getGradientColors();

  // Handle TOC highlighting on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (sections.length === 0) return;
      const viewportTop = window.scrollY;
      const viewportHeight = window.innerHeight;
      const targetPosition = viewportTop + (viewportHeight * 0.25);

      let bestSection = null;
      let bestDistance = Infinity;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const elemTop = element.getBoundingClientRect().top + window.scrollY;
          const distance = Math.abs(elemTop - targetPosition);
          if (distance < bestDistance) {
            bestDistance = distance;
            bestSection = section.id;
          }
        }
      }

      // If at the top, select the first section
      if (window.scrollY < 50 && sections.length > 0) {
        bestSection = sections[0].id;
      }

      setActiveTocId(bestSection);
    };

    setTimeout(handleScroll, 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  // Loading state
  if (isLoading) {
    return (
      <>
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 md:bg-transparent md:backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
          initial={{ y: '-100%' }}
          animate={{ y: showNavbar ? '0%' : '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <NavigationSection/>
        </motion.div>
        <BlogDetailsSkeleton />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <motion.div
          className={`fixed top-0 left-0 right-0 z-50 md:bg-transparent md:backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
          initial={{ y: '-100%' }}
          animate={{ y: showNavbar ? '0%' : '-100%' }}
          transition={{ duration: 0.3 }}
        >
          <NavigationSection/>
        </motion.div>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/blog" className="text-purple-600 hover:text-purple-800">
            Return to blog list
          </Link>
        </div>
      </>
    );
  }

  // Get current blog data (API or static fallback)
  const currentBlogData = blogData || blogPosts.find((post) => post.slug === slug);

  // Show nothing if no data is available
  if (!currentBlogData) {
    return null;
  }

  return (
    <>
      <motion.div
        className={`fixed top-0 left-0 right-0 z-50 md:bg-transparent md:backdrop-blur-md transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}
        initial={{ y: '-100%' }}
        animate={{ y: showNavbar ? '0%' : '-100%' }}
        transition={{ duration: 0.3 }}
      >
        <NavigationSection />
      </motion.div>

      <UsernameModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSubmit={handleLoginSuccess}
      />

      <main className="min-h-screen bg-white pt-16 lg:pt-20">
        <div className="w-full py-12 md:py-16 lg:py-20 mt-1 relative overflow-hidden"
          style={{ background: gradientColors.gradient }}>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 opacity-40 hidden md:block">
            <svg width="280" height="560" viewBox="0 0 280 560" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="0" cy="280" r="280" fill={themeColors.badge} />
            </svg>
          </div>

          <div className="absolute right-0 top-1/4 transform -translate-y-1/4 opacity-40 hidden md:block">
            <svg width="240" height="240" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="240" cy="120" r="120" fill={themeColors.badge} />
            </svg>
          </div>

          <div className="absolute left-10 top-1/3 hidden lg:block">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={`dot-l-${i}`} className="w-2 h-2 rounded-full bg-gray-500 opacity-40"></div>
              ))}
            </div>
          </div>

          <div className="absolute right-10 bottom-1/4 hidden lg:block">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(9)].map((_, i) => (
                <div key={`dot-r-${i}`} className="w-2 h-2 rounded-full bg-gray-500 opacity-40"></div>
              ))}
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-center">
              <div className="w-full md:w-[85%] lg:w-[70%] text-center">
                <div className="mb-4 md:mb-5">
                  <span className="inline-block text-[#0f172a] text-sm font-medium px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: themeColors.badge }}>
                    {tags[0] || "News"}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0f172a] mb-4 md:mb-6 leading-tight">
                  {currentBlogData.title}
                </h1>

                <div className="flex items-center justify-center mb-6 md:mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="text-left">
                      <div className="text-xs sm:text-sm text-gray-500">
                        Posted: {formatDateDDMMYYYY(currentBlogData.date)} •
                        <span className="ml-2">3 min read</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-8 mb-10">
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
                      {commentsCount}
                    </span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex items-center text-gray-500 hover:text-gray-700"
                    aria-label="Share post"
                  >
                    <Share size={20} className="text-gray-500" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1700px] mx-auto px-2 sm:px-4 lg:px-6 py-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-0">
            <div className="lg:col-span-12 bg-white rounded-lg p-0">
              <BlogPost
                title={currentBlogData.title}
                date={currentBlogData.date}
                tags={tags}
                content={content}
                blogId={currentBlogData.id}
                imageSrc={imageSrc}
                slug={slug || ""}
                author={author}
                tocSections={sections}
                isCommentsOpen={isCommentsOpen}
                onToggleComments={(isOpen) => setIsCommentsOpen(isOpen)}
              />
            </div>
          </div>
        </div>

        <footer className="bg-white border-t border-gray-200 py-4 mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 sm:mb-0 text-center sm:text-left">
              © {new Date().getFullYear()} persistventures.com. All rights
              reserved.
            </p>
            <div className="flex space-x-4 items-center">
              <a
                href="https://x.com/createathonn"
                className="text-gray-500 hover:text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">X (Twitter)</span>
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/creataethon"
                className="text-gray-500 hover:text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/createathon._/"
                className="text-gray-500 hover:text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.reddit.com/r/Creataethon/"
                className="text-gray-500 hover:text-purple-600"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="sr-only">Reddit</span>
                <svg
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                  aria-hidden="true"
                >
                  <path d="M64 32l320 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32zM305.9 166.4c20.6 0 37.3-16.7 37.3-37.3s-16.7-37.3-37.3-37.3c-18 0-33.1 12.8-36.6 29.8c-30.2 3.2-53.8 28.8-53.8 59.9l0 .2c-32.8 1.4-62.8 10.7-86.6 25.5c-8.8-6.8-19.9-10.9-32-10.9c-28.9 0-52.3 23.4-52.3 52.3c0 21 12.3 39 30.1 47.4c1.7 60.7 67.9 109.6 149.3 109.6s147.6-48.9 149.3-109.7c17.7-8.4 29.9-26.4 29.9-47.3c0-28.9-23.4-52.3-52.3-52.3c-12 0-23 4-31.9 10.8c-24-14.9-54.3-24.2-87.5-25.4l0-.1c0-22.2 16.5-40.7 37.9-43.7l0 0c3.9 16.5 18.7 28.7 36.3 28.7zM155 248.1c14.6 0 25.8 15.4 25 34.4s-11.8 25.9-26.5 25.9s-27.5-7.7-26.6-26.7s13.5-33.5 28.1-33.5zm166.4 33.5c.9 19-12 26.7-26.6 26.7s-25.6-6.9-26.5-25.9c-.9-19 10.3-34.4 25-34.4s27.3 14.6 28.1 33.5zm-42.1 49.6c-9 21.5-30.3 36.7-55.1 36.7s-46.1-15.1-55.1-36.7c-1.1-2.6 .7-5.4 3.4-5.7c16.1-1.6 33.5-2.5 51.7-2.5s35.6 .9 51.7 2.5c2.7 .3 4.5 3.1 3.4 5.7z" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
};

export default BlogDetails;