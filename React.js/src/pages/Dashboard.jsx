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
        <div className="h-screen w-full justify-center items-center bg-gray-100">
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                        <div className="flex space-x-4">
                            <button
                                onClick={logout} // Call the logout function
                                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            >
                                Logout
                            </button>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                onClick={() => setShowPrayerForm(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                New Prayer Request
                            </button>
                            {(user.role === 'admin' || user.role === 'coordinator') && (
                                <button
                                    onClick={() => setShowEventForm(true)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                                >
                                    Create Event
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                            <div className="text-sm font-medium text-gray-500">Total Prayers</div>
                            <div className="mt-1 text-3xl text-blue-900 font-semibold">{stats.totalPrayers}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                            <div className="text-sm font-medium text-gray-500">Pending Prayers</div>
                            <div className="mt-1 text-3xl text-blue-900 font-semibold">{stats.pendingPrayers}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                            <div className="text-sm font-medium text-gray-500">Total Events</div>
                            <div className="mt-1 text-3xl text-blue-900 font-semibold">{stats.totalEvents}</div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="-mb-px flex space-x-8">
                        {['prayers', 'events', ...(user.role === 'admin' || user.role === 'coordinator' ? ['members'] : [])].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`${
                                        activeTab === tab
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500'
                                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium capitalize`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'prayers' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {prayers.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No prayer requests yet</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {prayers.map((prayer) => (
                                        <li key={prayer.id} className="p-4">
                                            <div className="flex justify-between items-start">
                                                
                                                {/* {(user.role === 'member') && (prayer.status === 'approved') && ( */}
                                                    <div>
                                                    <h3 className="text-lg text-blue-500 font-medium">{prayer.subject}</h3>
                                                    <p className="mt-1 text-gray-600">{prayer.message}</p>
                                                </div>
                                                {/* // )} */}
                                                
                                                {(user.role === 'admin' || user.role === 'coordinator') && prayer.status === 'pending' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handlePrayerStatusUpdate(prayer.id, 'approved')}
                                                            className="bg-green-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handlePrayerStatusUpdate(prayer.id, 'rejected')}
                                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {events.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No events yet</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {events.map((event) => (
                                        <li key={event.id} className="p-4">
                                            <div>
                                                <h3 className="text-lg font-medium">{event.title}</h3>
                                                <p className="mt-1 text-gray-600">{event.description}</p>
                                                <div className="mt-2 text-sm text-gray-500">
                                                    <span className="mr-4">Type: {event.event_type}</span>
                                                    <span>
                                                        {new Date(event.start_time).toLocaleString()} - 
                                                        {new Date(event.end_time).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}

                    {activeTab === 'members' && (user.role === 'admin' || user.role === 'coordinator') && (
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            {users.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No members yet</p>
                                </div>
                            ) : (
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
                                        {users.map((member) => (
                                            <tr key={member.id}>
                                                <td className="px-6 py-4 text-blue-900 whitespace-nowrap">{member.name}</td>
                                                <td className="px-6 py-4 text-blue-900 whitespace-nowrap">{member.email}</td>
                                                <td className="px-6 py-4 text-blue-900 whitespace-nowrap">{member.role}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex space-x-2">
                                                        {member.role === 'member' && (
                                                            <button
                                                                onClick={() => handleMakeCoordinator(member.id)}
                                                                className="bg-blue-500 text-black px-3 py-1 rounded"
                                                            >
                                                                Make Coordinator
                                                            </button>
                                                        )}
                                                        {member.role === 'coordinator' && (
                                                            <button
                                                                onClick={() => handleMakeCoordinator(member.id)}
                                                                className="bg-yellow-500 text-black px-3 py-1 rounded"
                                                            >
                                                                Make Member
                                                            </button>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <button
                                                            onClick={() => handleDeleteUser(member.id)}
                                                            className="bg-red-500 text-white px-3 py-1 rounded"
                                                        >
                                                            Delete
                                                        </button>
                                                        )}
                                                        
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Prayer Form Modal */}
                    {showPrayerForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg max-w-md w-full p-6">
                                <h2 className="text-lg font-medium mb-4">New Prayer Request</h2>
                                <form onSubmit={handlePrayerSubmit}>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="Subject"
                                            value={prayerForm.subject}
                                            onChange={e => setPrayerForm({...prayerForm, subject: e.target.value})}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea
                                            placeholder="Message"
                                            value={prayerForm.message}
                                            onChange={e => setPrayerForm({...prayerForm, message: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            rows="4"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowPrayerForm(false)}
                                            className="px-4 py-2 text-gray-600 border rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Event Form Modal */}
                    {showEventForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                            <div className="bg-white rounded-lg max-w-md w-full p-6">
                                <h2 className="text-lg font-medium mb-4">Create Event</h2>
                                <form onSubmit={handleEventSubmit}>
                                    <div className="mb-4">
                                        <input
                                            type="text"
                                            placeholder="Title"
                                            value={eventForm.title}
                                            onChange={e => setEventForm({...eventForm, title: e.target.value})}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <textarea
                                            placeholder="Description"
                                            value={eventForm.description}
                                            onChange={e => setEventForm({...eventForm, description: e.target.value})}
                                            className="w-full p-2 border rounded"
                                            rows="3"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="datetime-local"
                                            value={eventForm.start_time}
                                            onChange={e => setEventForm({...eventForm, start_time: e.target.value})}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="datetime-local"
                                            value={eventForm.end_time}
                                            onChange={e => setEventForm({...eventForm, end_time: e.target.value})}
                                            className="w-full p-2 border rounded"
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowEventForm(false)}
                                            className="px-4 py-2 text-gray-600 border rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded"
                                        >
                                            Create
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;