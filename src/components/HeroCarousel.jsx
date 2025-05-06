'use client'
import React, { useEffect, useState } from 'react'

const images = [
  {
    src: '/assets/ad1.png',
    alt: 'Ad 1',
  },
  {
    src: '/assets/ad2.png',
    alt: 'Ad 2',
  },
  {
    src: '/assets/ad3.png',
    alt: 'Ad 3',
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = images.length;

  const prevSlide = () => setCurrent((current - 1 + total) % total);
  const nextSlide = () => setCurrent((current + 1) % total);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCurrent((curr) => (curr + 1) % total);
    }, 3000);
    return () => clearInterval(interval);
  }, [paused, total]);

  return (
    <div
      className="relative w-full px-2 md:px-4 max-w-full md:max-w-4xl lg:max-w-6xl mx-auto my-6 aspect-[16/9] md:aspect-[16/6] rounded-2xl overflow-hidden shadow-xl bg-gray-100"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {images.map((img, idx) => (
        <img
          key={img.src}
          src={img.src}
          alt={img.alt}
          className={`absolute left-0 top-0 w-full h-full object-cover transition-opacity duration-700 ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          draggable={false}
        />
      ))}
      {/* Overlay for gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none z-20" />
      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow-md z-30 transition"
        aria-label="Previous slide"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-2 shadow-md z-30 transition"
        aria-label="Next slide"
      >
        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`w-3 h-3 rounded-full transition-all border-2 ${idx === current ? 'bg-white border-blue-500 scale-125' : 'bg-gray-300 border-white'}`}
            onClick={() => setCurrent(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel