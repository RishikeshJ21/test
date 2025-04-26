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
  try {
    // Get all blogs
    const allBlogs = await fetchBlogs();

    // Filter out current blog
    let potentialBlogs = allBlogs.filter(
      (blog) => blog.slug !== currentSlug && blog.image
    );

    // Apply category filter (or exclusion)
    if (category) {
      potentialBlogs = potentialBlogs.filter((blog) =>
        excludeCurrentCategory
          ? blog.category?.toLowerCase() !== category.toLowerCase()
          : blog.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // If no matching blogs, return empty array
    if (potentialBlogs.length === 0) {
      // Optional: If excluding category returned nothing, try fetching *any* other posts as fallback
      if (excludeCurrentCategory) {
        potentialBlogs = allBlogs.filter(
          (blog) => blog.slug !== currentSlug && blog.image
        );
      }
      if (potentialBlogs.length === 0) {
        return [];
      }
    }

    // Limit to requested number
    const limitedBlogs = potentialBlogs.slice(0, limit);

    // Map to the required format
    return limitedBlogs.map((blog) => ({
      id: blog.id.toString(),
      title: blog.title,
      slug: blog.slug,
      date: new Date(blog.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      category: blog.category,
      image: blog.image,
    }));
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return [];
  }
}
