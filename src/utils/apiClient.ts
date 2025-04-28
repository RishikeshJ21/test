/**
 * API Client utility for making fetch requests that work in both local and production environments
 */

// Note: Email submissions will be stored locally if API is unavailable
// interface StoredSubmission {
//   type: "contact" | "newsletter";
//   data: any;
//   timestamp: number;
// }

// Use environment detection
// const isDev = import.meta.env.DEV;

// In production, use the Netlify proxy to avoid CORS issues
// In development, use the direct API URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"; // This will use Netlify's proxy defined in _redirects

// API endpoints remain the same
const EMAIL_ENDPOINT =
  import.meta.env.VITE_EMAIL_ENDPOINT || "/v0/api/mail/send-email";
const SUBSCRIBE_ENDPOINT =
  import.meta.env.VITE_NEWSLETTER_SUBSCRIBE_ENDPOINT || "/newsletter/subscribe";
const UNSUBSCRIBE_ENDPOINT =
  import.meta.env.VITE_NEWSLETTER_UNSUBSCRIBE_ENDPOINT ||
  "/newsletter/unsubscribe";
// Blog API endpoints
const BLOGS_ENDPOINT = "/v0/api/blog/blogs";
const BLOG_USERS_ENDPOINT = "/v0/api/blog/blog-users";
const BLOG_COMMENTS_ENDPOINT = "/v0/api/blog/comments";
const BLOG_REPLIES_ENDPOINT = "/v0/api/blog/replies";
const BLOG_LIKES_ENDPOINT = "/v0/api/blog/like";

// Request timeout in milliseconds (increased to 30 seconds to handle larger payloads)
const REQUEST_TIMEOUT = 30000;

/**
 * Makes an API request with consistent behavior across environments
 */
export async function makeApiRequest(
  endpoint: string,
  data: any,
  options: {
    fallbackSuccessMessage?: string;
    fallbackErrorMessage?: string;
    submissionType?: "contact" | "newsletter";
    method?: string;
    signal?: AbortSignal;
  } = {}
) {
  const url = `${API_BASE_URL}${endpoint}`;
  const internalController = new AbortController();
  
  // Set up timeout
  const timeoutId = setTimeout(() => {
    console.warn(
      `[API Client] Request timed out after ${REQUEST_TIMEOUT / 1000}s: ${
        options.method || "POST"
      } ${url}`
    );
    internalController.abort();
  }, REQUEST_TIMEOUT);

  // Handle external abort signal
  if (options.signal) {
    options.signal.addEventListener('abort', () => internalController.abort());
  }

  try {
    console.log(`[API Client] Attempt 1: ${options.method || "POST"} ${url}`);
    const response = await fetch(url, {
      method: options.method || "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: window.location.origin,
      },
      credentials: "include",
      mode: "cors",
      body: options.method === "GET" ? undefined : JSON.stringify(data),
      signal: internalController.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log(
        `[API Client] Attempt 1 Success: ${options.method || "POST"} ${url}`
      );
      return { success: true, data: await response.json() };
    }

    const errorData = await response.json().catch(() => ({}));
    console.warn(
      `[API Client] Attempt 1 Failed (${response.status}): ${
        options.method || "POST"
      } ${url}`,
      errorData
    );
    throw new Error(errorData.message || `Server error: ${response.status}`);
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      if (options.signal?.aborted) {
        console.log(
          `[API Client] Request aborted by caller: ${
            options.method || "POST"
          } ${url}`
        );
      } else {
        console.warn(
          `[API Client] Request aborted (likely timeout): ${
            options.method || "POST"
          } ${url}`
        );
      }
      throw error;
    }

    console.error(
      `[API Client] Error during fetch: ${options.method || "POST"} ${url}`,
      error
    );

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : options.fallbackErrorMessage || "An unknown error occurred",
    };
  }
}

// Blog user endpoints
export async function createOrUpdateBlogUser(userData: {
  username: string;
  name: string;
  email: string;
  avatar: string;
}) {
  return makeApiRequest(BLOG_USERS_ENDPOINT, userData, {
    method: "POST",
    fallbackSuccessMessage: "User profile created/updated successfully",
    fallbackErrorMessage:
      "Failed to save user profile. Please try again later.",
  });
}

// Blog comments endpoints
export async function fetchCommentsByBlogId(
  blogId: string | number,
  limit?: number,
  signal?: AbortSignal
) {
  const url = limit
    ? `${BLOGS_ENDPOINT}/${blogId}/comment-data?limit=${limit}`
    : `${BLOGS_ENDPOINT}/${blogId}/comment-data`;

  try {
    const response = await makeApiRequest(
      url,
      {},
      {
        method: "GET",
        fallbackErrorMessage:
          "Failed to fetch comments. Please try again later.",
        signal,
      }
    );

    if (response.success && response.data) {
      return {
        success: true,
        data: Array.isArray(response.data.comments)
          ? response.data.comments
          : [],
      };
    }
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log(`[API Client] fetchCommentsByBlogId aborted.`);
      throw error;
    }
    console.error(
      "[API Client] Error in fetchCommentsByBlogId wrapper:",
      error
    );
    return {
      success: false,
      error: "Failed to fetch comments due to an unexpected error",
    };
  }
}

export async function addCommentToBlog(payload: {
  blog_id: number;
  content: string;
  user_id: string;
}) {
  return makeApiRequest(BLOG_COMMENTS_ENDPOINT, payload, {
    method: "POST",
    fallbackErrorMessage: "Failed to add your comment. Please try again later.",
  });
}

export async function deleteComment(blogId: number, commentId: string) {
  return makeApiRequest(
    `${BLOG_COMMENTS_ENDPOINT}/${commentId}`,
    {},
    {
      method: "DELETE",
      fallbackErrorMessage:
        "Failed to delete your comment. Please try again later.",
    }
  );
}

export async function updateComment(commentId: string, newContent: string) {
  return makeApiRequest(
    `${BLOG_COMMENTS_ENDPOINT}/${commentId}`,
    { content: newContent },
    {
      method: "PUT",
      fallbackErrorMessage:
        "Failed to update your comment. Please try again later.",
    }
  );
}

export async function addReplyToBlogComment(payload: {
  blog_id: number;
  comment_id: string;
  content: string;
  user_id: string;
}) {
  return makeApiRequest(BLOG_REPLIES_ENDPOINT, payload, {
    method: "POST",
    fallbackErrorMessage: "Failed to add your reply. Please try again later.",
  });
}

export async function deleteReply(
  blogId: number,
  commentId: string,
  replyId: string
) {
  return makeApiRequest(
    `${BLOG_REPLIES_ENDPOINT}/${replyId}`,
    {},
    {
      method: "DELETE",
      fallbackErrorMessage:
        "Failed to delete your reply. Please try again later.",
    }
  );
}

export async function toggleLikeComment(payload: {
  blog_id: number;
  comment_id: string;
  user_id: string;
}) {
  return makeApiRequest(
    BLOG_LIKES_ENDPOINT,
    {
      target_type: "comment",
      target_id: payload.comment_id,
      user_id: payload.user_id,
    },
    {
      method: "POST",
      fallbackErrorMessage:
        "Failed to like the comment. Please try again later.",
    }
  );
}

export async function toggleLikeReply(payload: {
  blog_id: number;
  reply_id: string;
  user_id: string;
}) {
  return makeApiRequest(
    BLOG_LIKES_ENDPOINT,
    {
      target_type: "reply",
      target_id: payload.reply_id,
      user_id: payload.user_id,
    },
    {
      method: "POST",
      fallbackErrorMessage: "Failed to like the reply. Please try again later.",
    }
  );
}

export async function toggleLikeBlog(payload: {
  blog_id: number;
  user_id: string;
}) {
  return makeApiRequest(
    BLOG_LIKES_ENDPOINT,
    {
      target_type: "blog",
      target_id: payload.blog_id.toString(),
      user_id: payload.user_id,
    },
    {
      method: "POST",
      fallbackErrorMessage:
        "Failed to update like status. Please try again later.",
    }
  );
}

export async function fetchLikesForBlog(
  blogId: number | string,
  signal?: AbortSignal
) {
  const url = `${BLOGS_ENDPOINT}/${blogId}/likes`;

  try {
    return await makeApiRequest(
      url,
      {},
      {
        method: "GET",
        fallbackErrorMessage: "Failed to fetch likes. Please try again later.",
        signal,
      }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log(`[API Client] fetchLikesForBlog aborted.`);
      throw error;
    }
    console.error("[API Client] Error in fetchLikesForBlog wrapper:", error);
    return {
      success: false,
      error: "Failed to fetch likes due to an unexpected error",
    };
  }
}

export async function submitContactForm(
  formData: any,
  captchaToken: string | null
) {
  const payload = {
    subject: "Contact Form Submission",
    message: `First Name: ${formData.firstName}\nLast Name: ${formData.lastName}\nEmail: ${formData.email}\nMessage: ${formData.message}`,
    to_email: "createathon@persistventures.com",
    captcha_response: captchaToken,
  };

  return makeApiRequest(EMAIL_ENDPOINT, payload, {
    fallbackSuccessMessage: "Your message was received successfully!",
    fallbackErrorMessage: "Failed to send message. Please try again later.",
    submissionType: "contact",
  });
}

export async function subscribeToNewsletter(
  email: string,
  username: string,
  captchaToken: string | null
) {
  const payload = {
    email: email.trim(),
    username: username.trim(),
    captcha_response: captchaToken,
  };

  return makeApiRequest(SUBSCRIBE_ENDPOINT, payload, {
    fallbackSuccessMessage: "You have been subscribed to the newsletter!",
    fallbackErrorMessage: "Failed to subscribe. Please try again later.",
    submissionType: "newsletter",
  });
}

export async function unsubscribeFromNewsletter(email: string) {
  const payload = { email: email.trim() };

  return makeApiRequest(UNSUBSCRIBE_ENDPOINT, payload, {
    fallbackSuccessMessage: "You have been unsubscribed from the newsletter.",
    fallbackErrorMessage: "Failed to unsubscribe. Please try again later.",
  });
}

export async function fetchAllBlogs(signal?: AbortSignal) {
  console.log("@@@ fetchAllBlogs called");
  try {
    const result = await makeApiRequest(
      BLOGS_ENDPOINT,
      {},
      {
        method: "GET",
        fallbackErrorMessage: "Failed to fetch blogs. Please try again later.",
        signal,
      }
    );

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || "Failed to fetch blogs");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log(`[API Client] fetchAllBlogs aborted.`);
      throw error;
    }
    console.error("[API Client] Error fetching all blogs:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unknown error occurred fetching blogs"
    );
  }
}

export async function fetchBlogById(
  blogId: number | string,
  signal?: AbortSignal
) {
  console.log(`@@@ fetchBlogById called for ID: ${blogId}`);
  try {
    const result = await makeApiRequest(
      `${BLOGS_ENDPOINT}/${blogId}`,
      {},
      {
        method: "GET",
        fallbackErrorMessage:
          "Failed to fetch blog details. Please try again later.",
        signal,
      }
    );

    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || "Failed to fetch blog details");
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log(`[API Client] fetchBlogById aborted.`);
      throw error;
    }
    console.error("[API Client] Error fetching blog by ID:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unknown error occurred fetching blog details"
    );
  }
}

export async function fetchBlogBySlug(slug: string, signal?: AbortSignal) {
  console.log(`@@@ fetchBlogBySlug called for slug: ${slug}`);
  try {
    const blogs = await fetchAllBlogs(signal);

    const blog = blogs.find((blog: any) => blog.slug === slug);

    if (blog) {
      return await fetchBlogById(blog.id, signal);
    } else {
      throw new Error(`Blog with slug "${slug}" not found`);
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.log(`[API Client] fetchBlogBySlug aborted.`);
      throw error;
    }
    console.error("[API Client] Error fetching blog by slug:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "An unknown error occurred fetching blog by slug"
    );
  }
}
