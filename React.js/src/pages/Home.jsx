import React from "react";
import '../App.css'
import logo from "../assets/logo.png";
import heroImg from "../assets/heroImg.png";
// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.min.css";
// import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Home = () => {
  return (
    <div>
      <nav className="nav">
        <div className="logo">
          <img src={logo} alt="WePray Logo" />
          <h1>WePray</h1>
        </div>
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="about.html">About Us</a></li>
          <li><a href="/">Prayer Wall</a></li>
          <li><a href="/">Contact Us</a></li>
          <li><a href="/">Donate</a></li>
        </ul>
        <button className="cta">Share Your Praise</button>
      </nav>

      <div className="hero-section">
        <div className="hero-left">
          <div className="content">
            <div className="mask">
              <h1 className="anim">Where God's People Unite in Prayer</h1>
            </div>
            <div className="mask">
              <p className="anim">
                WePray platform provides a space for individuals to share their prayer requests and praises, inviting others to join in prayer or celebrate moments of gratitude.
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
          At WePray, we believe in the transformative power of prayer and the strength of a faith-driven community...
        </p>
      </div>

      <div className="tv-section animText1">
        <h1>PRAYER TV SHOWS</h1>
        <div className="show-container">
          {["Karma or Putting others First", "Beautiful Through Christ", "Karma or Putting others First"].map((title, index) => (
            <div className="card" key={index}>
              <img src="https://lkn.jzg.temporary.site/website_857a1ce9/wp-content/uploads/2024/09/hqdefault-3.webp" alt="" />
              <div className="card-detail">
                <h2>{title}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="how-section">
        <div className="how-left">
          <h1>How it works</h1>
          <p>How WePray Brings Us Together</p>
          <h2>Bible Say's</h2>
          <p>For where two or three gather in my name, there am I with them.</p>
          <hr />
          <p>Matthew 18:20</p>
        </div>
        <div className="how-right">
          {["Share Your Prayer", "Join a Prayer Circle or Pray for Others", "Receive Support and Encouragement"].map((text, index) => (
            <div className="band" key={index}>
              <div className="icon" />
              <h4>{text}</h4>
            </div>
          ))}
        </div>
        <div className="circle2"></div>
      </div>

      <hr />

      <div className="how-section affilate-section">
        <div className="how-left">
          <h1>Become an Affiliate</h1>
          <h2>Share Faith, Earn Rewards</h2>
          <p>
            At WePray, we believe in spreading the power of prayer far and wide. By joining our affiliate program...
          </p>
        </div>
        <div className="how-right">
          {["Sign up", "Share", "Earn"].map((text, index) => (
            <div className="band" key={index}>
              <div className="icon" />
              <h4>{text}</h4>
            </div>
          ))}
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

      {/* <div className="testimonial-section">
        <h1 className="title">TESTIMONIALS</h1>
        <Swiper>
          {[...Array(3)].map((_, index) => (
            <SwiperSlide key={index}>
              <div className="card-test">
                <div className="test-detail">
                  <img src="https://img.freepik.com/free-photo/portrait-man-laughing_23-2148859448.jpg?size=338&ext=jpg&ga=GA1.1.1880011253.1728864000&semt=ais_hybrid-rr-similar" alt="Testimonial" />
                  <div className="test-name">
                    <h3>John Deo</h3>
                  </div>
                </div>
                <p>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore..."
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div> */}
    </div>
  );
};

export default Home;
