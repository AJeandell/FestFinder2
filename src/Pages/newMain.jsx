import React, { useState } from 'react';
import AboutPage from './AboutPage.jsx';
import ContactPage from './ContactPage.jsx';
import ServicesPage from './ServicesPage.jsx';
import festivals from '../festivals.mjs';
import '../index.css';

// create a slideshow/banner at the top of the page that cycles through images of festivals
// take away controls and just have it auto cycle every 5 seconds

const slides = [
  { image: festivals[0].image2, caption: festivals[0].name },
  { image: festivals[1].image2, caption: festivals[1].name},
];

export default function NewMain() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [displayPage, setDisplayPage] = useState(1);

  const nextSlide = () => setSlideIndex((slideIndex + 1) % slides.length);
  const prevSlide = () => setSlideIndex((slideIndex - 1 + slides.length) % slides.length);
  const goToSlide = (idx) => setSlideIndex(idx);

  const renderPage = () => {
    switch (displayPage) {
      case 1:
        return <div><AboutPage /></div>;
      case 2:
        return <div><ServicesPage /></div>;
      case 3:
        return <div><ContactPage /></div>;
      default:
        return <div><AboutPage /></div>;
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <div className="banner-container" style={{ margin: '0 auto' }}>
        <div className="slide">
          <img src={slides[slideIndex].image} alt={`Slide ${slideIndex + 1}`} className="banner-image" />
          <div className="banner-caption">{slides[slideIndex].caption}</div>
        </div>
        <div className="banner-controls">
          <button className="prev" onClick={prevSlide}>&#10094;</button>
          <button className="next" onClick={nextSlide}>&#10095;</button>
        </div>
        <div className="dots">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`dot${idx === slideIndex ? ' active' : ''}`}
              onClick={() => goToSlide(idx)}
            />
          ))}
        </div>
      </div>
      <h1 style={{ textAlign: 'center', margin: '32px 0 16px 0' }}>Fest Finder</h1>
  <div className="Navigation" style={{ margin: '32px auto 0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
        <button onClick={() => setDisplayPage(1)} style={{ margin: '0 8px' }}>About</button>
        <button onClick={() => setDisplayPage(2)} style={{ margin: '0 8px' }}>Festivals</button>
        <button onClick={() => setDisplayPage(3)} style={{ margin: '0 8px' }}>Contact</button>
        <div style={{ marginTop: 24 }}>{renderPage()}</div>
      </div>
    </div>
  );
}