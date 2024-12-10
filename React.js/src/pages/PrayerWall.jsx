import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/axios';

const PrayerWall = () => {
  const [prayerForm, setPrayerForm] = useState({
    subject: '',
    message: '',
    name: ''  // Adding name field
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/prayers', prayerForm);
      setPrayerForm({ subject: '', message: '', name: '' });
      setSuccess(true);
      setError(null);
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Prayer submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit prayer request');
    }
  };

  const handleChange = (e) => {
    setPrayerForm({
      ...prayerForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mt-16 mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Share Your Prayer Request</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Prayer request submitted successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={prayerForm.name}
              onChange={handleChange}
              required
              className="mt-1 py-1 px-1 block w-full rounded-md bg-white border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Prayer Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={prayerForm.subject}
              onChange={handleChange}
              required
              className="mt-1 py-1 px-1 block w-full bg-white rounded-md border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Prayer Message
            </label>
            <textarea
              id="message"
              name="message"
              value={prayerForm.message}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block py-1 px-1 w-full bg-white rounded-md border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#409F9C] hover:bg-[#368B88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#409F9C]"
          >
            Submit Prayer Request
          </button>
        </form>
      </div>
    </>
  );
};

export default PrayerWall;