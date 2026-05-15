import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? products.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === products.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500">
        No products available to display.
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-6xl mx-auto">
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product._id} className="w-full flex-shrink-0">
              <div className="bg-white p-6 flex flex-col md:flex-row items-center justify-center gap-8">
                <img 
                  src={product.image ? `http://localhost:5000${product.image}` : "https://via.placeholder.com/200x300?text=No+Image"}
                  alt={product.title}
                  className="w-48 h-64 object-cover rounded-lg shadow-md"
                />
                <div className="text-center md:text-left max-w-md">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{product.title}</h3>
                  <p className="text-xl text-gray-600 mb-4">by {product.author}</p>
                  <p className="text-gray-700 mb-6">Category: <span className="font-semibold text-blue-600">{product.category}</span></p>
                  <Link
                    to={`/book/${product._id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 shadow-md"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full shadow-lg hover:bg-opacity-75 transition"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-3 rounded-full shadow-lg hover:bg-opacity-75 transition"
      >
        &#10095;
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full bg-gray-800 transition-all duration-300
              ${index === currentIndex ? 'bg-opacity-100' : 'bg-opacity-50'}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
