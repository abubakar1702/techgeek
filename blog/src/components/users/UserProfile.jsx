import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import DefaultPfp from '../../assets/Default_pfp.jpg';
import UserItems from './UserItems';
import { useAuth } from '../../context/AuthContext';
import ChangePasswordModal from '../ChangePasswordModal';
import ChangeProfilePictureModal from '../ChangeProfilePictureModal';

import { FaUserEdit, FaImage, FaKey } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFullImageUrl } from '../../utils/getFullImageUrl';

const API_USER_INFO_URL = 'http://127.0.0.1:8000/api/user/info';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileUrl, setProfileUrl] = useState(null);

  const [editingPicture, setEditingPicture] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const { login } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(API_USER_INFO_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access')}`,
          },
        });
        const processedUser = {
          ...res.data,
          profile_picture: getFullImageUrl(res.data.profile_picture),
        };
        setUser(processedUser);
        setNewName(processedUser.full_name || '');
        setProfileUrl('http://127.0.0.1:8000/api/user/profile/');
      } catch (err) {
        setError('Failed to load user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleNameUpdate = async () => {
    if (!newName.trim() || newName === user.full_name) return;
    setIsUpdating(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('full_name', newName);
      const res = await axios.patch('http://127.0.0.1:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser({ ...user, full_name: res.data.full_name });
      login({ ...user, full_name: res.data.full_name, profile_picture: getFullImageUrl(user.profile_picture) });
      toast.success('Name updated successfully');
    } catch (err) {
      toast.error('Failed to update name');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePictureUpdate = async (newPicture) => {
    if (!newPicture) return;
    setIsUpdating(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('profile_picture', newPicture);
      const res = await axios.patch('http://127.0.0.1:8000/api/profile/', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setUser({ ...user, profile_picture: res.data.profile_picture });
      login({ ...user, profile_picture: getFullImageUrl(res.data.profile_picture) });
      setEditingPicture(false);
      toast.success('Profile picture updated successfully');
    } catch (err) {
      toast.error('Failed to update profile picture');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordUpdate = async (currentPassword, newPassword, confirmPassword) => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('All fields are required');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    setIsUpdating(true);
    setError(null);
    try {
      await axios.patch('http://127.0.0.1:8000/api/auth/change-password/', {
        old_password: currentPassword,
        new_password: newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
        },
      });
      toast.success('Password updated successfully');
      setEditingPassword(false);
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.old_password ||
        err.response?.data?.new_password ||
        'Failed to update password'
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader size={40} color="#2563eb" />
      </div>
    );
  }

  if (error && !isUpdating) {
    return <div className="text-center text-red-600 py-8">{error}</div>;
  }

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto my-10 p-6 bg-white border border-gray-200 rounded-xl shadow-md">
      <ToastContainer />
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center gap-6">
        <img
          src={user.profile_picture || DefaultPfp}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border-4 border-blue-600"
        />

        <div className="w-full">
          <div className="flex items-center justify-between mb-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="text-xl font-semibold border-b w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isUpdating}
            />
            <button
              onClick={handleNameUpdate}
              className="ml-3 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              disabled={isUpdating}
              title="Save name"
            >
              <FaUserEdit />
            </button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <button
              onClick={() => setEditingPicture(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              <FaImage className="text-blue-600" />
              Change Picture
            </button>

            <button
              onClick={() => setEditingPassword(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              <FaKey className="text-blue-600" />
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 text-red-600 text-sm font-medium text-center">
          {error}
        </div>
      )}

      {/* User Blog Items */}
      <div className="mt-8">
        <UserItems
          blogPosts={user.blog_posts}
          drafts={user.drafts}
          bookmarks={user.bookmarks}
        />
      </div>

      {/* Modals */}
      <ChangePasswordModal
        isOpen={editingPassword}
        onClose={() => setEditingPassword(false)}
        onSubmit={handlePasswordUpdate}
        isUpdating={isUpdating}
      />
      <ChangeProfilePictureModal
        isOpen={editingPicture}
        onClose={() => setEditingPicture(false)}
        onSubmit={handlePictureUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default UserProfile;
