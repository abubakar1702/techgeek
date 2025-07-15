import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    categories: [
      'Artificial Intelligence',
      'Smartphones',
      'Gaming',
      'Hardware',
      'Recent Articles',
      'Featured Categories',
      'Join Community'
    ],
    company: [
      'About',
      'Our Team',
      'Contact',
      'Careers'
    ],
    support: [
      'Help Center',
      'FAQ',
      'Feedback',
      'Privacy Policy',
      'Terms of Service'
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">TechGeek</h3>
              <div className="w-12 h-1 bg-red-600 mb-4"></div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Stay ahead with the latest in technology, gadgets, gaming, and AI. Your go-to source for tech news, reviews, and insights.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-300">Follow Us</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="Facebook">
                  <FaFacebookF className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="Twitter">
                  <FaTwitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="Instagram">
                  <FaInstagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-600 transition-colors" aria-label="LinkedIn">
                  <FaLinkedinIn className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Categories</h4>
            <ul className="space-y-2">
              {footerSections.categories.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-red-600 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-2">
              {footerSections.company.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-red-600 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2">
              {footerSections.support.map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-gray-400 hover:text-red-600 transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-400">
              © {currentYear} TechGeek. All rights reserved.
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-red-600 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;