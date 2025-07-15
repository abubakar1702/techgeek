import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const CategoryPage = () => {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryBlogs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://127.0.0.1:8000/api/blogs/filter/?slug=${slug}`
        );
        setBlogs(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryBlogs();
  }, [slug]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 capitalize text-gray-800">
        {slug.replace(/_/g, " ")}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <ClipLoader size={35} color="#EF4444" />
        </div>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-600">No blogs found for this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {blogs.map((blog) => (
            <Link
              to={`/blog/${blog.slug}`}
              key={blog.id}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-3"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-36 object-cover rounded mb-3"
              />
              <h3 className="text-lg font-semibold mb-1 text-gray-800">
                {blog.title}
              </h3>
              <p className="text-xs text-gray-500 mb-1">
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <p className="text-sm text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{ __html: blog.content }}></p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
