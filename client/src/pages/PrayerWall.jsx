import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/axios';
import PrayerCard from '../components/shared/PrayerCard';
import {useNavigate} from 'react-router-dom'


const PrayerWall = () => {
  const [visibility, setVisibility] = useState(true);
  const [prayerForm, setPrayerForm] = useState({
    email: '',
    phone: '',
    message: '',
    name: '',
    visibility: visibility,
    type: 'prayer',
    is_anonymous: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prayers, setPrayers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const [hasMore, setHasMore] = useState(true); 
  const navigate = useNavigate();

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      setError(null);
  
      const prayersRes = await api.get("/prayers/approvedPrayers", {
        params: { page, limit: 10 },
      });
  
      const fetchedPrayers = prayersRes.data?.data?.prayers || [];
      console.log(fetchedPrayers);
  
      setPrayers((prevPrayers) => {
        const newPrayers = fetchedPrayers.filter(
          (newPrayer) => !prevPrayers.some((existingPrayer) => existingPrayer.id === newPrayer.id)
        );
        return [...prevPrayers, ...newPrayers];
      });
  
      // If fewer prayers are returned than the limit, we've fetched all pages
      if (fetchedPrayers.length < 10) setHasMore(false);
    } catch (error) {
      console.error("Error fetching prayers:", error);
      setError("Failed to fetch prayers.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (hasMore) fetchPrayers();
  }, [page]);
  
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target.documentElement;
    if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);
  // const loadMorePrayers = async () => {
  //   if (loading || !hasMore) return;
  
  //   setLoading(true);
  //   const nextPage = Math.floor(prayers.length / 10) + 1; // Assuming 10 prayers per page
  
  //   try {
  //     const prayersRes = await api.get(`/prayers/approvedPrayers`, {
  //       params: { page: nextPage, limit: 10 },
  //     });
  //     const fetchedPrayers = prayersRes.data?.data?.prayers;
  //     console.log(fetchPrayers);
  //     if (fetchedPrayers.length > 0) {
  //       setPrayers((prevPrayers) => [...prevPrayers, ...fetchedPrayers]);
  //     } else {
  //       setHasMore(false);
  //     }
  //   } catch (error) {
  //     setError("Failed to load more prayers");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submissionData = {
        ...prayerForm,
        is_anonymous: !prayerForm.name,
        name: prayerForm.name || 'Anonymous',
        visibility: visibility,
        type: 'prayer'
      };
      // console.log(submissionData);
      await api.post('/prayers', submissionData);
      const netlifyData = new FormData();
      netlifyData.append('name', prayerForm.name || 'Anonymous');
      netlifyData.append('message', prayerForm.message);
      netlifyData.append('is_anonymous', !prayerForm.name);
      netlifyData.append('visibility', visibility);
      netlifyData.append('type', 'prayer');
      netlifyData.append('form-name', 'prayer-request'); // Ensure this matches the hidden input

      const response = await fetch('/', {
        method: 'POST',
        body: netlifyData,
      });
      if (response.ok) {
        // Reset the form and set success state
        setPrayerForm({
          message: '',
          name: '',
          is_anonymous: false
        });
        setSuccess(true);
        setError(null);
        setShowForm(false);
  
        setTimeout(() => setSuccess(false), 3000);
      } else {
        // throw new Error('Failed to submit prayer request to Netlify');
        setPrayerForm({
          message: '',
          name: '',
          is_anonymous: false
        });
        setSuccess(true);
        setError(null);
        setShowForm(false);
  
        setTimeout(() => setSuccess(false), 3000);
        console.log("admin was not notified");
      }
    } catch (error) {
      console.error('Prayer submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit prayer request');
    }
  };

  // const handlePrayed = async (prayerId, prayCount) => {
  //   try{
  //       await api.put(`/prayers/${prayerId}/prayCount`, { prayCount });
  //   }catch (error){
  //     setError(error.response?.data?.message || 'Failed to update prayer count');
  //   }
      
  // }
  // useEffect(() => {
  //   console.log(prayers); // Check for duplicate IDs here
  // }, [prayers]);
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

        {!showForm ? (
          <div className='flex flex-col w-full py-4'>
            <div className='flex flex-row'>
            <button
            onClick={() => setShowForm(true)} 
            className="px-3 py-1 py-2 px-4 w-50 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#409F9C] hover:bg-[#368B88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#409F9C]">
              Submit a Prayer
            </button>
            <button
            onClick={() => navigate('/praiseWall')} 
            className="px-3 py-1 py-2 px-4 w-50 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#409F9C] hover:bg-[#368B88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#409F9C]">
              Praises 
            </button>
            </div>
            
            <div id="prayers-container" className='flex flex-col gap-4 p-2'>
            {prayers.map((prayer, index) => (
              <PrayerCard
                key={`prayer-${index}`}
                createdAt={prayer.created_at}
                prayerCount={parseInt(prayer.pray_count,10)}
                userName={prayer.name}
                content={prayer.message}
                prayerID={prayer.id}
                type={prayer.type}
                  // parseInt(prayer.pray_count + 1, 10))}
              />
            ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col w-full py-4'>   
            <form name="prayer-request" method="POST" data-netlify="true" onSubmit={handleSubmit} className="space-y-6">
              <input type="hidden" name="form-name" value="prayer-request" />
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={prayerForm.name}
                placeholder='skip for anonymous prayer'
                onChange={handleChange}
                className="mt-1 py-1 px-1 block w-full rounded-md bg-white border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                value={prayerForm.email}
                placeholder='optional'
                onChange={handleChange}
                className="mt-1 py-1 px-1 block w-full bg-white rounded-md border-2 border-gray-800 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={prayerForm.phone}
              placeholder='optional'
              onChange={handleChange}
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
            <div>
              <label htmlFor="visibility" className="block text-sm font-medium text-gray-700">
                  Show this on Praise Wall?
              </label>
              <select
                  value={visibility}
                  onChange={(e) =>setVisibility(e.target.value)}
                  className="border bg-white border-gray-300 rounded-md"
              >
                  <option value={true}>Yes! Share this on the prayer wall</option>
                  <option value={0}>No! Do not display this prayer</option>
              </select>
              
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
              onClick={() => setShowForm(false)}
              className="w-md flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#409F9C] hover:bg-[#368B88] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#409F9C]"
            >
              cancel
            </button>
            </div>
          </form>
          </div>
        
        )}
        
      </div>
    </>
  );
};

export default PrayerWall;