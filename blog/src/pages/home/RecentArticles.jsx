import React, { useEffect, useState } from "react";
import axios from "axios";
import ArticleSkeleton from "../../components/ArticleSkeleton";
import ArticleCard from "./ArticleCard";

const RecentArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/blogs/filter/?filter=recent&limit=4`
        );
        if (isMounted) {
          setArticles(res.data);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching articles:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Row */}
      <div className="flex justify-between items-center border-b pb-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-600 pl-3">
          New Articles
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-red-600 hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <span>→</span>
        </a>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <ArticleSkeleton key={idx} />
            ))
          : articles
              .filter((article) => article.status === 'published')
              .map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
      </div>
    </section>
  );
};

export default RecentArticles;
