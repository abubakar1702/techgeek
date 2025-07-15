import { Link } from "react-router-dom";

const ArticleCard = ({ article, showCategory = true }) => {
  return (
    <Link to={`/blog/${article.slug}`} className="block group">
      <img
        src={article.image}
        alt={article.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/fallback.jpg";
        }}
        className="w-full h-56 object-cover rounded group-hover:opacity-90 transition"
      />

      <div className="mt-3">
        {showCategory && Array.isArray(article.category) && article.category.length > 0 && (
          <p
            className="text-xs font-bold text-red-600 uppercase"
          >
            {article.category[0].name}
          </p>
        )}

        <h3 className="mt-1 text-sm font-semibold text-gray-900 leading-snug group-hover:text-red-600 transition">
          {article.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {new Date(article.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
};

export default ArticleCard;
