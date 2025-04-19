import BlogPost from "../../SubComponents/blogDetails";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { blogPosts } from "../../data/blog";

const BlogDetails = () => {
  const { slug } = useParams();
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

  return (
    <main className="min-h-screen bg-background">
      <BlogPost
        title={blogData.title}
        date={blogData.date}
        category={blogData.category}
        content={blogData.fullContent || [blogData.excerpt, "No detailed content available for this post yet."]}
        imageSrc={blogData.imageSrc}
      />
    </main>
  );
};

export default BlogDetails;