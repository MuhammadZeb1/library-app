import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const slides = [
  {
    id: 1,
    title: 'Discover Your Next Favorite Book',
    description: 'Explore a vast collection of genres, authors, and stories. Your literary adventure begins here.',
    image: 'https://images.unsplash.com/photo-1521587765099-8835e7201186?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/books',
    linkText: 'Browse Books',
  },
  {
    id: 2,
    title: 'Seamless Library Management',
    description: 'For administrators, manage inventory, track issues, and oversee fines with intuitive tools.',
    image: 'https://images.unsplash.com/photo-1507842217343-583fd0462b34?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    link: '/admin-dashboard',
    linkText: 'Admin Dashboard',
  },
  {
    id: 3,
    title: 'Your Personal Reading Journey',
    description: 'Students can easily check out books, view due dates, and manage their reading list.',
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
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white text-center p-8 max-w-3xl">
              <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl mb-8">{slide.description}</p>
              <Link
                to={slide.link}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300"
              >
                {slide.linkText}
              </Link>
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full bg-white transition-all duration-300
              ${index === currentSlide ? 'w-8 bg-blue-500' : 'bg-opacity-50'}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
