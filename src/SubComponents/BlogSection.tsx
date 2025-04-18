import BlogCard from './BlogCard';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react'; // Import React for MouseEvent type

const blogPosts = [
  {
    id: 1,
    title: "10 Proven Strategies to Grow Your Creator Business",
    excerpt: "Discover the top tactics successful creators use to expand their audience and boost revenue.",
    imageSrc: "/blog/image1.webp",
    date: "March 15, 2025",
    category: "Business",
    slug: "grow-your-creator-business",
    fullContent: [
      "Growing a creator business requires a multi-faceted approach. It's not just about creating content; it's about strategic planning and execution.",
      "Key strategies include optimizing your content for search engines (SEO), consistently engaging with your audience on social media platforms, building an email list for direct communication, and collaborating with other creators to cross-promote.",
      "Furthermore, diversifying your content formats (e.g., video, podcasts, written articles) and exploring different platforms can significantly widen your reach and attract different segments of your target audience. Remember to analyze your performance metrics regularly to understand what resonates most and refine your approach."
    ]
  },
  {
    id: 2,
    title: "How to Create Engaging Content That Converts",
    excerpt: "Unlock the secrets to crafting content that attracts viewers and drives conversions.",
    imageSrc: "/blog/image2.webp",
    date: "March 12, 2025",
    category: "Content Creation",
    slug: "create-engaging-content",
    fullContent: [
      "Engaging content captures attention, holds interest, and prompts action. Start by deeply understanding your target audience's needs, pain points, and interests.",
      "Use storytelling techniques to make your content relatable and memorable. High-quality visuals (images, videos, infographics) are crucial for grabbing attention in crowded feeds. Ensure your content provides genuine value, whether it's educational, entertaining, or inspiring.",
      "Don't forget clear calls-to-action (CTAs). Guide your audience on what to do next, whether it's subscribing, visiting a link, making a purchase, or leaving a comment. Consistency in quality and publishing schedule also builds trust and keeps your audience coming back."
    ]
  },
  {
    id: 3,
    title: "Monetization Strategies Beyond Ads and Sponsorships",
    excerpt: "Explore alternative revenue streams to diversify your income as a content creator.",
    imageSrc: "/blog/image3.webp",
    date: "March 10, 2025",
    category: "Monetization",
    slug: "monetization-beyond-ads",
    fullContent: [
      "Relying solely on ads and sponsorships can be unpredictable. Diversifying your income streams provides stability and unlocks new growth potential.",
      "Consider creating and selling digital products like e-books, courses, templates, or presets. Exclusive content through membership platforms (like Patreon or Substack) can generate recurring revenue.",
      "Affiliate marketing, where you earn commissions promoting other companies' products, is another popular option. Selling physical merchandise related to your brand or offering consulting/coaching services can also be lucrative avenues to explore."
    ]
  },
  {
    id: 4,
    title: "Building a Personal Brand That Stands Out",
    excerpt: "Learn how to develop a unique personal brand that truly resonates with your audience.",
    imageSrc: "/blog/image4.webp",
    date: "March 8, 2025",
    category: "Branding",
    slug: "build-a-standout-personal-brand",
    fullContent: [
      "Your personal brand is your reputation and how you present yourself to the world. It's what makes you unique and memorable in a sea of creators.",
      "Start by defining your niche, values, and unique value proposition. What makes you different? Be authentic and let your personality shine through your content and interactions. Consistency in your messaging, visual identity (logo, colors, style), and tone of voice across all platforms is key.",
      "Engage genuinely with your community, share your story (including struggles and successes), and consistently deliver value. A strong personal brand builds trust, loyalty, and attracts opportunities."
    ]
  },
  {
    id: 5,
    title: "The Psychology of Viral Content: What Makes People Share",
    excerpt: "Understand the psychological triggers behind viral content and how to leverage them.",
    imageSrc: "/blog/image5.webp",
    date: "March 5, 2025",
    category: "Psychology",
    slug: "psychology-of-viral-content",
    fullContent: [
      "Viral content taps into fundamental human psychology. Understanding these triggers can help you create more shareable content, though virality is never guaranteed.",
      "Content that evokes strong emotions (awe, laughter, anger, inspiration) is more likely to be shared. People also share content that provides practical value (useful tips, how-tos) or helps them define themselves to others (social currency).",
      "Stories are powerful sharing mechanisms. Content that is surprising, features compelling narratives, or taps into current trends or social issues also has a higher potential to spread rapidly. Make it easy to share with prominent social sharing buttons."
    ]
  },
  {
    id: 6,
    title: "Getting Started with AI Tools for Content Creation",
    excerpt: "See how AI-powered tools can streamline your content workflow and save you time.",
    imageSrc: "/blog/image6.webp",
    date: "March 3, 2025",
    category: "AI Tools",
    slug: "ai-tools-for-content-creation",
    fullContent: [
      "Artificial intelligence is revolutionizing content creation, offering tools to enhance efficiency and creativity. Don't be intimidated; start small and explore.",
      "AI can assist with brainstorming ideas, generating outlines, and even drafting initial versions of blog posts or scripts. Tools exist for grammar checking, style improvement, and summarizing long texts. AI-powered image generators can create unique visuals, while AI video editing tools can automate tasks like transcription and clip selection.",
      "Experiment with different tools to find what fits your workflow. Use AI as an assistant to augment your skills, overcome creative blocks, and free up time for higher-level strategy and audience engagement, rather than a complete replacement for human creativity."
    ]
  }
];

// Define a type for the blog post including the new fullContent field
type BlogPost = typeof blogPosts[0];


export default function BlogSection() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const filteredPosts = blogPosts; // No filtering based on categories anymore

  return (
    <>
      <section className="py-1 lg:py-16 bg-transparent w-full">
        {/* Container with consistent width and centering */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grid with consistent columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                imageSrc={post.imageSrc}
                date={post.date}
                category={post.category}
                slug={post.slug}
                index={index}
                onReadMore={() => setSelectedPost(post)}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal Section - Enhanced with Framer Motion and improved styling */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPost(null)} // Close on backdrop click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }} // Added initial animation
              animate={{ scale: 1, opacity: 1, y: 0 }} // Added animate properties
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-xl p-6 md:p-8 max-w-2xl w-full relative shadow-2xl border border-purple-200/50 overflow-y-auto overflow-x-hidden max-h-[90vh]" // Added overflow-x-hidden
              onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              {/* Decorative Gradient Blob - Optional */}
              {/* <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full opacity-20 blur-3xl pointer-events-none"></div> */}

              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 hover:text-purple-800 transition-all duration-300 z-10"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Content */}
              <div className="relative z-0">
                <span className="inline-block bg-purple-200 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                  {selectedPost.category}
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 leading-tight">
                  {selectedPost.title}
                </h2>
                <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed font-medium">
                  {selectedPost.excerpt}
                </p>

                {/* Dynamically inserted full content */}
                {selectedPost.fullContent?.map((paragraph, index) => (
                   <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                     {paragraph}
                   </p>
                ))}

                {/* Placeholder if no specific content exists */}
                 {!selectedPost.fullContent && (
                    <>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                        Dive deeper into the strategies that can elevate your creator journey. Learn how to connect with your audience authentically and build a sustainable business around your passion. We explore various techniques, from content optimization to community building.
                        </p>
                        <p className="text-gray-700 mb-6 leading-relaxed">
                        Understanding your audience and leveraging the right platforms are key. This article provides actionable insights and practical steps you can implement today to see tangible results.
                        </p>
                    </>
                 )}


                {/* Footer - Date and optional elements */}
                <div className="mt-8 pt-4 border-t border-purple-200/80 text-sm text-gray-500">
                   Published on: {selectedPost.date}
                  {/* You can add other footer content here if needed, like share buttons */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
