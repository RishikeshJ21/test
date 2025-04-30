import {
  fetchAllBlogs,
  fetchBlogById,
  fetchBlogBySlug,
} from "../../utils/apiClient";

// Blog API response types
export interface BlogContentSection {
  sub_title: string;
  des: string[];
}

export interface BlogAPIResponse {
  id: number;
  title: string;
  excerpt: string;
  content: BlogContentSection[];
  image: string;
  date: string;
  category: string;
  slug: string;
  author_id: number | null;
  comments_count: number;
  likes_count: number;
}

// Related post simplified format for Most View component
export interface RelatedPost {
  id?: string;
  title: string;
  slug: string;
  date: string;
  category?: string;
  excerpt?: string;
  image?: string;
}

/**
 * Fetches all blogs from the API
 * @returns Promise with an array of blog objects
 */
export async function fetchBlogs(): Promise<BlogAPIResponse[]> {
  try {
    const data = await fetchAllBlogs();
    return data as BlogAPIResponse[];
  } catch (error) {
    console.error("Error in fetchBlogs:", error);
    // Return empty array on error to avoid breaking the UI
    return [];
  }
}

/**
 * Fetches a specific blog by ID
 * @param id - The blog ID
 * @returns Promise with the blog object
 */
export async function fetchBlog(id: number): Promise<BlogAPIResponse | null> {
  try {
    const data = await fetchBlogById(id);
    return data as BlogAPIResponse;
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches a specific blog by slug
 * @param slug - The blog slug
 * @returns Promise with the blog object
 */
export async function fetchBlogBySlugName(
  slug: string
): Promise<BlogAPIResponse | null> {
  console.log(`@@@ fetchBlogBySlugName called for slug: ${slug}`);
  try {
    const data = await fetchBlogBySlug(slug);
    return data as BlogAPIResponse;
  } catch (error) {
    console.error(`Error fetching blog with slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetches related blog posts based on current blog's category
 * @param currentSlug - The current blog slug to exclude
 * @param category - The category to find related posts for
 * @param limit - Maximum number of posts to return
 * @param excludeCurrentCategory - If true, fetches posts *not* in the provided category
 */
export async function fetchRelatedBlogs(
  currentSlug: string,
  category?: string,
  limit: number = 5,
  excludeCurrentCategory: boolean = false
): Promise<RelatedPost[]> {
  console.log(
    `@@@ fetchRelatedBlogs called for slug: ${currentSlug}, category: ${category}`
  );

  try {
    // Use the new API endpoint for related posts
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    // Only use category filter if we have a category and are not excluding it
    let endpoint = `${API_BASE_URL}/v0/api/blog/relatedPosts`;

    if (category && !excludeCurrentCategory) {
      endpoint += `?mainTag=${encodeURIComponent(category)}`;
    }

    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`);
    }

    const relatedPosts = await response.json();

    // Filter out current blog if needed
    let filteredPosts = Array.isArray(relatedPosts)
      ? relatedPosts.filter((post) => {
          // We need to check for both slug and ID to ensure we don't include the current post
          // First check by slug (string comparison)
          if (post.slug && currentSlug) {
            if (post.slug === currentSlug) {
              return false; // Filter out if slug matches
            }
          }

          // Also check by ID if both are available (numeric comparison)
          if (post.id && currentSlug.includes("?id=")) {
            const currentIdMatch = currentSlug.match(/\?id=(\d+)/);
            if (currentIdMatch && currentIdMatch[1]) {
              const currentId = parseInt(currentIdMatch[1], 10);
              if (
                post.id === currentId ||
                post.id.toString() === currentIdMatch[1]
              ) {
                return false; // Filter out if ID matches
              }
            }
          }

          return true; // Include post if neither slug nor ID match
        })
      : [];

    // Apply limit
    filteredPosts = filteredPosts.slice(0, limit);

    filteredPosts = filteredPosts.filter((post) => post.title.toLowerCase().replace(/ /g, "-") !== currentSlug);
    console.log("filteredPosts", filteredPosts);

    // Map API response to RelatedPost format
    return filteredPosts.map((post) => ({
      id: post.id?.toString(),
      title: post.title || "Untitled",
      slug: post.slug || `blog-${post.id}`, // Generate a slug if none exists
      date: post.created_date
        ? new Date(post.created_date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Unknown date",
      excerpt: post.excerpt,
      image: post.image,
      category: post.category, // Use the category passed to the function
    }));
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}
