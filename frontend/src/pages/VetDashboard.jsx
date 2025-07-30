import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddHealthRecord from './AddHealthRecord';
import axios from "axios";
import {
    Bell, Activity, Calendar, Users, AlertTriangle, FileText, Pill,
    Thermometer, Heart, MapPin, Clock, Search, Filter, Plus, TrendingUp,
    CheckCircle, XCircle, Phone, User, LogOut
} from 'lucide-react';

// Capitalize utility
const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Header component with displayName and initials
const VeterinarianDashboardHeader = ({ displayName, userInitials, onLogout }) => {
    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-lg mr-3">
                            <User className="w-6 h-6 text-green-600" />
                        </div>
                        <h1 className="text-xl font-semibold text-gray-800">Veterinarian Dashboard</h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                        </button>
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">{userInitials}</span>
                            </div>
                            <span className="text-gray-700 font-medium">Welcome, {displayName}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

// Stats Card Component
const StatsCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colorClasses = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        yellow: "bg-yellow-500",
        red: "bg-red-500"
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
                <div className={`${colorClasses[color]} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
};

// Appointment Card Component
const AppointmentCard = ({ appointment }) => {
    const priorityColors = {
        high: "bg-red-100 text-red-800 border-red-200",
        medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
        low: "bg-green-100 text-green-800 border-green-200"
    };

    const statusColors = {
        urgent: "bg-red-500 text-white",
        scheduled: "bg-blue-500 text-white",
        completed: "bg-green-500 text-white"
    };

    return (
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{appointment.farmerName}</h3>
                    <p className="text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {appointment.location}
                    </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[appointment.status]}`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
            </div>

            <div className="space-y-2 mb-4">
                <p className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {appointment.time} - {appointment.date}
                </p>
                <p className="flex items-center text-gray-600">
                    <Activity className="h-4 w-4 mr-2" />
                    {appointment.animalType} ({appointment.animalId})
                </p>
                <p className="flex items-center text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {appointment.reason}
                </p>
                <p className="flex items-center text-gray-600">
                    <Phone className="h-4 w-4 mr-2" />
                    {appointment.phone}
                </p>
            </div>

            <div className="flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityColors[appointment.priority]}`}>
                    {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)} Priority
                </span>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                        View Details
                    </button>
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                        Complete
                    </button>
                </div>
            </div>
        </div>
    );
};

const HealthRecordCard = ({ record }) => {
    const statusColors = {
        ACTIVE: "text-green-600",
        RESOLVED: "text-yellow-600",
        ONGOING: "text-red-600"
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Animal ID: {record.livestockId}
                    </h3>
                </div>
                <span className={`font-medium ${statusColors[record.status]}`}>
                    {record.status}
                </span>
            </div>

            {/* Health Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-sm text-gray-600">Examination Date</p>
                    <p className="font-medium">{record.examinationDate}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="font-medium">{record.weightKg} Kg</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="font-medium">{record.temperatureCelsius} °C</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="font-medium">{record.heartRateBpm} bpm</p>
                </div>
            </div>

            {/* Symptoms */}
            <div>
                <p className="text-sm text-gray-600 mb-2">Symptoms</p>
                <div className="flex flex-wrap gap-2">
                    {record.symptoms && record.symptoms.length > 0 ? (
                        record.symptoms.map((symptom, index) => (
                            <span key={index} className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                                {symptom}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">None</span>
                    )}
                </div>
            </div>

            {/* Medications */}
            <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Medications / Vaccinations</p>
                <div className="flex flex-wrap gap-2">
                    {record.medicationsPrescribed && record.medicationsPrescribed.length > 0 ? (
                        record.medicationsPrescribed.map((med, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {med}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500 text-sm">None</span>
                    )}
                </div>
            </div>
        </div>
    );
};


const VetDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [healthRecords, setHealthRecords] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/health-records", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();
                if (data.success) {
                    setHealthRecords(data.data); // Assuming ApiResponse returns data
                } else {
                    console.error("Failed to fetch health records:", data.message);
                }
            } catch (err) {
                console.error("Error fetching health records:", err);
            }
        };

        fetchRecords();
    }, [token]);

    // Appointments state (demo data)
    const [appointments] = useState([
        {
            id: 1,
            farmerId: 'F001',
            farmerName: 'John Doe',
            location: 'Kiambu Farm',
            time: '09:00 AM',
            date: '2025-07-26',
            animalType: 'Cattle',
            animalId: 'C001',
            reason: 'Vaccination',
            status: 'scheduled',
            priority: 'medium',
            phone: '+254700123456'
        },
        {
            id: 2,
            farmerId: 'F002',
            farmerName: 'Mary Smith',
            location: 'Nakuru Dairy',
            time: '11:30 AM',
            date: '2025-07-26',
            animalType: 'Cattle',
            animalId: 'C045',
            reason: 'Emergency - Lameness',
            status: 'urgent',
            priority: 'high',
            phone: '+254700654321'
        }
    ]);

    // Load user from localStorage on component mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error('Error parsing stored user:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);



    // Add new health record dynamically
    const handleRecordAdded = (newRecord) => {
        const recordWithId = {
            ...newRecord,
            id: healthRecords.length + 1
        };
        setHealthRecords([...healthRecords, recordWithId]);
        setIsModalOpen(false);
    };

    // Handle save record (corrected function name)
    const handleSaveRecord = (newRecord) => {
        handleRecordAdded(newRecord);
    };

    // Calculate dashboard stats
    const dashboardStats = {
        totalAppointments: appointments.length,
        urgentCases: appointments.filter(a => a.priority === 'high').length,
        animalsUnderCare: healthRecords.filter(r => r.healthStatus === 'Under Treatment').length,
        completedToday: 5
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/login');
    };

    const filteredAppointments = appointments.filter(appointment => {
        const matchesSearch = appointment.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appointment.animalType.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = selectedFilter === 'all' || appointment.priority === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    if (!isLoggedIn || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Logged Out</h2>
                    <p className="text-gray-600 mb-4">You have been successfully logged out.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Login Again
                    </button>
                </div>
            </div>
        );
    }

    const displayName = capitalize(user.username || 'Veterinarian');
    const userInitials = displayName.split(' ').map(name => name.charAt(0)).join('').substring(0, 2).toUpperCase();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <VeterinarianDashboardHeader
                displayName={displayName}
                userInitials={userInitials}
                onLogout={handleLogout}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8">
                        {[
                            { id: 'overview', name: 'Overview', icon: Activity },
                            { id: 'appointments', name: 'Appointments', icon: Calendar },
                            { id: 'health-records', name: 'Health Records', icon: FileText }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <tab.icon className="h-5 w-5 mr-2" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Appointments"
                                value={dashboardStats.totalAppointments}
                                icon={Calendar}
                                color="blue"
                            />
                            <StatsCard
                                title="Urgent Cases"
                                value={dashboardStats.urgentCases}
                                icon={AlertTriangle}
                                color="red"
                            />
                            <StatsCard
                                title="Animals Under Care"
                                value={dashboardStats.animalsUnderCare}
                                icon={Heart}
                                color="yellow"
                            />
                            <StatsCard
                                title="Completed Today"
                                value={dashboardStats.completedToday}
                                icon={CheckCircle}
                                color="green"
                            />
                        </div>

                        {/* Recent Appointments */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Appointments</h2>
                            <div className="grid gap-6">
                                {appointments.slice(0, 2).map((appointment) => (
                                    <AppointmentCard key={appointment.id} appointment={appointment} />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div className="space-y-6">
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search appointments..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                />
                            </div>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="all">All Priorities</option>
                                <option value="high">High Priority</option>
                                <option value="medium">Medium Priority</option>
                                <option value="low">Low Priority</option>
                            </select>
                        </div>

                        {/* Appointments List */}
                        <div className="grid gap-6">
                            {filteredAppointments.map((appointment) => (
                                <AppointmentCard key={appointment.id} appointment={appointment} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Health Records Tab */}
                {activeTab === 'health-records' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Health Records</h2>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Plus className="h-5 w-5 mr-2" />
                                Add Record
                            </button>
                        </div>

                        <div className="grid gap-6">
                            {healthRecords.map((record) => (
                                <HealthRecordCard key={record.id} record={record} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Render modal */}
                <AddHealthRecord
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSaveRecord}
                />
            </main>
        </div>
    );
};

export default VetDashboard;