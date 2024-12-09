// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    // States
    const [prayers, setPrayers] = useState([]);
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({
        totalPrayers: 0,
        pendingPrayers: 0,
        totalEvents: 0
    });

    // Modal states and forms
    const [showPrayerForm, setShowPrayerForm] = useState(false);
    const [showEventForm, setShowEventForm] = useState(false);
    const [prayerForm, setPrayerForm] = useState({
        subject: '',
        message: ''
    });
    const [eventForm, setEventForm] = useState({
        title: '',
        description: '',
        event_type: 'live_prayer',
        start_time: '',
        end_time: ''
    });

    useEffect(() => {
        fetchDashboardData();
    }, [user.role]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
    
            const [prayersRes, eventsRes, usersRes, coordinatorsRes] = await Promise.all([
                (user.role == 'admin' || user.role == 'coordinator') ? api.get('/prayers') : api.get('/prayers/approved'),
                api.get('/events'),
                (user.role == 'admin' || user.role == 'coordinator') ? api.get('/users/members') : null,
                user.role === 'admin' ? api.get('/users/coordinators') : null
            ]);
    
            setPrayers(Array.isArray(prayersRes.data.data.prayers) ? prayersRes.data.data.prayers : []);
            setEvents(Array.isArray(eventsRes.data.data.events) ? eventsRes.data.data.events : []);
            
            

            if(user.role == 'coordinator' || user.role === 'admin'){
                var allUsers = Array.isArray(usersRes.data.data.users) ? usersRes.data.data.users : [];
            }
            
            if (user.role === 'admin' && coordinatorsRes) {
                const coordinators = Array.isArray(coordinatorsRes.data.data.users) ? coordinatorsRes.data.data.users : [];
                allUsers = [...allUsers, ...coordinators];
            }
            
            setUsers(allUsers);
            
            setStats({
                totalPrayers: prayersRes.data.data.prayers.length,
                pendingPrayers: prayersRes.data.data.prayers.filter(p => p.status === 'pending')?.length || 0,
                totalEvents: eventsRes.data.data.events.length
            });
        } catch (error) {
            console.error('Dashboard data error:', error);
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const handleMakeCoordinator = async (userId) => {
        try {
            const newRole = users.find(u => u.id === userId)?.role === 'coordinator' ? 'member' : 'coordinator';
            await api.put(`/users/role/${userId}`, { role: newRole });
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update user role:', error);
            if (error.response?.status === 403) {
                setError('Unauthorized: Only admins can modify user roles');
            } else {
                setError('Failed to update user role');
            }
        }
    };
    
    const handleDeleteUser = async (userId) => {
        try {
            await api.delete(`/users/delete/${userId}`);
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update user status:', error);
            if (error.response?.status === 403) {
                setError('Unauthorized: Insufficient permissions');
            } else {
                setError('Failed to update user status');
            }
        }
    };

    const handlePrayerSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/prayers', prayerForm);
            setShowPrayerForm(false);
            setPrayerForm({ subject: '', message: '' });
            fetchDashboardData();
        } catch (error) {
            console.error('Prayer submission error:', error.response?.data || error);
            setError(error.response?.data?.message || 'Failed to submit prayer request');
        }
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/events', eventForm);
            setShowEventForm(false);
            setEventForm({
                title: '',
                description: '',
                event_type: 'live_prayer',
                start_time: '',
                end_time: ''
            });
            fetchDashboardData();
        } catch (error) {
            setError('Failed to create event');
        }
    };

    const handlePrayerStatusUpdate = async (prayerId, status) => {
        try {
            await api.put(`/prayers/${prayerId}/status`, { status });
            fetchDashboardData();
        } catch (error) {
            console.log(error);
            setError('Failed to update prayer status');
        }
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-200 p-4">
                <div className="text-lg font-bold mb-4">WePray</div>
                <ul>
                    <li className="mb-2">Dashboard</li>
                    <li className="mb-2">Manage User Access</li>
                    <li className="mb-2">Community Settings</li>
                    <li className="mb-2">Prayer Requests</li>
                    <li className="mb-2">Comments and Reactions</li>
                    {/* ... other menu items ... */}
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                        Logout
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="bg-teal-500 text-white p-5 rounded-lg">
                        <div>Prayer Registered</div>
                        <div className="text-3xl">{stats.totalPrayers}</div>
                    </div>
                    <div className="bg-teal-500 text-white p-5 rounded-lg">
                        <div>New Member Request</div>
                        <div className="text-3xl">250</div>
                    </div>
                    <div className="bg-teal-500 text-white p-5 rounded-lg">
                        <div>Active Member</div>
                        <div className="text-3xl">856</div>
                    </div>
                </div>

                {/* Manage Prayer Requests */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">Manage Prayer Requests</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prayer Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {prayers.map((prayer) => (
                                <tr key={prayer.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{prayer.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(prayer.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{prayer.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{prayer.message}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;