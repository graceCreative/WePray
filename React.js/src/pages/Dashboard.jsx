// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faHome, 
    faUsers, 
    faCog, 
    faPrayingHands, 
    faComments 
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
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

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/users/role/${userId}`, { role: newRole });
            fetchDashboardData();
        } catch (error) {
            console.error('Failed to update user role:', error);
            setError('Failed to update user role');
        }
    };

    const renderUserManagementSection = () => {
        if (user.role !== 'admin' && user.role !== 'coordinator') return null;

        return (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
                <h2 className="text-xl font-semibold mb-4 p-4">Manage Users</h2>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{u.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{u.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={u.role}
                                        onChange={(e) => user.role === 'admin' && handleRoleChange(u.id, e.target.value)}
                                        className="border bg-white border-gray-300 rounded-md"
                                        disabled={user.role !== 'admin'}
                                    >
                                        <option value="member">Member</option>
                                        <option value="coordinator">Coordinator</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => handleDeleteUser(u.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded-md"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderContent = () => {
        switch(activeTab) {
            case 'dashboard':
                return (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="bg-[#409F9C] text-white p-5 rounded-lg">
                                <div className='text-white'>Total Prayers</div>
                                <div className="text-3xl text-white">{stats.totalPrayers}</div>
                            </div>
                            {(user.role === 'admin' || user.role === 'coordinator') && (
                                <div className="bg-[#409F9C] text-white p-5 rounded-lg">
                                    <div className='text-white'>New Prayer Requests</div>
                                    <div className="text-3xl text-white">{stats.pendingPrayers}</div>
                                </div>
                            )}
                            <div className="bg-[#409F9C] text-white p-5 rounded-lg">
                                <div className='text-white'>Active Members</div>
                                <div className="text-3xl text-white">{users.length}</div>
                            </div>
                        </div>

                        {/* Prayer Requests Table */}
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-8">
                            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                <h2 className="text-xl font-semibold">Recent Prayer Requests</h2>
                                <div className="text-sm text-gray-500">
                                    Total: {prayers.length} | Pending: {stats.pendingPrayers}
                                </div>
                            </div>
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        {(user.role === 'admin' || user.role === 'coordinator') && (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {prayers.slice(0, 5).map((prayer) => (
                                        <tr key={prayer.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{prayer.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(prayer.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{prayer.subject}</td>
                                            <td className="px-6 py-4 whitespace-normal max-w-xs truncate">
                                                {prayer.message}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                    ${prayer.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                      prayer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                      'bg-yellow-100 text-yellow-800'}`}
                                                >
                                                    {prayer.status}
                                                </span>
                                            </td>
                                            {(user.role === 'admin' || user.role === 'coordinator') && (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <button
                                                        onClick={() => handlePrayerStatusUpdate(prayer.id, 'approved')}
                                                        className="mr-2 px-3 py-1 bg-green-500 text-white rounded-md"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handlePrayerStatusUpdate(prayer.id, 'rejected')}
                                                        className="px-3 py-1 bg-red-500 text-white rounded-md"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                );
            case 'manage_users':
                return renderUserManagementSection();
            case 'prayer_requests':
                return (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Manage Prayer Requests</h2>
                            <div className="text-sm text-gray-500">
                                Total: {prayers.length} | Pending: {stats.pendingPrayers}
                            </div>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prayer Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    {(user.role === 'admin' || user.role === 'coordinator') && (
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {prayers.map((prayer) => (
                                    <tr key={prayer.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{prayer.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{new Date(prayer.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{prayer.subject}</td>
                                        <td className="px-6 py-4 whitespace-normal max-w-xs truncate">{prayer.message}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${prayer.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                                  prayer.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                                                  'bg-yellow-100 text-yellow-800'}`}>
                                                {prayer.status}
                                            </span>
                                        </td>
                                        {(user.role === 'admin' || user.role === 'coordinator') && (
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <button
                                                    onClick={() => handlePrayerStatusUpdate(prayer.id, 'approved')}
                                                    className="mr-2 px-3 py-1 bg-green-500 text-white rounded-md"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handlePrayerStatusUpdate(prayer.id, 'rejected')}
                                                    className="px-3 py-1 bg-red-500 text-white rounded-md"
                                                >
                                                    Reject
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'events':
                return (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Manage Events</h2>
                            {(user.role === 'admin' || user.role === 'coordinator') && (
                                <button
                                    onClick={() => setShowEventForm(true)}
                                    className="bg-[#409F9C] text-white px-4 py-2 rounded-md"
                                >
                                    Create Event
                                </button>
                            )}
                        </div>
                        
                        {/* Event listing table */}
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {events.map((event) => (
                                    <tr key={event.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{event.event_type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(event.start_time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(event.end_time).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleDeleteEvent(event.id)}
                                                className="px-3 py-1 bg-red-500 text-white rounded-md"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Event creation modal */}
                        {showEventForm && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white p-8 rounded-lg w-1/2">
                                    <h3 className="text-lg font-medium mb-4">Create New Event</h3>
                                    <form onSubmit={handleEventSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Title</label>
                                            <input
                                                type="text"
                                                value={eventForm.title}
                                                onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                                                className="mt-1 bg-white block w-full rounded-md border-gray-300 p-1 shadow-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Description</label>
                                            <textarea
                                                value={eventForm.description}
                                                onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                                                className="mt-1 bg-white block w-full rounded-md border-gray-300 p-1 shadow-md"
                                                rows={3}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Event Type</label>
                                            <select
                                                value={eventForm.event_type}
                                                onChange={(e) => setEventForm({...eventForm, event_type: e.target.value})}
                                                className="mt-1 bg-white block w-full rounded-md border-gray-300 p-1 shadow-md"
                                            >
                                                <option value="live_prayer">Live Prayer</option>
                                                <option value="workshop">Workshop</option>
                                                <option value="meeting">Meeting</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                            <input
                                                type="datetime-local"
                                                value={eventForm.start_time}
                                                onChange={(e) => setEventForm({...eventForm, start_time: e.target.value})}
                                                className="mt-1 p-1 bg-white block w-full rounded-md border-gray-300 shadow-md"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">End Time</label>
                                            <input
                                                type="datetime-local"
                                                value={eventForm.end_time}
                                                onChange={(e) => setEventForm({...eventForm, end_time: e.target.value})}
                                                className="mt-1 p-1 bg-white block w-full rounded-md border-gray-300 shadow-md "
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowEventForm(false)}
                                                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="bg-[#409F9C] text-white px-4 py-2 rounded-md"
                                            >
                                                Create Event
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                );
            default:
                return <div>Coming Soon</div>;
        }
    };

    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-200 p-4">
                <div className="text-lg font-bold mb-0">WePray</div>
                {user.role === 'admin' && <div className="text-sm font-medium mb-8 ">Admin Panel</div>}
                {user.role === 'coordinator' && <div className="text-sm font-medium mb-4">Coordinator</div>}
                <ul>
                    <li 
                        className={`mb-2 p-2 rounded cursor-pointer ${activeTab === 'dashboard' ? 'bg-[#409F9C] text-white' : 'hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        Dashboard
                    </li>
                    {(user.role === 'admin' || user.role === 'coordinator') && (
                        <li 
                            className={`mb-2 p-2 rounded cursor-pointer ${activeTab === 'manage_users' ? 'bg-[#409F9C] text-white' : 'hover:bg-gray-300'}`}
                            onClick={() => setActiveTab('manage_users')}
                        >
                            Manage User Access
                        </li>
                    )}
                    <li 
                        className={`mb-2 p-2 rounded cursor-pointer ${activeTab === 'community' ? 'bg-[#409F9C] text-white' : 'hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('community')}
                    >
                        Community Settings
                    </li>
                    <li 
                        className={`mb-2 p-2 rounded cursor-pointer ${activeTab === 'prayer_requests' ? 'bg-[#409F9C] text-white' : 'hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('prayer_requests')}
                    >
                        Prayer Requests
                    </li>
                    <li 
                        className={`mb-2 p-2 rounded cursor-pointer ${activeTab === 'comments' ? 'bg-[#409F9C] text-white' : 'hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('comments')}
                    >
                        Comments and Reactions
                    </li>
                    <li 
                        className={`mb-2 p-2 rounded cursor-pointer ${activeTab === 'events' ? 'bg-[#409F9C] text-white' : 'hover:bg-gray-300'}`}
                        onClick={() => setActiveTab('events')}
                    >
                        Events
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6 overflow-y-auto max-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded-md">
                        Logout
                    </button>
                </div>

                {/* Dynamic Content based on active tab */}
                {renderContent()}
            </div>
        </div>
    );
};

export default Dashboard;