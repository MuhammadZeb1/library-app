import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
  };

  if (!products || products.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
        No books are available to display at the moment.
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {products.map((product) => (
          <div key={product._id} className="w-full flex-shrink-0 px-6 py-10 sm:px-10">
            <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-center">
              <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-inner">
                <img
                  src={product.image ? `http://localhost:5000${product.image}` : 'https://via.placeholder.com/360x480?text=No+Image'}
                  alt={product.title}
                  className="h-[420px] w-full object-cover"
                />
              </div>

              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-blue-600">Featured book</p>
                  <h3 className="text-4xl font-semibold text-slate-900">{product.title}</h3>
                  <p className="text-lg text-slate-600">by {product.author}</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-6 text-slate-700 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Category</p>
                  <p className="mt-2 text-xl font-semibold text-blue-700">{product.category}</p>
                </div>
                <Link
                  to={`/book/${product._id}`}
                  className="inline-flex rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 p-3 text-white shadow-lg transition hover:bg-slate-900"
      >
        &#10094;
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-slate-900/80 p-3 text-white shadow-lg transition hover:bg-slate-900"
      >
        &#10095;
      </button>

      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-3 rounded-full transition-all ${index === currentIndex ? 'w-10 bg-blue-600' : 'w-3 bg-slate-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
