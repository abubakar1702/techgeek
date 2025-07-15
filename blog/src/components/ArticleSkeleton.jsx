import React from "react";

const ArticleSkeleton = () => (
  <div className="animate-pulse">
    <div className="w-full h-56 bg-gray-200 rounded mb-3"></div>
    <div className="h-3 w-1/4 bg-gray-200 rounded mb-2"></div>
    <div className="h-4 w-3/4 bg-gray-300 rounded mb-1"></div>
    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
  </div>
);

export default ArticleSkeleton;