import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { ClipLoader } from "react-spinners";

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!fullName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/auth/register/`, {
        full_name: fullName,
        email,
        password,
        password2: confirmPassword
      });
      setSuccess(true);
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      onClose();
      onSwitchToLogin();
    } catch (err) {
      setError(
        err.response?.data?.detail || err.response?.data?.error || "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white px-8 py-10 rounded-2xl shadow-2xl w-full max-w-md relative mx-4 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          aria-label="Close"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Join Tech<span className="text-blue-600">Geek</span>
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
          />
          <input
            className="w-full px-4 py-3 border bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={loading}
          />

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">Registration successful!</div>}

          <button
            className="w-full bg-blue-900 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition flex items-center justify-center"
            type="submit"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#fff" /> : "Register"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Already a member?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-blue-600 hover:underline font-medium focus:outline-none bg-transparent underline-offset-2"
              disabled={loading}
            >
              Login
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
