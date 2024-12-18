import React from "react";
import { Outlet, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import '../App.css'
import logo from "../assets/logo.png";
import heroImg from "../assets/heroImg.png";
import howImg from "../assets/how.png";
import star from "../assets/star.png";
import tv1 from "../assets/show1.png";
import tv2 from "../assets/show2.png";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useState } from "react";

const Home = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const testimonials = [
    {
      name: "John Deo",
      image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1880011253.1728864000&semt=ais_hybrid-rr-similar",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."
    },
    {
      name: "John Deo",
      image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1880011253.1728864000&semt=ais_hybrid-rr-similar",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."
    },
    {
      name: "John Deo",
      image: "https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1880011253.1728864000&semt=ais_hybrid-rr-similar",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat..."
    },
  ];

  return (
    <div>

      <nav className="nav">
        <div className="logo">
          <img src={logo} alt="WePray Logo" />
          <h1>WiPray</h1>
        </div>

        <div className="mobile-menu" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
          <FontAwesomeIcon icon={isDrawerOpen ? faTimes : faBars} size="2x" />
        </div>

        <div className={`nav-drawer ${isDrawerOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to="/" className="active" onClick={() => setIsDrawerOpen(false)}>Home</Link></li>
            <li><Link to="/about" onClick={() => setIsDrawerOpen(false)}>About Us</Link></li>
            <li><Link to="/prayerWall" onClick={() => setIsDrawerOpen(false)}>Prayer Wall</Link></li>
            <li><Link to="/dashboard" onClick={() => setIsDrawerOpen(false)}>Dashboard</Link></li>
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

      <div className="hero-section">
        <div className="hero-left">
          <div className="content">
            <div className="mask">
              <h1 className="anim">Where God's People Unite in Prayer</h1>
            </div>
            <div className="mask">
              <p className="anim">
                WiPray platform provides a space for individuals to share their prayer requests and praises, inviting others to join in prayer or celebrate moments of gratitude.
              </p>
            </div>
            <div className="flex">
              <div className="cta">Join a Prayer Community.</div>
              <div className="cta">Start Praying Today.</div>
            </div>
          </div>

          <div className="numbers mask">
            <div className="number anim">
              <h3>1,800+</h3>Prayers Prayed
            </div>
            <div className="number anim">
              <h3>1,500+</h3>Prayers Answered
            </div>
          </div>
        </div>
        <img src={heroImg} className="leftAnim" alt="Hero" />
        <div className="circle"></div>
      </div>

      <hr />

      <div className="about-section">
        <h1>About Us</h1>
        <p id="paragraph">
          At WiPray, we believe in the transformative power of prayer and the strength of a faith-driven community. Our platform allows individuals to share prayer requests and praises, inviting others to join in prayer or celebrate moments of gratitude. Whether you're seeking prayers or offering them to others, PrayerCircle brings believers together to support one another in faith. We aim to connect those in need of spiritual encouragement, fostering a space where everyone feels heard, uplifted, and united through prayer, as we strengthen our relationship with God through meaningful, heartfelt communion.
        </p>
      </div>

      <div className="tv-section animText1">
        <h1>PRAYER TV SHOWS</h1>
        <div className="show-container">
          {["Karma or Putting others First", "Beautiful Through Christ", "Karma or Putting others First"].map((title, index) => (
            <div className="card" key={index}>
              <img src={tv1} alt="" />
              <div className="card-detail">
                <h2>{title}</h2>
                <svg width="71" height="71" viewBox="0 0 71 71" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_11_14)">
                    <path d="M35.5 0C44.9152 0 53.9448 3.74017 60.6023 10.3977C67.2598 17.0553 71 26.0848 71 35.5C71 44.9152 67.2598 53.9448 60.6023 60.6023C53.9448 67.2598 44.9152 71 35.5 71C26.0848 71 17.0553 67.2598 10.3977 60.6023C3.74017 53.9448 0 44.9152 0 35.5C0 26.0848 3.74017 17.0553 10.3977 10.3977C17.0553 3.74017 26.0848 0 35.5 0ZM6.65625 35.5C6.65625 43.1498 9.69514 50.4864 15.1044 55.8956C20.5136 61.3049 27.8502 64.3438 35.5 64.3438C43.1498 64.3438 50.4864 61.3049 55.8956 55.8956C61.3049 50.4864 64.3438 43.1498 64.3438 35.5C64.3438 27.8502 61.3049 20.5136 55.8956 15.1044C50.4864 9.69514 43.1498 6.65625 35.5 6.65625C27.8502 6.65625 20.5136 9.69514 15.1044 15.1044C9.69514 20.5136 6.65625 27.8502 6.65625 35.5ZM28.3068 23.1948L47.2283 34.5504C47.3918 34.6491 47.5271 34.7884 47.621 34.9548C47.7148 35.1212 47.7642 35.309 47.7642 35.5C47.7642 35.691 47.7148 35.8788 47.621 36.0452C47.5271 36.2116 47.3918 36.3509 47.2283 36.4496L28.3068 47.8052C28.1386 47.9065 27.9464 47.9614 27.75 47.9642C27.5536 47.9669 27.36 47.9175 27.1889 47.8209C27.0179 47.7243 26.8755 47.5841 26.7765 47.4145C26.6774 47.2449 26.6251 47.052 26.625 46.8556V24.1489C26.6243 23.9521 26.676 23.7586 26.7748 23.5884C26.8735 23.4182 27.0158 23.2773 27.187 23.1802C27.3582 23.0831 27.5521 23.0332 27.7489 23.0358C27.9457 23.0384 28.1382 23.0933 28.3068 23.1948Z" fill="white" />
                  </g>
                  <defs>
                    <clipPath id="clip0_11_14">
                      <rect width="71" height="71" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="how-section">
        <div className="how-left">
          <h1>How it works</h1>
          <p>Three Simple Steps to Connect, Pray, and Uplift Others in Faith</p>
          <h2>Bible Say's</h2>
          <p>For where two or three gather in my name, there am I with them.</p>
          <hr />
          <p>Matthew 18:20</p>
        </div>
        <div className="how-right">
          <img src={howImg} alt="" />
        </div>
        <div className="circle2"></div>
      </div>

      <hr />

      <div className="how-section affilate-section">
        <div className="how-left">
          <h1>Become an Affiliate</h1>
          <h2>Share Faith, Earn Rewards</h2>
          <br />
          <p>
            At WePray, we believe in spreading the power of prayer far and wide. By joining our affiliate program, you can help grow our compassionate community while earning rewards. As a WePray affiliate, you’ll have the opportunity to share the platform with your network and inspire others to connect, pray, and uplift one another.
          </p>
        </div>
        <div className="how-right">
          
        </div>
        <div className="circle2"></div>
      </div>

      <div className="event-section">
        <h1>UPCOMING PRAYER CALLS</h1>
        {[...Array(4)].map((_, index) => (
          <div className="event-item" key={index} data-cursor-img="https://cf1.gatewaypeople.com/production/fae/image/asset/6441/gatewayworship_webbanner.jpg">
            <div className="date">
              <h3>20 OCT</h3>
            </div>
            <div>
              <h3 className="event-name">Service of Celebration</h3>
              <p>Sunday, 8:00 AM to 9:30 AM</p>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonial-section">
        <h1 className="title">TESTIMONIALS</h1>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            prevEl: '.prev',
            nextEl: '.next',
          }}
          pagination={{ clickable: true }}
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="card-test">
                <div className="test-detail">
                  <img src={testimonial.image} alt={testimonial.name} />
                  <div className="test-name">
                    <h3>{testimonial.name}</h3>
                    <img src={star} alt="rating" />
                  </div>
                </div>
                <p>"{testimonial.text}"</p>
              </div>
            </SwiperSlide>
          ))}
          <div className="prev">
          <FontAwesomeIcon icon={faAngleLeft} />
          </div>
          <div className="next">
          <FontAwesomeIcon icon={faAngleRight} style={{ color: '#fffff' }} />
          </div>
        </Swiper>
      </div>


      {/* Footer */}
      <div className="footer">
        <div className="col1">
          <div className="logo">
            <img src={logo} alt="" />
            <h1>WiPray</h1>
          </div>
          <b>Share Your Prayers, Uplift Your Soul</b>
        </div>
        <div className="col2">
          <b>Quick Links</b> <br />
          <a href="/">Home</a> <br />
          <a href="">About Us</a> <br />
          <a href="">Prayer Wall</a> <br />
          <a href="">Resources</a> <br />
          <a href="">Contact Us</a>
        </div>
        <div className="col2">
          <b>Other</b> <br />
          <a href="">Become an Affilate</a> <br />
          <a href="">Partners Page</a> <br />
        </div>
        <div className="col3">
          <b>Contact Us</b> <br />
          <b>Socila Links</b>
        </div>
      </div>

      <div className="footer-copy">
        <p>© 2024 WiPray - All Rights Reserved</p>
      </div>





    </div>
  );
};

export default Home;
