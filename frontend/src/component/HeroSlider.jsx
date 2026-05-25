import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Discover Your Next Favorite Book',
    description: 'Explore a curated library of titles, issued books, and personalized student workflows.',
    image: 'https://images.unsplash.com/photo-1521587765099-8835e7201186?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/books',
    linkText: 'Browse Books',
  },
  {
    id: 2,
    title: 'Seamless Library Management',
    description: 'Issue books, manage inventory, and collect fines with a clean admin console.',
    image: 'https://images.unsplash.com/photo-1507842217343-583fd0462b34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/admin-dashboard',
    linkText: 'Admin Dashboard',
  },
  {
    id: 3,
    title: 'Your Personal Reading Journey',
    description: 'Students can track due dates, view borrowed books, and avoid late fees with ease.',
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a724?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/student-dashboard',
    linkText: 'Student Dashboard',
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-slate-950 text-white">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `linear-gradient(rgba(15,23,42,0.65), rgba(15,23,42,0.65)), url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="flex min-h-[640px] items-center justify-center px-6 py-24">
            <div className="max-w-3xl text-center">
              <span className="inline-flex rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-blue-200 shadow-sm">
                Library Management
              </span>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">{slide.title}</h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200">{slide.description}</p>
              <Link
                to={slide.link}
                className="mt-10 inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-2xl shadow-blue-500/30 transition hover:bg-blue-700"
              >
                {slide.linkText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 rounded-full transition-all ${index === currentSlide ? 'w-10 bg-blue-600' : 'w-3 bg-white/50 hover:w-6 hover:bg-white'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
