import React from 'react';

const FeaturedCategories = () => {
  const scienceArticle = {
    category: "SCIENCE",
    title: "The Challenges of Space Exploration in the 21st Century",
    date: "February 24, 2025",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam facilisis orci consectetur, blandit justo ut, tempor turpis. Vestibulum facilisis condimentum hendrerit. Maecenas ac turpis egestas ...",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop"
  };

  const politicsArticle = {
    category: "POLITICS",
    title: "Understanding Voter Turnout Trends in Democratic Elections",
    date: "February 24, 2025",
    excerpt: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam facilisis orci consectetur, blandit justo ut, tempor turpis. Vestibulum facilisis condimentum hendrerit. Maecenas ac turpis egestas ...",
    image: "https://images.unsplash.com/photo-1541872705-1f73c6400ec9?w=800&h=600&fit=crop"
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Science Section */}
        <div>
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-600 pl-3">
              Science
            </h2>
            <a
              href="#"
              className="text-sm font-medium text-red-600 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <span>→</span>
            </a>
          </div>

          {/* Featured Article */}
          <article className="cursor-pointer group">
            <div className="mb-4">
              <img
                src={scienceArticle.image}
                alt={scienceArticle.title}
                className="w-full h-64 object-cover rounded group-hover:opacity-90 transition-opacity"
              />
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-red-600 uppercase">
                {scienceArticle.category}
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                {scienceArticle.title}
              </h3>
              
              <p className="text-xs text-gray-500">
                {scienceArticle.date}
              </p>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {scienceArticle.excerpt}
              </p>
            </div>
          </article>
        </div>

        {/* Politics Section */}
        <div>
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-2 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-600 pl-3">
              Politics
            </h2>
            <a
              href="#"
              className="text-sm font-medium text-red-600 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <span>→</span>
            </a>
          </div>

          {/* Featured Article */}
          <article className="cursor-pointer group">
            <div className="mb-4">
              <img
                src={politicsArticle.image}
                alt={politicsArticle.title}
                className="w-full h-64 object-cover rounded group-hover:opacity-90 transition-opacity"
              />
            </div>
            
            <div className="space-y-3">
              <p className="text-xs font-bold text-red-600 uppercase">
                {politicsArticle.category}
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 leading-tight group-hover:text-red-600 transition-colors">
                {politicsArticle.title}
              </h3>
              
              <p className="text-xs text-gray-500">
                {politicsArticle.date}
              </p>
              
              <p className="text-sm text-gray-600 leading-relaxed">
                {politicsArticle.excerpt}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;