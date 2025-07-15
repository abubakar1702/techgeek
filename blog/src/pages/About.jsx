import React from 'react';
import { FaUsers } from 'react-icons/fa';
import demo1 from '../assets/demo-1.jpg';
import demo2 from '../assets/demo-2.jpg';
import demo3 from '../assets/demo-3.jpg';
import DefaultPfp from '../assets/Default_pfp.jpg';

const team = [
  {
    name: 'Jane Doe',
    role: 'Founder & Editor-in-Chief',
    img: demo1,
  },
  {
    name: 'John Smith',
    role: 'Senior Writer',
    img: demo2,
  },
  {
    name: 'Alex Lee',
    role: 'Content Strategist',
    img: demo3,
  },
  {
    name: 'Sam Patel',
    role: 'Community Manager',
    img: DefaultPfp,
  },
];

const About = () => {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12 bg-white rounded-2xl shadow-lg mt-10 mb-16">
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-700 text-3xl">
          <FaUsers />
        </span>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">About TechGeek Blog</h1>
      </div>
      <p className="text-lg text-gray-700 mb-8">
        Welcome to <span className="font-semibold text-blue-700">TechGeek</span>! We are passionate about bringing you the latest news, reviews, and insights from the world of technology. Our mission is to make tech accessible, fun, and engaging for everyone.
      </p>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8">What We Do & Our Motive</h2>
      <p className="text-gray-700 mb-8">
        At TechGeek, we strive to bridge the gap between complex technology and everyday users. Our goal is to simplify tech concepts, provide honest product reviews, and deliver up-to-date news so you can make informed decisions. We believe technology should empower and inspire everyone, and our motive is to foster a community where curiosity and innovation thrive.
      </p>
      <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-8">
        <li>Latest tech news and trends</li>
        <li>In-depth product reviews</li>
        <li>How-to guides and tutorials</li>
        <li>Opinion pieces and analysis</li>
      </ul>
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-xl">
        <p className="text-gray-700">
          Thank you for visiting our blog! Stay tuned for more updates and feel free to <a href="/contact" className="text-blue-700 font-medium underline hover:text-blue-900">contact us</a> with your feedback or suggestions.
        </p>
      </div>
    </section>
  );
};

export default About;