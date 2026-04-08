import React, { useEffect } from 'react';
import './HeroCarousel.css';

function HeroCarousel({
  monthTitle,
  year,
  slides,
  activeSlide,
  onSlideChange,
  selectedOccasion
}) {
  useEffect(() => {
    if (selectedOccasion) {
      return undefined;
    }

    const interval = setInterval(() => {
      onSlideChange((current) => (current + 1) % slides.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [slides.length, onSlideChange, selectedOccasion]);

  const slide = selectedOccasion || slides[activeSlide];

  const goPrev = () => {
    onSlideChange((current) => (current - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    onSlideChange((current) => (current + 1) % slides.length);
  };

  return (
    <article className="hero-card h-100">
      <div
        className="hero-media"
        style={{
          backgroundImage: `linear-gradient(145deg, rgba(8, 17, 35, 0.7), rgba(8, 17, 35, 0.2)), url(${slide.image})`
        }}
      >
        <div className="hero-diagonal" aria-hidden="true" />

        <div className="hero-content">
          <p className="hero-kicker mb-2">{year}</p>
          <h2 className="hero-month mb-2">{monthTitle}</h2>
          <p className="hero-quote mb-2">{selectedOccasion ? selectedOccasion.title : slide.quote}</p>
          <p className="hero-author mb-0">{selectedOccasion ? selectedOccasion.note : slide.author}</p>
        </div>

        {selectedOccasion ? (
          <span className="hero-badge">Important Day</span>
        ) : (
          <div className="hero-controls">
            <button type="button" className="hero-arrow" onClick={goPrev} aria-label="Previous slide">
              Prev
            </button>
            <button type="button" className="hero-arrow" onClick={goNext} aria-label="Next slide">
              Next
            </button>
          </div>
        )}
      </div>

      {!selectedOccasion && (
        <div className="hero-dots" aria-label="Quote slides">
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={`hero-dot ${index === activeSlide ? 'hero-dot-active' : ''}`}
              onClick={() => onSlideChange(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </article>
  );
}

export default HeroCarousel;
