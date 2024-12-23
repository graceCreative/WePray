import React from 'react'
import logo from "../assets/logo.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';


const Footer = () => {
  return (
    <div>
     <div className="footer">
        <div className="col1">
          <div className="logo">
            <img src={logo} alt="" />
            <h1>WePray</h1>
          </div>
          <b>Share Your Prayers, Uplift Your Soul</b>
        </div>
        <div className="col2">
          <b>Quick Links</b> <br />
          <a href="/">Home</a> <br />
          <a href="/about">About Us</a> <br />
          <a href="/prayerWall">Prayer Wall</a> <br />
          <a href="/dashboard">Dashboard</a> <br />
          <a href="/contact">Contact Us</a>
        </div>
        <div className="col2">
          <b>Other</b> <br />
          <a href="">Become an Affilate</a> <br />
          <a href="">Partners Page</a> <br />
        </div>
        <div className="col3">
          <b>Contact Us</b> <br />
          <a href=''>
              {/* <FontAwesomeIcon icon={faEnvelope} style={{ color: 'white' }}/>*/} info@adventhub.co 
          </a> <br />
            <a href=''>
              {/* <FontAwesomeIcon icon={faLocationDot} style={{ color: 'white' }} /> */}Berrien Springs, Michigan US 
            </a> <br /><br />
          <b>Socila Links</b>
        </div>
      </div>

      <div className="footer-copy">
        <p>© 2024 WiPray - All Rights Reserved</p>
      </div>
    </div>
  )
}

export default Footer