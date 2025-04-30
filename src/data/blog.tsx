export interface BlogPostContentSection {
  sub_title: string;
  des: string[];
}

export interface BlogAuthor {
  name: string;
  image: string;
  username?: string; // Optional: If you track username separately
  user_id?: string;  // Optional: If you have a specific user ID
}

export interface BlogReply {
  id: string;
  author: BlogAuthor;
  text: string;
  date: string;
  likes: number;
  isLiked: boolean;
  isLoading?: boolean; // Optional: for optimistic UI updates
}

export interface BlogComment {
  id: string;
  author: BlogAuthor;
  text: string;
  date: string;
  likes: number;
  isLiked: boolean;
  replies: BlogReply[];
  showReplies?: boolean; // Optional: for UI state
  isNew?: boolean;      // Optional: for UI state
}


export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  imageSrc: string;
  date: string;
  tags: string[];
  slug: string;
  author: BlogAuthor;
  comments?: BlogComment[];
  // Replace fullContent with the structured content
  // fullContent?: string[];
  content: BlogPostContentSection[];
}


export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "10 Proven Strategies to Grow Your Creator Business",
    excerpt: "Discover the top tactics successful creators use to expand their audience and boost revenue.",
    imageSrc: "/blog/image1.webp",
    date: "March 15, 2025",
    tags: ["Business", "Growth", "Strategy"],
    slug: "grow-your-creator-business",
    author: {
      name: "Jane Doe",
      image: "/testimonial/1.webp",
    },
    comments: [
      {
        id: "c1",
        author: {
          name: "Alex Thompson",
          image: "/testimonial/1.webp"
        },
        text: "These strategies have been game-changers for my YouTube channel. Especially the part about email marketing - I've seen a 40% increase in engagement since implementing it!",
        date: "March 16, 2025",
        likes: 12,
        isLiked: false,
        replies: [
          {
            id: "r1c1",
            author: {
              name: "Jane Doe",
              image: "/authors/jane-doe.webp"
            },
            text: "So glad to hear that, Alex! Email marketing is often underrated in the creator space.",
            date: "March 16, 2025",
            likes: 3,
            isLiked: false
          }
        ]
      },
      {
        id: "c2",
        author: {
          name: "Priya Sharma",
          image: "/testimonial/2.webp"
        },
        text: "I've been struggling with consistency. Any tips on content batching that have worked for others?",
        date: "March 17, 2025",
        likes: 8,
        isLiked: false,
        replies: []
      },
      {
        id: "c3",
        author: {
          name: "Marcus Johnson",
          image: "/testimonial/3.webp"
        },
        text: "Point #7 about collaboration was spot on! I recently did a cross-promotion with another creator in my niche and saw my subscriber count jump by 15% in just one week.",
        date: "March 18, 2025",
        likes: 15,
        isLiked: false,
        replies: [
          {
            id: "r1c3",
            author: {
              name: "Sarah Wilson",
              image: "/testimonial/4.webp"
            },
            text: "That's impressive! Did you have any specific approach to finding the right collaboration partner?",
            date: "March 18, 2025",
            likes: 2,
            isLiked: false
          },
          {
            id: "r2c3",
            author: {
              name: "Marcus Johnson",
              image: "/testimonial/3.webp"
            },
            text: "I used a tool called Creator Connect and focused on finding someone with a similar audience size but complementary content.",
            date: "March 18, 2025",
            likes: 4,
            isLiked: false
          }
        ]
      },
      {
        id: "c4",
        author: {
          name: "Lisa Chen",
          image: "/testimonial/1.webp"
        },
        text: "I implemented these strategies last month and have already seen a 30% growth in my audience. The SEO tips were particularly helpful!",
        date: "March 19, 2025",
        likes: 10,
        isLiked: false,
        replies: []
      }
    ],
    content: [
      {
        sub_title: "The Multi-Faceted Nature of Creator Growth",
        des: [
          "Growing a creator business requires a multi-faceted approach. It's not just about creating content; it's about strategic planning and execution."
        ]
      },
      {
        sub_title: "Core Strategies for Expansion",
        des: [
          "Key strategies include optimizing your content for search engines (SEO), consistently engaging with your audience on social media platforms, building an email list for direct communication, and collaborating with other creators to cross-promote."
        ]
      },
      {
        sub_title: "Diversification and Analysis",
        des: [
      "Furthermore, diversifying your content formats (e.g., video, podcasts, written articles) and exploring different platforms can significantly widen your reach and attract different segments of your target audience. Remember to analyze your performance metrics regularly to understand what resonates most and refine your approach."
        ]
      }
    ]
  },
  {
    id: 2,
    title: "How to Create Engaging Content That Converts",
    excerpt: "Unlock the secrets to crafting content that attracts viewers and drives conversions.",
    imageSrc: "/blog/image2.webp",
    date: "March 12, 2025",
    tags: ["Content Creation", "Engagement", "Conversion"],
    slug: "create-engaging-content",
    author: {
      name: "John Smith",
      image: "/authors/john-smith.webp"
    },
    comments: [
      {
        id: "c1",
        author: {
          name: "Emma Watson",
          image: "/testimonial/2.webp"
        },
        text: "I've been struggling with my conversion rates for months. These tips, especially about storytelling, have given me a whole new perspective!",
        date: "March 13, 2025",
        likes: 7,
        isLiked: false,
        replies: []
      },
      {
        id: "c2",
        author: {
          name: "David Kim",
          image: "/testimonial/3.webp"
        },
        text: "The section about visual content was eye-opening. I've always focused more on the written word, but I'm going to start experimenting with more graphics and videos.",
        date: "March 14, 2025",
        likes: 5,
        isLiked: false,
        replies: [
          {
            id: "r1c2",
            author: {
              name: "John Smith",
              image: "/authors/john-smith.webp"
            },
            text: "That's a great approach, David! Even simple visuals can make a big difference in engagement.",
            date: "March 14, 2025",
            likes: 2,
            isLiked: false
          }
        ]
      }
    ],
    content: [
      {
        sub_title: "Understanding Your Audience",
        des: [
          "Engaging content captures attention, holds interest, and prompts action. Start by deeply understanding your target audience's needs, pain points, and interests."
        ]
      },
      {
        sub_title: "Key Elements of Engagement",
        des: [
          "Use storytelling techniques to make your content relatable and memorable. High-quality visuals (images, videos, infographics) are crucial for grabbing attention in crowded feeds. Ensure your content provides genuine value, whether it's educational, entertaining, or inspiring."
        ]
      },
      {
        sub_title: "Driving Action and Building Trust",
        des: [
      "Don't forget clear calls-to-action (CTAs). Guide your audience on what to do next, whether it's subscribing, visiting a link, making a purchase, or leaving a comment. Consistency in quality and publishing schedule also builds trust and keeps your audience coming back."
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Monetization Strategies Beyond Ads and Sponsorships",
    excerpt: "Explore alternative revenue streams to diversify your income as a content creator.",
    imageSrc: "/blog/image3.webp",
    date: "March 10, 2025",
    tags: ["Monetization", "Revenue", "Strategy"],
    slug: "monetization-beyond-ads",
    author: {
      name: "Alice Johnson",
      image: "/authors/alice-johnson.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "The Need for Diversification",
        des: [
          "Relying solely on ads and sponsorships can be unpredictable. Diversifying your income streams provides stability and unlocks new growth potential."
        ]
      },
      {
        sub_title: "Digital Products and Memberships",
        des: [
          "Consider creating and selling digital products like e-books, courses, templates, or presets. Exclusive content through membership platforms (like Patreon or Substack) can generate recurring revenue."
        ]
      },
      {
        sub_title: "Affiliate Marketing and Services",
        des: [
      "Affiliate marketing, where you earn commissions promoting other companies' products, is another popular option. Selling physical merchandise related to your brand or offering consulting/coaching services can also be lucrative avenues to explore."
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Building a Personal Brand That Stands Out",
    excerpt: "Learn how to develop a unique personal brand that truly resonates with your audience.",
    imageSrc: "/blog/image4.webp",
    date: "March 8, 2025",
    tags: ["Branding", "Personal Development", "Identity"],
    slug: "build-a-standout-personal-brand",
    author: {
      name: "Emily Davis",
      image: "/authors/emily-davis.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "Defining Your Personal Brand",
        des: [
          "Your personal brand is your reputation and how you present yourself to the world. It's what makes you unique and memorable in a sea of creators."
        ]
      },
      {
        sub_title: "Authenticity and Consistency",
        des: [
          "Start by defining your niche, values, and unique value proposition. What makes you different? Be authentic and let your personality shine through your content and interactions. Consistency in your messaging, visual identity (logo, colors, style), and tone of voice across all platforms is key."
        ]
      },
      {
        sub_title: "Engagement and Value Delivery",
        des: [
      "Engage genuinely with your community, share your story (including struggles and successes), and consistently deliver value. A strong personal brand builds trust, loyalty, and attracts opportunities."
        ]
      }
    ]
  },
  {
    id: 5,
    title: "The Psychology of Viral Content: What Makes People Share",
    excerpt: "Understand the psychological triggers behind viral content and how to leverage them.",
    imageSrc: "/blog/image5.webp",
    date: "March 5, 2025",
    tags: ["Psychology", "Virality", "Content"],
    slug: "psychology-of-viral-content",
    author: {
      name: "Michael Brown",
      image: "/authors/michael-brown.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "Understanding the Triggers",
        des: [
          "Viral content taps into fundamental human psychology. Understanding these triggers can help you create more shareable content, though virality is never guaranteed."
        ]
      },
      {
        sub_title: "Emotional Resonance and Practical Value",
        des: [
          "Content that evokes strong emotions (awe, laughter, anger, inspiration) is more likely to be shared. People also share content that provides practical value (useful tips, how-tos) or helps them define themselves to others (social currency)."
        ]
      },
      {
        sub_title: "Storytelling and Ease of Sharing",
        des: [
      "Stories are powerful sharing mechanisms. Content that is surprising, features compelling narratives, or taps into current trends or social issues also has a higher potential to spread rapidly. Make it easy to share with prominent social sharing buttons."
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Financial Management for Independent Creators",
    excerpt: "Essential financial practices to help creators build sustainable businesses and secure their future.",
    imageSrc: "/blog/image3.webp",
    date: "February 25, 2025",
    tags: ["Finance", "Management", "Sustainability"],
    slug: "financial-management-for-creators",
    author: {
      name: "Jane Doe",
      image: "/authors/jane-doe.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "Foundation: Separation and Tracking",
        des: [
          "Managing finances effectively is crucial for long-term success as a creator. Start by separating personal and business finances with a dedicated business bank account and track all income and expenses meticulously."
        ]
      },
      {
        sub_title: "Taxes and Professional Help",
        des: [
          "Understand the tax implications of your creator business and set aside approximately 25-30% of your income for taxes. Consider working with an accountant who specializes in self-employed professionals or creative businesses to maximize deductions and ensure compliance."
        ]
      },
      {
        sub_title: "Building Security: Emergency Fund and Investments",
        des: [
      "Build an emergency fund covering 3-6 months of expenses to weather the income fluctuations common in creator businesses. As your income grows, diversify your investments beyond just reinvesting in your business to build long-term wealth and security."
        ]
      }
    ]
  },
  {
    id: 10,
    title: "Productivity Systems for Content Creators",
    excerpt: "Optimize your workflow and maintain consistency with these proven productivity strategies.",
    imageSrc: "/blog/image4.webp",
    date: "February 22, 2025",
    tags: ["Productivity", "Workflow", "Consistency", "Strategy"],
    slug: "productivity-systems-for-creators",
    author: {
      name: "Jane Doe",
      image: "/authors/jane-doe.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "Batching and Time Blocking",
        des: [
          "Content batching (creating multiple pieces of content in one session) and time blocking (scheduling specific tasks for specific times) are powerful techniques. Dedicate blocks for brainstorming, scripting, filming/writing, editing, and promotion to streamline your process."
        ]
      },
      {
        sub_title: "Leveraging Tools and Templates",
        des: [
          "Utilize project management tools (like Notion, Trello, Asana) to organize ideas and track progress. Create templates for recurring tasks (video intros/outros, blog post outlines, social media graphics) to save time and maintain brand consistency."
        ]
      },
      {
        sub_title: "Prioritization and Avoiding Burnout",
        des: [
          "Focus on high-impact activities using frameworks like the Eisenhower Matrix (Urgent/Important). Learn to say no to non-essential tasks. Schedule regular breaks and downtime to prevent burnout and maintain creative energy."
        ]
      }
    ]
  },
  {
    id: 11,
    title: "Navigating Algorithm Changes as a Content Creator",
    excerpt: "How to build a resilient creator business that can withstand platform algorithm updates.",
    imageSrc: "/blog/image5.webp",
    date: "February 20, 2025",
    tags: ["Platform Strategy", "Resilience", "Algorithms"],
    slug: "navigating-algorithm-changes",
    author: {
      name: "Sarah Lee",
      image: "/authors/sarah-lee.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "Understanding the Impact",
        des: [
          "Platform algorithm changes can dramatically impact a creator's reach and revenue overnight. Building resilience into your business model is essential for long-term success."
        ]
      },
      {
        sub_title: "Diversifying Presence",
        des: [
          "Diversify your presence across multiple platforms, but focus on owning your relationship with your audience through email lists, membership sites, or other direct connection points. This ensures you can reach your audience regardless of algorithm changes."
        ]
      },
      {
        sub_title: "Staying Informed and Consistent",
        des: [
      "Stay informed about platform trends without overreacting to every update. Focus on consistent quality and genuine engagement rather than chasing short-term hacks. Remember that platforms ultimately want engaging content that keeps users on their sites - aligning your goals with platform incentives provides the best long-term strategy."
        ]
      }
    ]
  },
  {
    id: 12,
    title: "Ethical Monetization: Balancing Profit and Audience Trust",
    excerpt: "How to monetize your content authentically while maintaining the trust of your community.",
    imageSrc: "/blog/image6.webp",
    date: "February 18, 2025",
    tags: ["Ethics", "Monetization", "Trust"],
    slug: "ethical-monetization-strategies",
    author: {
      name: "Michael Brown",
      image: "/authors/michael-brown.webp"
    },
    comments: [],
    content: [
      {
        sub_title: "Thoughtful Balance",
        des: [
          "Monetizing your content while maintaining audience trust requires thoughtful balance. Start by only promoting products or services you genuinely believe in and have personally tested when possible."
        ]
      },
      {
        sub_title: "Transparency",
        des: [
          "Be transparent about sponsored content, affiliate relationships, and other monetization methods. Your audience understands you need to make a living, and honesty builds rather than damages trust."
        ]
      },
      {
        sub_title: "Value Creation",
        des: [
      "Focus on creating genuine value before asking for anything in return. When introducing new paid offerings, ensure they truly solve problems for your audience or enhance their experience with your content. The most sustainable creator businesses prioritize audience needs alongside revenue goals."
        ]
      }
    ]
  }
];
