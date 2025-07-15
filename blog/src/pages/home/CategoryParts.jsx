import React from "react";
import pic1 from "../../assets/demo-1.jpg"
import pic2 from "../../assets/demo-2.jpg"
import pic3 from "../../assets/demo-3.jpg"


const articles = [
  {
    title: "The Mental Health Benefits Backed by Science",
    image: pic1, // ✅ Correct
    date: "February 24, 2025",
  },
  {
    title: "How Climate Change is Impacting Global Health",
    image: pic2,
    date: "February 24, 2025",
  },
  {
    title: "Breaking Down the Latest Nutritional Guidelines",
    image: pic3,
    date: "February 24, 2025",
  },
  {
    title: "The Role of Sleep in Immune System Support",
    image: pic1,
    date: "February 24, 2025",
  },
];


const CategoryParts = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header Row */}
      <div className="flex justify-between items-center border-b pb-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-red-600 pl-3">
          Health
        </h2>
        <a
          href="#"
          className="text-sm font-medium text-red-600 hover:underline flex items-center space-x-1"
        >
          <span>View All</span>
          <span>→</span>
        </a>
      </div>

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {articles.map((article, index) => (
          <div key={index}>
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-56 object-cover rounded"
            />
            <div className="mt-3">
              <p className="text-xs font-bold text-red-600 uppercase">Health</p>
              <h3 className="mt-1 text-sm font-semibold text-gray-900 leading-snug">
                {article.title}
              </h3>
              <p className="text-xs text-gray-500 mt-1">{article.date}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryParts;
