import React from 'react';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faPhoneVolume,
  faUser,
  faExclamation,
  faPencil,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';


const Contact = () => {
  return (
    <>
      <Navbar />
      <div className="page-wrapper">
      <section className="about-img">
          <img src="https://www.shutterstock.com/image-photo/concept-contact-us-customer-support-600nw-2505308177.jpg" alt="About Us" />
        </section>

        <div className="contact-section">
          <div className="con-detail">
            <br />
            <h4>Contact Details</h4>
            <p>
              <FontAwesomeIcon icon={faEnvelope} /> info@adventhub.co
            </p>
            <p>
              <FontAwesomeIcon icon={faLocationDot} /> Berrien Springs, Michigan US
            </p>
          </div>
          <form
            id="form"
            className="con-form"
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Form submitted');
            }}
          >
            <div className="input">
              <FontAwesomeIcon icon={faUser} />
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder="Name"
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faEnvelope} />
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="Email Address"
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faPhoneVolume} />
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                placeholder="Phone"
              />
            </div>
            <div className="input">
              <FontAwesomeIcon icon={faExclamation} />
              <input
                type="text"
                name="subject"
                id="subject"
                required
                placeholder="Subject"
              />
            </div>
            <div className="textarea">
              <FontAwesomeIcon icon={faPencil} />
              <textarea
                name="message"
                id="message"
                required
                placeholder="How can we help you? Feel free to get in touch"
              />
            </div>
            <button type="submit">GET IN TOUCH</button>
          </form>
        </div>

        <Footer/>

      </div>
      
    </>
  );
};

export default Contact;
