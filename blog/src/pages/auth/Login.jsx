import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login/', {
        email,
        password
      });
      // Store tokens in localStorage
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      // Optionally, store user info
      localStorage.setItem('user', JSON.stringify(response.data.user));
      login(response.data.user);
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.detail || err.response?.data?.error || 'Login failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='bg-white px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md relative mx-4 border border-gray-200'>
        {/* Close Button at the very top-right */}
        <button
          onClick={onClose}
          className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none px-2 rounded-full transition'
          aria-label='Close'
          type='button'
        >
          &times;
        </button>
        {/* Header */}
        <div className='mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Login</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder='Email'
            className='w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder='Password'
            className='w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4'
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type='submit' className='w-full bg-blue-900 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition mt-4' disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <p className='text-center text-sm text-red-500 mt-2'>{error}</p>}
          <p className='text-center text-sm text-gray-500 mt-2'>
            Don't have an account?{' '}
            <button
              type='button'
              onClick={onSwitchToRegister}
              className='text-blue-600 hover:underline font-medium focus:outline-none bg-transparent underline-offset-2'
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login