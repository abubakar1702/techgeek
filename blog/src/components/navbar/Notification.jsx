import React, { useState, useEffect, useRef } from 'react';
import { FaBell, FaRegCommentDots, FaRegThumbsUp } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import defaultPfp from '../../assets/Default_pfp.jpg';
import { useNavigate } from 'react-router-dom';

const Notification = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('access');
        const res = await axios.get('http://127.0.0.1:8000/api/notifications/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(res.data);
      } catch (err) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [isLoggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const unreadCount = notifications.filter(n => !n.is_read).length;
  const showNotifications = notifications.slice(0, 4);
  const hasMore = notifications.length > 4;

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="relative text-gray-600 hover:text-black focus:outline-none"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <FaBell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-[28rem] min-w-[20rem] max-w-lg max-h-[28rem] overflow-y-auto overflow-x-hidden bg-white shadow-lg rounded-lg py-2 z-50 border border-gray-100">
          <div className="px-4 py-2 border-b font-semibold text-gray-700">Notifications</div>
          {loading ? (
            <div className="px-4 py-6 text-center text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-gray-400">No notifications</div>
          ) : (
            <>
              {showNotifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition cursor-pointer ${!n.is_read ? 'bg-blue-50' : ''}`}
                >
                  <img
                    src={n.actor?.profile_picture || defaultPfp}
                    alt={n.actor?.full_name || 'User'}
                    className="w-10 h-10 rounded-full object-cover border"
                    onError={e => { e.target.onerror = null; e.target.src = defaultPfp; }}
                  />
                  <div className="flex-1">
                    <div className="text-sm text-gray-800">
                      <span className="font-semibold">{n.actor?.full_name}</span>
                      {n.verb === 'like' && (
                        <span className="ml-1 text-blue-600 inline-flex items-center"><FaRegThumbsUp className="inline mr-1" /> liked your post</span>
                      )}
                      {n.verb === 'comment' && (
                        <span className="ml-1 text-green-600 inline-flex items-center"><FaRegCommentDots className="inline mr-1" /> commented on your post</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 break-words">
                      {n.post_title}
                    </div>
                    {n.comment_content && (
                      <div className="text-xs text-gray-600 mt-1 italic break-words">"{n.comment_content}"</div>
                    )}
                    <div className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  {!n.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>}
                </div>
              ))}
              {hasMore && (
                <button
                  className="w-full text-center py-2 text-blue-600 hover:bg-blue-50 font-medium border-t border-gray-100 transition"
                  onClick={() => {
                    setOpen(false);
                    navigate('/notifications');
                  }}
                >
                  See all notifications
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;