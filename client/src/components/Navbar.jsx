import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../App.css';
import logo from "../assets/logo.png";

const Navbar = () => {
const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <header>
        <nav className="nav">
          <a href="/">
            <div className="logo">
              <img src={logo} alt="WePray Logo" />
              <h1>WiPray</h1>
            </div>
          </a>
        
          <div className="nav-controls">
            <Link to="https://www.paypal.com/donate/?hosted_button_id=BXQLKAWHSRFBN" className="mobile-donate cta">Donate</Link>
            <div className="mobile-menu" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
              <FontAwesomeIcon icon={isDrawerOpen ? faTimes : faBars} size="2x" />
            </div>
          </div>

        <div className={`nav-drawer ${isDrawerOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" className="active" onClick={() => setIsDrawerOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsDrawerOpen(false)}>About Us</Link></li>
            <li><Link to="/prayerWall" onClick={() => setIsDrawerOpen(false)}>Prayer Wall</Link></li>
            <li><Link to="/praiseWall" onClick={() => setIsDrawerOpen(false)}>Praises</Link></li>
            <li><Link to="/dashboard" onClick={() => setIsDrawerOpen(false)}>Dashboard</Link></li>
            <li><Link to="/contact" onClick={() => setIsDrawerOpen(false)}>Contact Us</Link></li>
          </ul>
        </div>

        <ul className="desktop-nav">
          <li><Link to="/" className="active">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/prayerWall">Prayer Wall</Link></li>
          <li><Link to="/praiseWall">Praises</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>
        <Link to="https://www.paypal.com/donate/?hosted_button_id=BXQLKAWHSRFBN" className="cta">Donate</Link>
      </nav>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      )}
      </header>
    </>
  );
};

export default Navbar; 
