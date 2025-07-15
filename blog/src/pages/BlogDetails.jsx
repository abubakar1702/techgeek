import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import default_pfp from "../assets/Default_pfp.jpg";
import CommentSection from "../components/comments/CommentSection";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import '../style/quillContent.css'
import { useAuth } from "../context/AuthContext";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import Register from "./auth/Register";

function getImageUrl(path) {
  if (!path) return '';
  return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
}

const BlogDetails = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      const accessToken = localStorage.getItem('access');
      let headers = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/blogs/slug/${slug}/`,
          { headers }
        );
        setArticle(res.data);
        setLikeCount(res.data.total_likes || 0);
        setIsLiked(res.data.liked || false);
        setIsBookmarked(res.data.bookmarked || false);
        console.log(res.data);
      } catch (error) {
        // If unauthorized, try again without Authorization header (for public read)
        if (error.response && error.response.status === 401 && accessToken) {
          try {
            const res = await axios.get(
              `http://127.0.0.1:8000/api/blogs/slug/${slug}/`
            );
            setArticle(res.data);
            setLikeCount(res.data.total_likes || 0);
            setIsLiked(false);
            setIsBookmarked(false);
          } catch (err2) {
            console.error("Error fetching blog details:", err2);
          }
        } else {
          console.error("Error fetching blog details:", error);
        }
      }
    };
    fetchBlogDetails();
  }, [slug]);

  const handleBookmark = async () => {
    if (!user) {
      setShowRegister(true);
      return;
    }
    setIsBookmarked((prev) => !prev);
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/blogs/${article.id}/bookmark/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
    } catch (error) {
      setIsBookmarked((prev) => !prev);
      console.error("Error bookmarking post:", error);
    }
  };


  const handleLike = async () => {
    if (!user) {
      setShowRegister(true);
      return;
    }
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/blogs/${article.id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
    } catch (error) {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => (isLiked ? prev + 1 : prev - 1));
      console.error("Error liking post:", error);
    }
  };

  const handleDelete = async () => {
    if (!article) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${article.id}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setShowDeleteModal(false);
      navigate("/");
    } catch (err) {
      alert("Failed to delete post");
      setShowDeleteModal(false);
    }
  };

  if (!article) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="mb-4">
          {article.category?.map((cat) => (
            <span
              key={cat.id}
              className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wide mr-2"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
          {article.title}
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b pb-6 mb-6">
          {/* Author info: picture, name, date */}
          <div className="flex items-center mb-4 sm:mb-0 space-x-4">
            <img
              src={article.author?.profile_picture || default_pfp}
              alt={article.author?.full_name || article.author?.email}
              className="w-12 h-12 rounded-full"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = default_pfp;
              }}
            />
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              <p className="font-semibold text-gray-900 whitespace-nowrap">
                {article.author ? (
                  <Link to={`/user/${article.author.id}`} className="hover:underline text-blue-600">
                    {article.author.full_name || article.author.email}
                  </Link>
                ) : (
                  article.author?.full_name || article.author?.email
                )}
              </p>
              <span className="text-sm text-gray-500 whitespace-nowrap">
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
          {/* Action buttons: edit, delete, bookmark */}
          <div className="flex items-center space-x-3">
            {user && article.author && user.id === article.author.id && (
              <>
                <button
                  onClick={() => navigate(`/write-blog/${article.id}`)}
                  className="p-2 rounded-full border bg-white text-gray-600 border-gray-300 hover:border-blue-600 hover:text-blue-600 transition-colors"
                  title="Edit Blog"
                >
                  <FiEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 rounded-full border bg-white text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600 transition-colors"
                  title="Delete Blog"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={handleBookmark}
              className={`p-2 rounded-full border transition-colors ${isBookmarked
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-red-600 hover:text-red-600"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Blog Post"
        confirmText="Delete"
        cancelText="Cancel"
      >
        Are you sure you want to delete this blog post? This action cannot be undone.
      </ConfirmationModal>
      <Register
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => { }}
      />
      {/* Featured Image */}
      <div className="mb-8">
        <img
          src={getImageUrl(article.image)}
          alt={article.title}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>

      {/* Article Content */}
      <article className="max-w-none mb-12">
        <div
          className="ql-editor prose prose-lg text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span
                key={tag.id}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* View Count and Likes */}
      <div className="text-sm text-gray-500 mb-12 flex items-center space-x-6">
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 focus:outline-none"
          aria-label={isLiked ? "Unlike" : "Like"}
        >
          {isLiked ? (
            <IoMdHeart className="text-red-600 w-5 h-5" />
          ) : (
            <IoMdHeartEmpty className="text-gray-400 w-5 h-5" />
          )}
          <span>{likeCount}</span>
        </button>
        {article.view_count !== undefined && (
          <div>
            <span className="ml-2">Views: {article.view_count}</span>
          </div>
        )}
      </div>

      <CommentSection initialComments={article.comments || []} currentUser={user} postSlug={article.slug} />
    </div>
  );
};

export default BlogDetails;
