import React from "react";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Font Awesome
import "https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"; // Remix Icons
import "https://unpkg.com/lenis@1.1.14/dist/lenis.css"; // Lenis CSS
import "./style.css"; // Your main CSS

function About() {
  return (
    <div>
      <header>
        <nav className="nav">
          <div className="logo">
            <img src="./img/logo.png" alt="WePray Logo" />
            <h1>WePray</h1>
          </div>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/prayer-wall">Prayer Wall</a></li>
            <li><a href="/resources">Resources</a></li>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/donate">Donate</a></li>
          </ul>
          <button className="cta">Share Your Praise</button>
        </nav>
      </header>

      <main>
        <section className="about-img">
          <img src="./img/cta.png" alt="About Us" />
        </section>

        <section className="about-section">
          <div className="circle"></div>

          <div className="ab-left">
            <h1>About Us <i className="ri-arrow-right-down-line"></i></h1>
          </div>
          <p>
            There is nothing that brings peace to the heart like the ability to connect with our
            Creator through prayer. It is the avenue by which God’s interventions are wrought, and we are reminded
            in Scripture to “pray without ceasing.” We are also called to lift one another up in prayer, whether in
            corporate, group, or personal settings. Prayer is the powerful means through which God performs great
            things when His people unite in faith.
            <br /><br />
            This is the heart and mission behind WePray—to provide a dedicated platform where believers can share
            their needs for prayer and celebrate the answered ones with praise. Whether it's a personal struggle, a
            request for healing, or gratitude for God’s blessings, WePray offers a place where the body of Christ
            can come together and pray for each other.
            <br /><br />
            WePray is an app developed by Advent Hub LLC, a digital evangelism agency with a passion for leveraging
            technology to advance the gospel. Our vision began with a simple but profound question: “What if there
            were more people praying for each other?”
            <br /><br />
            In a humble hotel room during GYC 2023, our CEO scribbled this concept on a sheet of paper, and from that
            moment, WePray was born. We believe in the power of prayer and the community it builds, and we cannot
            wait to see what God will accomplish through this app and other platforms that unite His people.
          </p>
        </section>
      </main>

      <footer>
        <div className="footer">
          <div className="col1">
            <div className="logo">
              <img src="./img/logo.png" alt="WePray Logo" />
              <h1>WePray</h1>
            </div>
            <b>Share Your Prayers, Uplift Your Soul</b>
          </div>
          <div className="col2">
            <b>Quick Links</b> <br />
            <a href="/">Home</a> <br />
            <a href="/about">About Us</a> <br />
            <a href="/prayer-wall">Prayer Wall</a> <br />
            <a href="/resources">Resources</a> <br />
            <a href="/contact">Contact Us</a>
          </div>
          <div className="col2">
            <b>Other</b> <br />
            <a href="/affiliate">Become an Affiliate</a> <br />
            <a href="/partners">Partners Page</a> <br />
          </div>
          <div className="col3">
            <b>Contact Us</b> <br />
            <b>Social Links</b>
          </div>
        </div>
        <div className="footer-copy">
          <p>© 2024 WePray - All Rights Reserved</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
