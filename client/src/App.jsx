// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Unauthorized from './pages/Unauthorized';
import Home from './pages/Home';
import About from './pages/About';
import PrayerWall from './pages/PrayerWall';
import PraiseWall from './pages/PraiseWall';
import ReportForm from './components/ReportForm';
import PrayerDetails from './components/PrayerDetails';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import SmoothScroll from './components/SmoothScroll';
import "./App.css"; // Your main CSS

const App = () => {
    return (
        <div className="app-container">
            <SmoothScroll />
            <main>
                <Router>
                    <AuthProvider>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} /> 
                            {/* above route will break css because of how navbar is implemented
                            This shuld be fixed in frontend */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/auth/callback" element={<AuthCallback />} />
                            <Route path="/unauthorized" element={<Unauthorized />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/prayerWall" element={<PrayerWall />} />
                            <Route path="/praiseWall" element={<PraiseWall />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/donate" element={<Donate />} />
                            <Route path="/prayers/:id/report" element={<ReportForm />}/>
                            <Route path="/prayers/:id" element={<PrayerDetails />}/>

                            {/* Protected Routes */}
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Redirect root to dashboard if <Home /> is not rendered above */}
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Navigate to="/home" replace />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch all route */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AuthProvider>
                </Router>
            </main>
        </div>
    );
};

export default App;