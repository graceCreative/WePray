import React from 'react'
import PropTypes from "prop-types";


const PrayerCard = ({ title, description, image, link }) => {
  return (
    <div className="bg-zinc-100 shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300">
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-600 ">
          {title}
        </h2>
        <p className="mt-2 text-gray-600">{description}</p>
        {link && (
          <a
            href={link}
            className="mt-4 inline-block text-blue-500 hover:underline dark:text-blue-400"
          >
            Learn more
          </a>
        )}
      </div>
    </div>
  )
}

PrayerCard.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
    link: PropTypes.string,
  };
  
  PrayerCard.defaultProps = {
    description: "",
    image: null,
    link: null,
  };
  

export default PrayerCard