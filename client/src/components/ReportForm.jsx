import React from 'react'
import { useState } from 'react';
import api from '../utils/axios'
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';

const ReportForm = () => {
    const {id: prayerID} = useParams();
    console.log(prayerID);
    const [prayerForm, setPrayerForm] = useState({
        email: '',
        reason: '',
        name: '',
        prayer_id: prayerID,
      });
    
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = {
            ...prayerForm,
            };
            console.log(submissionData);
            await api.post('/pReports', submissionData);
            setPrayerForm({
            email: '',
            reason: '',
            name: '',
            prayer_id: prayerID,
            });
            setSuccess(true);
            setError(null);
            // setShowForm(false)
            
            setTimeout(() =>{
                setSuccess(false);
                navigate('/prayerWall');
            } , 2000);
        } catch (error) {
            console.error('Prayer submission error:', error);
            setError(error.response?.data?.message || 'Failed to submit prayer request');
        }
    };
    const handleCancel = () => {
        navigate('/prayerWall');
    }

    const handleChange = (e) => {
        setPrayerForm({
        ...prayerForm,
        [e.target.name]: e.target.value 
        });
    };

  return (
    <>
    <Navbar />
    <div className="max-w-4xl mt-16 mx-auto p-2">
        {/* <h1 className="text-3xl font-bold mb-6">Share Your Prayer Request</h1> */}
        
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
                Your Name (optional)
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={prayerForm.name}
                onChange={handleChange}
                className="mt-1 py-1 px-1 block w-full rounded-md bg-white border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                email (optional)
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={prayerForm.email}
                onChange={handleChange}
                className="mt-1 py-1 px-1 block w-full bg-white rounded-md border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Reason (optional)
              </label>
              <textarea
                id="message"
                name="message"
                value={prayerForm.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 block py-1 px-1 w-full bg-white rounded-md border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div className='flex flex-row'>
            <button
              type="submit"
              className="w-md flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#409F9C] hover:bg-[#368B88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#409F9C]"
            >
              Submit Prayer Request
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-md flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#409F9C] hover:bg-[#368B88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#409F9C]"
            >
              cancel
            </button>
            </div>
          </form>
    </div>
    </>
  )
}

export default ReportForm