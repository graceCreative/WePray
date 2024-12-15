import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const ApiTest = () => {
  const [token, setToken] = useState('');
  const [results, setResults] = useState({});
  const [error, setError] = useState('');
  
  const [registerForm, setRegisterForm] = useState({
    name: '', email: '', password: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '', password: ''
  });
  const [prayerForm, setPrayerForm] = useState({
    subject: '', message: ''
  });
  const [eventForm, setEventForm] = useState({
    title: '', description: '', event_type: 'live_prayer',
    start_time: '', end_time: ''
  });

  const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' }
  });

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', registerForm);
      setResults(prev => ({...prev, register: res.data}));
    } catch (err) {
      setError('Register Error: ' + err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', loginForm);
      setToken(res.data.data.token);
      setResults(prev => ({...prev, login: res.data}));
    } catch (err) {
      setError('Login Error: ' + err.message);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handlePrayer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/prayers', prayerForm);
      setResults(prev => ({...prev, createPrayer: res.data}));
    } catch (err) {
      setError('Prayer Error: ' + err.message);
    }
  };

  const handleEvent = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/events', eventForm);
      setResults(prev => ({...prev, createEvent: res.data}));
    } catch (err) {
      setError('Event Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '20px' }}>API Test Page</h1>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Register Form */}
        <div className="form-section">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Name"
              value={registerForm.name}
              onChange={e => setRegisterForm({...registerForm, name: e.target.value})}
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={e => setRegisterForm({...registerForm, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={e => setRegisterForm({...registerForm, password: e.target.value})}
            />
            <button type="submit">Register</button>
          </form>
        </div>

        {/* Login Form */}
        <div className="form-section">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={e => setLoginForm({...loginForm, email: e.target.value})}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
            />
            <button type="submit">Login</button>
            <button type="button" onClick={handleGoogleLogin}>
              Login with Google
            </button>
          </form>
        </div>

        {/* Prayer Form */}
        <div className="form-section">
          <h2>Create Prayer Request</h2>
          <form onSubmit={handlePrayer}>
            <input
              type="text"
              placeholder="Subject"
              value={prayerForm.subject}
              onChange={e => setPrayerForm({...prayerForm, subject: e.target.value})}
            />
            <textarea
              placeholder="Message"
              value={prayerForm.message}
              onChange={e => setPrayerForm({...prayerForm, message: e.target.value})}
            />
            <button type="submit">Submit Prayer</button>
          </form>
        </div>

        {/* Event Form */}
        <div className="form-section">
          <h2>Create Event</h2>
          <form onSubmit={handleEvent}>
            <input
              type="text"
              placeholder="Title"
              value={eventForm.title}
              onChange={e => setEventForm({...eventForm, title: e.target.value})}
            />
            <textarea
              placeholder="Description"
              value={eventForm.description}
              onChange={e => setEventForm({...eventForm, description: e.target.value})}
            />
            <input
              type="datetime-local"
              placeholder="Start Time"
              value={eventForm.start_time}
              onChange={e => setEventForm({...eventForm, start_time: e.target.value})}
            />
            <input
              type="datetime-local"
              placeholder="End Time"
              value={eventForm.end_time}
              onChange={e => setEventForm({...eventForm, end_time: e.target.value})}
            />
            <button type="submit">Create Event</button>
          </form>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#fee', color: '#c00' }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Results:</h2>
        <pre style={{ backgroundColor: '#c00', padding: '10px', overflow: 'auto' }}>
          {JSON.stringify(results, null, 2)}
        </pre>
      </div>

      <style >{`
        .form-section {
          background: #fff;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        input, textarea {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        button {
          padding: 8px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        button:hover {
          background: #0051cc;
        }
      `}</style>
    </div>
  );
};

export default ApiTest;