import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MainHeadlines = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/blogs/top-stories/");
        if (!response.ok) throw new Error("Failed to fetch top stories");
        const data = await response.json();
        setStories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center border-b pb-2 mb-6">
          <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative md:col-span-2 col-span-1 block">
            <div className="w-full h-[380px] bg-gray-200 rounded-lg animate-pulse" />
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="h-5 w-20 bg-gray-300 rounded mb-2 animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-300 rounded mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex flex-col gap-6 h-full justify-between">
            {[0, 1].map((idx) => (
              <div className="flex flex-col md:flex-row gap-4" key={idx}>
                <div className="w-full md:w-[200px] h-[180px] bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="h-4 w-16 bg-gray-300 rounded mb-2 animate-pulse" />
                  <div className="h-6 w-3/4 bg-gray-300 rounded mb-2 animate-pulse" />
                  <div className="h-4 w-20 bg-gray-300 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return <div className="text-red-600 text-center py-8">{error}</div>;
  }
  if (!stories.length) {
    return <div className="text-center py-8">No top stories available.</div>;
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const [main, ...side] = stories;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center border-b pb-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-600 pl-3">
          Top Stories
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {main ? (
          <Link to={`/blog/${main.slug}`} className="relative md:col-span-2 col-span-1 block group">
            <img
              src={main.image}
              alt={main.title}
              className="w-full h-[380px] object-cover rounded-lg group-hover:opacity-90 transition"
            />
            <div className="absolute bottom-0 left-0 p-6 text-white bg-gradient-to-t from-black/80 to-transparent w-full rounded-b-lg">
              <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {main.category && main.category[0]?.name?.toUpperCase()}
              </span>
              <h2 className="mt-2 text-2xl font-bold leading-snug">
                {main.title}
              </h2>
              <p className="text-sm text-gray-300 mt-1">{formatDate(main.created_at)}</p>
            </div>
          </Link>
        ) : (
          <div className="md:col-span-2 col-span-1 h-[380px] bg-gray-100 rounded-lg" />
        )}
        <div className="flex flex-col gap-6 h-full justify-between">
          {side.slice(0, 2).map((story, idx) => (
            <Link to={`/blog/${story.slug}`} className="flex flex-col md:flex-row gap-4 group" key={story.id}>
              <img
                src={story.image}
                alt={story.title}
                className="w-full md:w-[200px] h-[180px] object-cover rounded-lg group-hover:opacity-90 transition"
              />
              <div>
                <span className="inline-block bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                  {story.category && story.category[0]?.name?.toUpperCase()}
                </span>
                <h3 className="mt-2 font-bold text-lg">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600">{formatDate(story.created_at)}</p>
              </div>
            </Link>
          ))}
          {side.length < 2 &&
            Array.from({ length: 2 - side.length }).map((_, idx) => (
              <div className="flex flex-col md:flex-row gap-4" key={"empty-" + idx}>
                <div className="w-full md:w-[200px] h-[180px] bg-gray-100 rounded-lg" />
                <div className="flex-1" />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MainHeadlines;