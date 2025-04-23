import { fetchAllBlogs, fetchBlogById, fetchBlogBySlug } from '../../utils/apiClient';

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
  id: number;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  imageSrc: string;
  category: string;
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
    console.error('Error in fetchBlogs:', error);
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
export async function fetchBlogBySlugName(slug: string): Promise<BlogAPIResponse | null> {
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
 */
export async function fetchRelatedBlogs(
  currentSlug: string,
  category?: string,
  limit: number = 5
): Promise<RelatedPost[]> {
  try {
    // If no category is provided, return empty array
    if (!category) {
      return [];
    }
    
    // Get all blogs
    const allBlogs = await fetchBlogs();
    
    // Filter out current blog and get only blogs with the same category
    const sameCategoryBlogs = allBlogs.filter(blog => 
      blog.slug !== currentSlug && 
      blog.image &&
      blog.category === category
    );
    
    // If no blogs with the same category, return empty array
    if (sameCategoryBlogs.length === 0) {
      return [];
    }
    
    // Limit to requested number
    const limitedBlogs = sameCategoryBlogs.slice(0, limit);
    
    // Map to the required format
    return limitedBlogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      date: new Date(blog.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      tags: [blog.category], // Use category as a tag
      imageSrc: blog.image,
      category: blog.category // Add category for highlighting in UI
    }));
  } catch (error) {
    console.error('Error fetching related blogs:', error);
    return [];
  }
} 