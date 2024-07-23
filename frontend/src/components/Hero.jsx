import React from "react";
import cars from "../assets/cars.jpg";
import "../styles/hero.css";

function Hero() {
  return (
    <div className="hero-container">
      <img src={cars} alt="background" className="hero-background-image" />
      <div className="hero-content">
        <h1>Turners Insurance</h1>
        <p>Discover our services and offerings.</p>
        <button className="hero-cta-button">Learn More</button>
      </div>
    </div>
  );
}

export default Hero;
