import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
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
          <ul>
          <li><Link to="/" className="active">Home</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/prayerWall">Prayer Wall</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li><Link to="/donate">Donate</Link></li>
        </ul>
        <Link to="/praiseWall" className="cta">Share Your Praise</Link>
        </nav>
      </header>
    </>
  );
};

export default Navbar; 