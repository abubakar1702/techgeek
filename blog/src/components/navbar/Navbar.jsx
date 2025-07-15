import { FaInstagram, FaFacebookF, FaLinkedinIn, FaPinterestP, FaBell, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import UserMenu from "./UserMenu";
import Notification from "./Notification";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "../../pages/auth/Login"
import Register from "../../pages/auth/Register"
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
    }
  };

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  return (
    <nav className="w-full bg-white border-b relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 md:px-8 py-4">
        {/* Left: Hamburger for mobile */}
        <div className="flex items-center md:hidden">
          <button
            className="text-2xl text-gray-700 focus:outline-none"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars />
          </button>
        </div>

        {/* Center: Logo (left on desktop) */}
        <Link to="/" className="text-3xl font-bold text-gray-900 md:text-left text-center mx-auto md:mx-0" style={{ textDecoration: 'none' }}>
          Tech<span className="text-blue-600">Geek</span>
        </Link>

        {/* Desktop Search Centered */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 justify-center mx-4"
        >
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <FaSearch />
            </span>
            <input
              type="text"
              className="w-full border rounded-full pl-10 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>

        {/* Right: Bell + Avatar (mobile only) */}
        <div className="flex items-center space-x-4 md:hidden">
          {isLoggedIn ? (
            <>
              <Notification />
              <UserMenu />
            </>
          ) : (
            <>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-full shadow transition focus:outline-none"
                onClick={() => setShowRegister(true)}
              >
                Join Now
              </button>
            </>
          )}
        </div>

        {/* Right: Bell + Avatar (hidden on mobile) */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <Notification />
              <UserMenu />
            </>
          ) : (
            <>
              <button
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2 rounded-full shadow transition focus:outline-none"
                onClick={() => setShowRegister(true)}
              >
                Join Now
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation Menu (hidden on mobile) */}
      <div className="border-t hidden md:block">
        <ul className="flex justify-center space-x-8 text-sm font-semibold text-gray-700 py-3">
          <li className="cursor-pointer hover:text-black"><Link to="/">Home</Link></li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/categories/artificial_intelligence">Artificial Intelligence</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/categories/hardware">Hardware</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/categories/gaming">Gaming</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/categories/smartphone">Smartphone</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/categories/how-to">How-To</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/categories/news">News</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/about">About</Link>
          </li>
          <li className="cursor-pointer hover:text-black">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Blurry Gray Background */}
          <div 
            className="fixed inset-0 bg-gray-800/70 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="relative z-50 w-72 bg-white h-full shadow-lg p-6 flex flex-col transform transition-transform duration-300 ease-in-out">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-700 focus:outline-none"
              aria-label="Close menu"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaTimes />
            </button>
            
            {/* Logo in Mobile Menu */}
            <Link to="/" className="text-2xl font-bold text-gray-900 mb-6" style={{ textDecoration: 'none' }}>
              Tech<span className="text-blue-600">Geek</span>
            </Link>

            {/* Search (mobile) */}
            <form
              onSubmit={(e) => {
                handleSearch(e);
                setMobileMenuOpen(false);
              }}
              className="flex items-center mb-6"
            >
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="w-full border rounded-full pl-10 pr-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search articles..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </form>

            {/* Nav Links */}
            <ul className="flex flex-col space-y-4 text-base font-medium text-gray-700 mb-6">
              <li>
                <Link 
                  to="/" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/artificial_intelligence" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Artificial Intelligence
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/hardware" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Hardware
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/gaming" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Gaming
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/smartphone" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Smartphone
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/how-to" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How-To
                </Link>
              </li>
              <li>
                <Link 
                  to="/categories/news" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  News
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block py-2 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <Login 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />
      <Register 
        isOpen={showRegister} 
        onClose={() => setShowRegister(false)} 
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </nav>
  );
};

export default Navbar;