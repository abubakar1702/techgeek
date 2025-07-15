import React, { useEffect, useState } from 'react';
import { FaRegCommentDots, FaRegThumbsUp } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import defaultPfp from '../assets/Default_pfp.jpg';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn } = useAuth();

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

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Notifications</h1>
      {loading ? (
        <div className="text-center text-gray-400 py-10">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No notifications</div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-4 rounded-lg border border-gray-100 shadow-sm bg-white ${!n.is_read ? 'bg-blue-50' : ''}`}
            >
              <img
                src={n.actor?.profile_picture || defaultPfp}
                alt={n.actor?.full_name || 'User'}
                className="w-12 h-12 rounded-full object-cover border"
                onError={e => { e.target.onerror = null; e.target.src = defaultPfp; }}
              />
              <div className="flex-1">
                <div className="text-base text-gray-800">
                  <span className="font-semibold">{n.actor?.full_name}</span>
                  {n.verb === 'like' && (
                    <span className="ml-1 text-blue-600 inline-flex items-center"><FaRegThumbsUp className="inline mr-1" /> liked your post</span>
                  )}
                  {n.verb === 'comment' && (
                    <span className="ml-1 text-green-600 inline-flex items-center"><FaRegCommentDots className="inline mr-1" /> commented on your post</span>
                  )}
                </div>
                <div className="text-sm text-gray-500 break-words">
                  {n.post_title}
                </div>
                {n.comment_content && (
                  <div className="text-sm text-gray-600 mt-1 italic break-words">"{n.comment_content}"</div>
                )}
                <div className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              {!n.is_read && <span className="w-2 h-2 bg-blue-500 rounded-full mt-2"></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;