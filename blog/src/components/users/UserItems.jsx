import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiCalendar, FiFileText, FiBookmark, FiEdit, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import ConfirmationModal from '../../components/ConfirmationModal.jsx';
import { CiBookmarkRemove } from "react-icons/ci";

function getImageUrl(path) {
  if (!path) return '';
  return path.startsWith('http') ? path : `http://127.0.0.1:8000${path}`;
}

const UserItems = ({ blogPosts = [], drafts = [], bookmarks = [] }) => {
  const [activeTab, setActiveTab] = useState('published');
  const [publishedPosts, setPublishedPosts] = useState(blogPosts.filter(post => post.status === 'published'));
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [userBookmarks, setUserBookmarks] = useState(bookmarks);

  React.useEffect(() => {
    setPublishedPosts(blogPosts.filter(post => post.status === 'published'));
  }, [blogPosts]);

  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/blogs/${postToDelete}/delete/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      setPublishedPosts(prev => prev.filter(post => post.id !== postToDelete));
      closeDeleteModal();
    } catch (err) {
      alert('Failed to delete post');
      closeDeleteModal();
    }
  };

  const handleRemoveBookmark = async (bmId, postId) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/blogs/${postId}/bookmark/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        }
      );
      setUserBookmarks(prev => prev.filter(bm => bm.id !== bmId));
    } catch (err) {
      alert('Failed to remove bookmark');
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('published')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${activeTab === 'published' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Published Posts
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${activeTab === 'drafts' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Drafts
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-3 px-1 font-medium text-sm border-b-2 ${activeTab === 'bookmarks' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Bookmarks
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'published' && (
          <div>
            {publishedPosts.length > 0 ? (
              <ul className="space-y-4">
                {publishedPosts.map(post => (
                  <li key={post.id} className="relative p-4 bg-white rounded-lg border border-gray-200 hover:border-red-200 transition shadow-sm hover:shadow-md">
                    {/* Action Buttons - Top Right */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Link 
                        to={`/write-blog/${post.id}`} 
                        className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <FiEdit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => openDeleteModal(post.id)}
                        className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex gap-4">
                      {/* Post Image */}
                      {post.image && (
                        <Link to={`/blog/${post.slug}`} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-100">
                          <img src={getImageUrl(post.image)} alt={post.title} className="object-cover w-full h-full" />
                        </Link>
                      )}
                      <div className="flex-1">
                        <Link to={`/blog/${post.slug}`} className="block focus:outline-none">
                          {/* Categories */}
                          {post.category && post.category.length > 0 && (
                            <div className="mb-1 flex flex-wrap gap-1">
                              {post.category.map(cat => (
                                <span key={cat.id} className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <h4 className="font-medium text-gray-900 mb-1">{post.title}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="inline-block" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <FiFileText className="h-12 w-12 mx-auto text-gray-400" />
                <h4 className="mt-3 text-lg font-medium text-gray-900">No published posts yet</h4>
                <p className="mt-1 text-gray-500">Your published articles will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'drafts' && (
          <div>
            {drafts.length > 0 ? (
              <ul className="space-y-4">
                {drafts.map(draft => (
                  <li key={draft.id} className="relative p-4 bg-white rounded-lg border border-gray-200 hover:border-yellow-200 transition shadow-sm hover:shadow-md">
                    {/* Action Button - Top Right */}
                    <div className="absolute top-3 right-3">
                      <Link 
                        to={`/write-blog/${draft.id}`} 
                        className="text-gray-500 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <FiEdit className="h-4 w-4" />
                      </Link>
                    </div>

                    <Link to={`/write-blog/${draft.id}`} className="block focus:outline-none">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-1">{draft.title || 'Untitled Draft'}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {draft.status || 'draft'}
                          </span>
                          <span className="flex items-center gap-1 text-sm text-gray-500">
                            <FiCalendar className="inline-block" />
                            {new Date(draft.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <FiFileText className="h-12 w-12 mx-auto text-gray-400" />
                <h4 className="mt-3 text-lg font-medium text-gray-900">No drafts yet</h4>
                <p className="mt-1 text-gray-500">Your draft articles will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div>
            {userBookmarks.length > 0 ? (
              <ul className="space-y-4">
                {userBookmarks.map(bm => (
                  <li key={bm.id} className="relative p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-200 transition shadow-sm hover:shadow-md">
                    {/* Remove Bookmark Button - Top Right */}
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => handleRemoveBookmark(bm.id, bm.post.id)}
                        className="text-gray-500 hover:text-red-600 p-1.5 rounded-full hover:bg-red-50 transition"
                        title="Remove Bookmark"
                      >
                        <CiBookmarkRemove className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex gap-4">
                      {/* Post Image */}
                      {bm.post.image && (
                        <Link to={`/blog/${bm.post.slug}`} className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-100">
                          <img src={getImageUrl(bm.post.image)} alt={bm.post.title} className="object-cover w-full h-full" />
                        </Link>
                      )}
                      <div className="flex-1">
                        <Link to={`/blog/${bm.post.slug}`} className="block focus:outline-none">
                          {/* Categories */}
                          {bm.post.category && bm.post.category.length > 0 && (
                            <div className="mb-1 flex flex-wrap gap-1">
                              {bm.post.category.map(cat => (
                                <span key={cat.id} className="inline-block bg-red-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                  {cat.name}
                                </span>
                              ))}
                            </div>
                          )}
                          <h4 className="font-medium text-gray-900 mb-1">{bm.post.title}</h4>
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <FiBookmark className="inline-block" />
                              {new Date(bm.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <FiBookmark className="h-12 w-12 mx-auto text-gray-400" />
                <h4 className="mt-3 text-lg font-medium text-gray-900">No bookmarks yet</h4>
                <p className="mt-1 text-gray-500">Save articles to read later and they'll appear here</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        confirmText="Delete"
        cancelText="Cancel"
      >
        Are you sure you want to delete this post? This action cannot be undone.
      </ConfirmationModal>
    </div>
  );
};

export default UserItems;