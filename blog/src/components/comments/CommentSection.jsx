import React, { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { ClipLoader } from "react-spinners";
import { FaInfoCircle, FaExclamationCircle, FaHeart, FaRegHeart, FaReply } from "react-icons/fa";
import CommentDeleteConfirmation from "./CommentDeleteConfirmation";
import DefaultPfp from "../../assets/Default_pfp.jpg";
import { getFullImageUrl } from '../../utils/getFullImageUrl';
import Register from '../../pages/auth/Register';

const Comment = ({ comment, currentUser, onReply, onEdit, onDelete, onRequestDelete, onLike, onRequestRegister }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit(comment.id, editContent);
    setIsEditing(false);
  };

  const handleReplyClick = () => {
    if (!currentUser && onRequestRegister) {
      onRequestRegister();
      return;
    }
    setIsReplying(!isReplying);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-3">
      <div className="flex items-start">
        {(
          <img
            src={
              comment.author?.avatar ||
              (comment.author?.profile_picture && getFullImageUrl(comment.author.profile_picture)) ||
              DefaultPfp
            }
            alt={comment.author?.full_name || comment.author?.email}
            className="w-8 h-8 rounded-full mr-3 mt-1"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="font-semibold text-gray-800">
                {comment.author?.full_name || comment.author?.email || "Anonymous"}
              </p>
              <span className="text-xs text-gray-500 ml-2">
                {new Date(comment.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            {comment.author?.id === currentUser?.id && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-xs text-gray-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onRequestDelete(comment.id)}
                  className="text-xs text-gray-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="mt-2">
              <textarea
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows="3"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="flex justify-end space-x-2 mt-1">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="text-gray-700 mt-1 prose prose-sm max-w-none">
              <ReactMarkdown>{comment.content}</ReactMarkdown>
            </div>
          )}

          {/* Like and Reply buttons moved to bottom */}
          <div className="flex items-center mt-3 space-x-3">
            <button
              className="focus:outline-none inline-flex items-center"
              onClick={() => onLike(comment.id)}
              title={comment.liked ? "Unlike this comment" : "Like this comment"}
            >
              {comment.liked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart className="text-gray-400 hover:text-red-400" />
              )}
              <span className="ml-2 text-xs text-gray-600">{comment.total_likes || 0}</span>
            </button>
            <button
              onClick={handleReplyClick}
              className="text-xs text-gray-500 hover:text-blue-600 flex items-center"
            >
              <FaReply className="mr-1" /> Reply
            </button>
          </div>

          {isReplying && (
            <div className="mt-3 ml-3 pl-3 border-l-2 border-gray-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const replyContent = e.target.reply.value;
                  if (replyContent.trim()) {
                    onReply(comment.id, replyContent);
                    e.target.reply.value = '';
                    setIsReplying(false);
                  }
                }}
              >
                <textarea
                  name="reply"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows="2"
                  placeholder="Write your reply..."
                />
                <div className="flex justify-end space-x-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsReplying(false)}
                    className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            </div>
          )}

          {comment.replies?.length > 0 && (
            <div className="mt-3 ml-3 pl-3 border-l-2 border-gray-200 space-y-3">
              {comment.replies.map(reply => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  currentUser={currentUser}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onRequestDelete={onRequestDelete}
                  onLike={onLike}
                  onRequestRegister={onRequestRegister}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentSection = ({ postSlug, initialComments = [], currentUser }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: postSlug,
          content: newComment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([data, ...comments]);
        setNewComment("");
      } else {
        const errData = await response.json();
        setError(errData.detail || "Failed to post comment.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (parentId, content) => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/comments/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          slug: postSlug,
          content: content,
          parent: parentId
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updateComments = (comments) =>
          comments.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), data]
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        setComments(updateComments(comments));
      } else {
        const errData = await response.json();
        setError(errData.detail || "Failed to post reply.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleEdit = async (commentId, newContent) => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}/update/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updateComments = (comments) =>
          comments.map(comment => {
            if (comment.id === commentId) {
              return { ...comment, content: newContent };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        setComments(updateComments(comments));
      } else {
        const errData = await response.json();
        setError(errData.detail || "Failed to edit comment.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("access");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const removeComment = (comments) =>
          comments.filter(comment => comment.id !== commentId)
            .map(comment => {
              if (comment.replies) {
                return {
                  ...comment,
                  replies: removeComment(comment.replies)
                };
              }
              return comment;
            });
        setComments(removeComment(comments));
        setDeleteTarget(null);
      } else {
        const errData = await response.json();
        setError(errData.detail || "Failed to delete comment.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleRequestDelete = (commentId) => {
    setDeleteTarget(commentId);
  };

  const handleLike = async (commentId) => {
    if (!currentUser) {
      setShowRegister(true);
      return;
    }
    const token = localStorage.getItem("access");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comments/${commentId}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        // console.log('Like response:', data);
        const updateComments = (comments) =>
          comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                liked: data.liked,
                total_likes: data.total_likes,
              };
            }
            if (comment.replies) {
              return {
                ...comment,
                replies: updateComments(comment.replies)
              };
            }
            return comment;
          });
        setComments(updateComments(comments));
      } else {
        setError("Failed to update like status.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {currentUser ? (
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loading}
          ></textarea>
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              disabled={loading || !newComment.trim()}
            >
              {loading && (
                <ClipLoader size={16} color="#fff" className="mr-2" />
              )}
              {loading ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaInfoCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                You must be logged in to post a comment.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaExclamationCircle className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRequestDelete={handleRequestDelete}
              onLike={handleLike}
              onRequestRegister={() => setShowRegister(true)}
            />
          ))
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <CommentDeleteConfirmation
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {/* Register Modal for Like (if not logged in) */}
      <Register
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    </div>
  );
};

export default CommentSection;