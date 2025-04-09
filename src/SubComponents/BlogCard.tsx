"use client";

import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  excerpt: string;
  imageSrc: string;
  category: string;
  date: string;
  author?: {
    name: string;
    image: string;
  };
  slug: string;
  index: number;
}

export default function BlogCard({
  title,
  excerpt,
  imageSrc,
  category,
  date,
  author,
  slug,
  index
}: BlogCardProps) {
  return (
    <motion.article
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      <Link to={`/blog/${slug}`}>
        <div className="relative h-52 md:h-60 overflow-hidden">
          <img
            src={imageSrc}
            alt={title}
            className="object-cover transition-transform duration-500 hover:scale-105 w-full h-full"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-white/80 backdrop-blur-sm text-xs font-medium rounded-full text-purple-700">
              {category}
            </span>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {author && (
              <img
                src={author.image}
                alt={author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            {date && <span className="text-xs text-gray-500">{date}</span>}
          </div>
        </div>

        <Link to={`/blog/${slug}`} className="block">
          <h3 className="text-xl font-semibold mb-2 text-black hover:text-purple-700 transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-2 text-[16px] leading-relaxed">{excerpt}</p>

        <Link
          to={`/blog/${slug}`}
          className="inline-flex items-center text-purple-700 font-medium"
        >
          Read more
          <svg
            className="ml-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </Link>
      </div>
    </motion.article>
  );
}