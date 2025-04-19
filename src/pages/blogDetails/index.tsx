import BlogPost from "../../SubComponents/blogDetails";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { blogPosts } from "../../data/blog";
 

const BlogDetails = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Find the blog post with the matching slug
  const blogData = blogPosts.find(post => post.slug === slug);

  // If no matching blog post is found, redirect to the blog listing page
  useEffect(() => {
    if (!blogData) {
      navigate("/blog");
    }
  }, [blogData, navigate]);

  // Show nothing while redirecting if blog post not found
  if (!blogData) {
    return null;
  }

  // Default author for demonstration purposes
  const author = {
    name: blogData.author?.name || "Muhammad Faeez Shabbir",
    image: "/testimonial/1.webp"
  };

  // Find related blogs (e.g., blogs in the same category, excluding the current one)
  // const relatedBlogs = blogPosts.filter(
  //   post => post.author?.name === blogData.author?.name  
  // );
  // const relatedBlogs = blogPosts 
  return (
    <main className="min-h-screen bg-white">
      <BlogPost
        title={blogData.title}
        date={blogData.date}
        category={blogData.category}
        content={blogData.fullContent || [blogData.excerpt, "No detailed content available for this post yet."]}
        imageSrc={blogData.imageSrc}
        slug={slug || ""}
        author={author}
      />

      {/* Related Blogs Section
      {relatedBlogs.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        <BlogCard 
          title="Related Blogs"
          excerpt="Explore more insights from the same author."
          imageSrc={relatedBlogs[0].imageSrc}
          category={relatedBlogs[0].category}
          date={relatedBlogs[0].date}
          author={author}
          slug={relatedBlogs[0].slug}
          index={0}
        />
                  
                  </div>
        </div>
      )} */}
    </main>
  );
};

export default BlogDetails;