import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://127.0.0.1:8000";

const SearchResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Helper to get query param
  const getQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const query = getQuery();
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get(
          `${API_BASE}/api/blogs/search/?q=${encodeURIComponent(query)}`,
          token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined
        );
        setResults(res.data);
      } catch (err) {
        setResults([]);
      }
      setLoading(false);
    };
    fetchResults();
  }, [location.search]);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Search Results for "{getQuery()}"</h2>
      {loading ? (
        <p>Loading...</p>
      ) : results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {results.map((blog) => (
            <Link
              to={`/blog/${blog.slug}`}
              key={blog.id}
              className="block bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6 cursor-pointer hover:border-blue-500"
            >
              <h3 className="text-xl font-semibold mb-2 text-blue-700 hover:underline">
                {blog.title}
              </h3>
              <p className="text-gray-700 mb-2">
                {blog.summary || (blog.content ? blog.content.replace(/<[^>]+>/g, '').slice(0, 120) + (blog.content.length > 120 ? '...' : '') : "")}
              </p>
              <span className="text-xs text-gray-500">Read more &rarr;</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 