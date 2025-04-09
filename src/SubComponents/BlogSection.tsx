 
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import Hero from '../Components/Hero';

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "10 Proven Strategies to Grow Your Creator Business",
    excerpt: "Learn the top strategies successful creators use to grow their audience and increase revenue...",
    imageSrc: "/images/blog/placeholders/post1.jpg",
    date: "Mar 15, 2025",
    category: "Business", // Added category
    slug: "grow-creator-business"
  },
  {
    id: 2,
    title: "How to Create Engaging Content That Converts",
    excerpt: "Discover the secrets to creating content that not only attracts viewers but also converts them...",
    imageSrc: "/images/blog/placeholders/post2.jpg",
    date: "Mar 12, 2025",
    category: "Content Creation", // Added category
    slug: "engaging-content-converts"
  },
  {
    id: 3,
    title: "Monetization Strategies Beyond Ads and Sponsorships",
    excerpt: "Explore alternative revenue streams that can help diversify your income as a content creator...",
    imageSrc: "/images/blog/placeholders/post3.jpg",
    date: "Mar 10, 2025",
    category: "Monetization", // Added category
    slug: "monetization-beyond-ads"
  },
  {
    id: 4,
    title: "Building a Personal Brand That Stands Out",
    excerpt: "Learn how to develop a unique personal brand that resonates with your audience and helps you stand out...",
    imageSrc: "/images/blog/placeholders/post4.jpg",
    date: "Mar 8, 2025",
    category: "Branding", // Added category
    slug: "personal-brand-stands-out"
  },
  {
    id: 5,
    title: "The Psychology of Viral Content: What Makes People Share",
    excerpt: "Understand the psychological triggers that make content go viral and how to apply these principles...",
    imageSrc: "/images/blog/placeholders/post5.jpg",
    date: "Mar 5, 2025",
    category: "Psychology", // Added category
    slug: "psychology-viral-content"
  },
  {
    id: 6,
    title: "Getting Started with AI Tools for Content Creation",
    excerpt: "Discover how AI tools can enhance your content creation process and save you valuable time...",
    imageSrc: "/images/blog/placeholders/post6.jpg",
    date: "Mar 3, 2025",
    category: "AI Tools", // Added category
    slug: "ai-tools-content-creation"
  }
];

export default function BlogSection() {
  // Remove unused state variables
  // const [_activeCategory, _setActiveCategory] = useState("All");

  // Filter posts based on active category
  const filteredPosts = blogPosts; // No filtering based on categories anymore

  return (
    <>

      <Hero
        title={{ t1: "Stay", t2: "Inspired,", t3: " Stay", t4: "Ahead" }}
        description="Explore expert insights, creator tips, and success stories designed to fuel your growth.
            Whether you're looking for content strategies, industry trends, or monetization hacks—we've got you covered!"
        buttonText="Join Createathon Now"
      />

      <section className="py-16 px-4 md:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
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

      {/* CTA Section based on Figma design */}
      <section className="bg-[#1A1D21] py-16 md:py-[60px] px-6 md:px-[72px] rounded-xl mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl my-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between md:gap-[78px]">
          <div className="mb-10 md:mb-0 md:max-w-[490px]">
            <div className="flex flex-col gap-4 md:gap-[16px]">
              <h2 className="text-white text-3xl md:text-[56px] font-semibold leading-tight md:leading-[1.25em] font-['Instrument_Sans']">
                Ready to Grow Your Channel?
              </h2>
              <p className="text-white text-lg md:text-2xl font-medium leading-relaxed md:leading-[1.5em] font-['Instrument_Sans']">
                Join thousands of creators who have transformed their journey with Createathon.
              </p>
            </div>

            <motion.div
              className="mt-8 md:mt-[33px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <a
                href="/"
                className="inline-block bg-white hover:bg-gray-100 text-[#4E1F88] font-semibold text-base md:text-[17px] rounded-xl px-6 py-3 md:px-[30px] md:py-[15px] tracking-[-0.02em]"
              >
                Join Now for Free
              </a>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="bg-white p-4 md:p-[10px] rounded-xl flex items-center gap-4 md:gap-[16px] w-full md:w-auto">
              <div className="bg-[rgba(255,116,66,0.75)] rounded-xl flex items-center justify-center p-2.5 md:p-[10px] w-12 h-12 md:w-[48px] md:h-[48px]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 6V18M18 12H6" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <p className="font-semibold text-sm md:text-[14px] text-black">
                5,000+ Creators Empowered
              </p>
            </div>

            <div className="bg-white p-4 md:p-[10px] rounded-xl flex items-center gap-3 md:gap-[12px] w-full md:w-auto">
              <div className="bg-[rgba(161,228,178,0.75)] rounded-lg flex items-center justify-center p-2 md:p-[10px] w-8 h-8 md:w-[30px] md:h-[30px]">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5 12L10 17L20 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-semibold text-sm md:text-[14px] text-black">
                100% Free Support
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}