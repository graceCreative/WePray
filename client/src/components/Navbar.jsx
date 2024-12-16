import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../App.css';
import logo from "../assets/logo.png";

const Navbar = () => {


  return (
    <>
      <header>
        <nav className="nav">
        <div className="logo">
          <img src={logo} alt="WePray Logo" />
          <h1>WePray</h1>
        </div>

        <div className="mobile-menu" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          <FontAwesomeIcon icon={isDrawerOpen ? faTimes : faBars} size="2x" />
        </div>

        <div className={`nav-drawer ${isDrawerOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" className="active" onClick={() => setIsDrawerOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsDrawerOpen(false)}>About Us</Link></li>
            <li><Link to="/prayerWall" onClick={() => setIsDrawerOpen(false)}>Prayer Wall</Link></li>
            <li><Link to="/contact" onClick={() => setIsDrawerOpen(false)}>Contact Us</Link></li>
            <li><Link to="/donate" onClick={() => setIsDrawerOpen(false)}>Donate</Link></li>
            <Link to="/praiseWall" className="cta" onClick={() => setIsDrawerOpen(false)}>Share Your Praise</Link>
          </ul>
        </div>

        <ul className="desktop-nav">
          <li><Link to="/" className="active">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/prayerWall">Prayer Wall</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/donate">Donate</Link></li>
        </ul>
        <Link to="/praiseWall" className="cta">Share Your Praise</Link>
      </nav>

      {isDrawerOpen && (
        <div className="drawer-overlay" onClick={() => setIsDrawerOpen(false)} />
      )}
      </header>
    </>
  );
};

export default Navbar; 
