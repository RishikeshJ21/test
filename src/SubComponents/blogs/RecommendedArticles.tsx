 
import BlogCard from '../BlogCard';

interface Article {
  id?: string | number;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  date: string;
  category?: string;
}

interface RecommendedArticlesProps {
  articles: Article[];
  title?: string;
}

const RecommendedArticles = ({ articles, title = "Recommended Articles" }: RecommendedArticlesProps) => {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 relative">
          {title}
          <span className="absolute -bottom-2 left-0 w-20 h-1 bg-purple-600 rounded-full"></span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {articles.map((article, index) => (
          <BlogCard
            key={article.id || article.slug}
            id={article.id as number}
            slug={article.slug}
            title={article.title}
            excerpt={article.excerpt || ''}
            imageSrc={article.image || ''}
            category={article.category || 'General'}
            date={article.date}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedArticles; 