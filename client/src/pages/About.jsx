import React from "react";
import { Outlet, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import about from "../assets/cta.png";
import "../App.css"; // Your main CSS
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <div>
      <Navbar/>

      <main>
        <section className="about-img">
          <img src={about} alt="About Us" />
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

      <Footer/>
    </div>
  );
}

export default About;
