/**
 * About Page Component
 * 
 * Provides information about the application, its features, and the team behind it.
 */

import React from 'react';
import './About.css';

/**
 * About component - Information about the application
 */

function About() {
    return (
      <div className="about-page">
        <main className="about-content">
          <div className="about-header">
            <h1 className="about-title">About</h1>
            <p className="about-subtitle">
              Helping you cook delicious meals with what you already have!
            </p>
          </div>
  
          <section className="about-section">
            <h2 className="section-title">Features</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3>Ingredient-Based Search</h3>
                <p>Search for recipes based on ingredients you already have in your kitchen.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🥗</div>
                <h3>Dietary Customization</h3>
                <p>Filter recipes according to dietary preferences, restrictions, and weight goals.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Recipe Management</h3>
                <p>Save favorite recipes, add personal notes, and customize to your tastes.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🛒</div>
                <h3>Meal Planning</h3>
                <p>Plan your meals for the week and automatically generate shopping lists.</p>
              </div>
            </div>
          </section>
  
          <section className="about-section">
            <h2 className="section-title">How It Works</h2>
            <div className="how-it-works">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Enter Your Ingredients</h3>
                  <p>Type or use voice input to list ingredients you have available</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Discover Recipes</h3>
                  <p>Browse through recipe suggestions tailored to your available ingredients and preferences</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Cook & Customize</h3>
                  <p>Follow recipe instructions, save your favorites, and customize with your personal modifications</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <h3>Plan & Organize</h3>
                  <p>Create meal plans and shopping lists for efficient cooking</p>
                </div>
              </div>
            </div>
          </section>
          
          <section className="about-section">
            <h2 className="section-title">Our Mission</h2>
            <p className="section-text">
                We understand the challenge of deciding what to cook with the ingredients you already have. 
                Our smart cooking assistant and recipe management platform is designed to eliminate food waste 
                and inspire your culinary creativity by finding recipes that match what's already in your kitchen.
            </p>
          </section>
  
          <section className="about-section">
            <h2 className="section-title">Contact Us</h2>
            <p className="section-text">
              Have suggestions or feedback? We'd love to hear from you.
              Contact us at <a href="mailto:contact@example.com">email@address.com</a>.
            </p>
          </section>
        </main>
      </div>
    );
  }
  
  export default About;