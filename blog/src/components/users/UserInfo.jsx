import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import DefaultPfp from '../../assets/Default_pfp.jpg';
import { FiEdit, FiSave, FiX, FiLock } from 'react-icons/fi';

const DEFAULT_PFP = DefaultPfp;

const UserInfo = ({ user, isUpdating, onUpdateName, onUpdatePicture, onUpdatePassword, error }) => {
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(user.full_name || '');
  const [editingPicture, setEditingPicture] = useState(false);
  const [newPicture, setNewPicture] = useState(null);
  const [editingPassword, setEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  // Update local name state if user prop changes
  React.useEffect(() => {
    setNewName(user.full_name || '');
  }, [user.full_name]);

  return (
    <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
      {/* Profile Picture */}
      <div className="relative">
        <img
          src={user.profile_picture || DEFAULT_PFP}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow"
          onError={e => { e.target.onerror = null; e.target.src = DEFAULT_PFP; }}
        />
        <button
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition shadow"
          onClick={() => setEditingPicture(true)}
          title="Change profile picture"
        >
          <FiEdit className="h-4 w-4" />
        </button>
        {editingPicture && (
          <div className="absolute left-0 top-full mt-2 bg-white p-4 rounded shadow-lg z-10 w-64">
            <input
              type="file"
              accept="image/*"
              onChange={e => setNewPicture(e.target.files[0])}
              className="mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { onUpdatePicture(newPicture); setEditingPicture(false); setNewPicture(null); }}
                disabled={isUpdating || !newPicture}
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-1"
              >
                {isUpdating ? <ClipLoader size={16} color="#fff" /> : <><FiSave /> Save</>}
              </button>
              <button
                onClick={() => { setEditingPicture(false); setNewPicture(null); }}
                className="text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
              ><FiX /> Cancel</button>
            </div>
            {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
          </div>
        )}
      </div>
      {/* User Info */}
      <div className="flex-1">
        {/* Name Edit */}
        {editingName ? (
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="text-2xl font-bold border-b-2 border-blue-500 focus:outline-none px-1 py-1"
              autoFocus
            />
            <button
              onClick={() => { onUpdateName(newName); setEditingName(false); }}
              disabled={isUpdating}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-1"
            >
              {isUpdating ? <ClipLoader size={16} color="#fff" /> : <><FiSave /> Save</>}
            </button>
            <button
              onClick={() => { setEditingName(false); setNewName(user.full_name || ''); }}
              className="text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
            ><FiX /> Cancel</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user.full_name || 'No Name Provided'}
            </h2>
            <button
              onClick={() => setEditingName(true)}
              className="text-blue-500 hover:text-blue-700 transition flex items-center gap-1"
            >
              <FiEdit />
            </button>
          </div>
        )}
        <p className="text-gray-600 mb-3">{user.email}</p>
        {/* Password Edit */}
        <div className="mt-4">
          {editingPassword ? (
            <div className="flex flex-col gap-2 max-w-xs">
              <input
                type="password"
                placeholder="Current password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="border px-2 py-1 rounded"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    onUpdatePassword(oldPassword, newPassword, confirmPassword);
                    setEditingPassword(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={isUpdating || !oldPassword || !newPassword || !confirmPassword}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-1"
                >
                  {isUpdating ? <ClipLoader size={16} color="#fff" /> : <><FiSave /> Save</>}
                </button>
                <button
                  onClick={() => {
                    setEditingPassword(false);
                    setOldPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  className="text-gray-500 hover:text-gray-700 transition flex items-center gap-1"
                ><FiX /> Cancel</button>
              </div>
              {error && <div className="text-red-500 text-xs mt-2">{error}</div>}
            </div>
          ) : (
            <button
              onClick={() => setEditingPassword(true)}
              className="text-blue-500 hover:text-blue-700 transition mt-2 flex items-center gap-1"
            ><FiLock /> Change Password</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfo;