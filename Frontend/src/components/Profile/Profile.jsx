import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUserProfile } from '../../context/authSlice';
import { FiEdit2, FiCamera } from 'react-icons/fi';
import { format } from 'date-fns';
import { USER_API_URL } from '../../api/config';
import axios from 'axios';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    displayName: user?.displayName || '',
    phoneNumber: user?.phoneNumber || '',
    preferences: user?.preferences || {}
  });

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedUser({
        displayName: user?.displayName || '',
        phoneNumber: user?.phoneNumber || '',
        preferences: user?.preferences || {}
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        await dispatch(updateUserProfile({ photo: formData })).unwrap();
      } catch (error) {
        console.error('Failed to update profile photo:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateUserProfile(editedUser)).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const providerIcon = {
    password: '🔑',
    google: '🌐',
    github: '💻'
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden"
        >
          {/* Header with cover photo */}
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>

          {/* Profile section */}
          <div className="relative px-6 pb-6">
            {/* Profile photo */}
            <div className="relative -mt-16 mb-4">
              <div className="relative inline-block">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt={user?.displayName}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
                <button
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors"
                >
                  <FiCamera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            {/* Profile info */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user?.displayName || 'User Profile'}
                </h1>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Display Name
                      </label>
                      <input
                        type="text"
                        name="displayName"
                        value={editedUser.displayName}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={editedUser.phoneNumber}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Information</h3>
                      <dl className="mt-2 space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Email</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white">{user?.email}</dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Phone Number</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.phoneNumber || 'Not provided'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Email Verified</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.emailVerified ? '✅ Verified' : '❌ Not verified'}
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Details</h3>
                      <dl className="mt-2 space-y-3">
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Account Created</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Last Login</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.lastLoginAt ? format(new Date(user.lastLoginAt), 'PPP') : 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm text-gray-500 dark:text-gray-400">Sign-in Provider</dt>
                          <dd className="text-sm font-medium text-gray-900 dark:text-white flex items-center space-x-2">
                            <span>{providerIcon[user?.provider] || '🔒'}</span>
                            <span>{user?.provider ? user.provider.charAt(0).toUpperCase() + user.provider.slice(1) : 'N/A'}</span>
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
