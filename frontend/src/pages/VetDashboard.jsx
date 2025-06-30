import React, { useState, useEffect } from 'react';
import {
    Activity,
    Calendar,
    Users,
    AlertTriangle,
    FileText,
    Pill,
    Thermometer,
    Heart,
    MapPin,
    Clock,
    Search,
    Filter,
    Plus,
    Bell,
    TrendingUp,
    CheckCircle,
    XCircle,
    Phone
} from 'lucide-react';

const VetDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    // Mock data - replace with actual API calls
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            farmerId: 'F001',
            farmerName: 'John Doe',
            location: 'Kiambu Farm',
            time: '09:00 AM',
            date: '2025-06-30',
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
            date: '2025-06-30',
            animalType: 'Cattle',
            animalId: 'C045',
            reason: 'Emergency - Lameness',
            status: 'urgent',
            priority: 'high',
            phone: '+254700654321'
        },
        {
            id: 3,
            farmerId: 'F003',
            farmerName: 'Peter Kamau',
            location: 'Eldoret Poultry',
            time: '02:00 PM',
            date: '2025-06-30',
            animalType: 'Poultry',
            animalId: 'P123',
            reason: 'Health Check',
            status: 'scheduled',
            priority: 'low',
            phone: '+254700987654'
        }
    ]);

    const [healthRecords, setHealthRecords] = useState([
        {
            id: 1,
            animalId: 'C001',
            animalType: 'Cattle',
            farmerName: 'John Doe',
            lastVisit: '2025-06-15',
            healthStatus: 'Healthy',
            vaccinations: ['FMD', 'Anthrax'],
            nextVaccination: '2025-09-15',
            weight: '450kg',
            temperature: '38.5°C'
        },
        {
            id: 2,
            animalId: 'C045',
            animalType: 'Cattle',
            farmerName: 'Mary Smith',
            lastVisit: '2025-06-28',
            healthStatus: 'Under Treatment',
            vaccinations: ['FMD'],
            nextVaccination: '2025-08-28',
            weight: '380kg',
            temperature: '39.2°C'
        }
    ]);

    const [treatmentPlans, setTreatmentPlans] = useState([
        {
            id: 1,
            animalId: 'C045',
            diagnosis: 'Lameness - Hoof infection',
            treatment: 'Antibiotic therapy + Hoof trimming',
            duration: '7 days',
            medication: 'Oxytetracycline 200mg',
            dosage: '2ml/day',
            startDate: '2025-06-28',
            progress: 60
        }
    ]);

    const dashboardStats = {
        totalAppointments: appointments.length,
        urgentCases: appointments.filter(a => a.priority === 'high').length,
        animalsUnderCare: healthRecords.filter(r => r.healthStatus === 'Under Treatment').length,
        completedToday: 5
    };

    const StatCard = ({ title, value, icon: Icon, color, trend }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className="text-sm text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            {trend}
                        </p>
                    )}
                </div>
                <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
                    <Icon className="h-6 w-6" style={{ color }} />
                </div>
            </div>
        </div>
    );

    const AppointmentCard = ({ appointment }) => (
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">{appointment.farmerName}</h3>
                    <p className="text-sm text-gray-600 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {appointment.location}
                    </p>
                </div>
                <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              appointment.priority === 'high' ? 'bg-red-100 text-red-800' :
                  appointment.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
          }`}>
            {appointment.priority}
          </span>
                    <button className="text-blue-600 hover:text-blue-800">
                        <Phone className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-600">Time</p>
                    <p className="font-medium flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {appointment.time}
                    </p>
                </div>
                <div>
                    <p className="text-gray-600">Animal</p>
                    <p className="font-medium">{appointment.animalType} - {appointment.animalId}</p>
                </div>
            </div>

            <div className="mt-3">
                <p className="text-gray-600 text-sm">Reason</p>
                <p className="font-medium">{appointment.reason}</p>
            </div>

            <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Start Visit
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                    Reschedule
                </button>
            </div>
        </div>
    );

    const HealthRecordCard = ({ record }) => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">{record.animalType} - {record.animalId}</h3>
                    <p className="text-sm text-gray-600">{record.farmerName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    record.healthStatus === 'Healthy' ? 'bg-green-100 text-green-800' :
                        record.healthStatus === 'Under Treatment' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                }`}>
          {record.healthStatus}
        </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                    <p className="text-gray-600">Weight</p>
                    <p className="font-medium">{record.weight}</p>
                </div>
                <div>
                    <p className="text-gray-600">Temperature</p>
                    <p className="font-medium flex items-center">
                        <Thermometer className="h-4 w-4 mr-1" />
                        {record.temperature}
                    </p>
                </div>
            </div>

            <div className="mb-3">
                <p className="text-gray-600 text-sm">Vaccinations</p>
                <div className="flex flex-wrap gap-1 mt-1">
                    {record.vaccinations.map((vaccine, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {vaccine}
            </span>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600 text-sm">Next Vaccination</p>
                    <p className="font-medium text-sm">{record.nextVaccination}</p>
                </div>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    View Full Record
                </button>
            </div>
        </div>
    );

    const TreatmentPlanCard = ({ plan }) => (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="font-semibold text-gray-900">Animal {plan.animalId}</h3>
                    <p className="text-sm text-gray-600">{plan.diagnosis}</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-gray-600">Progress</p>
                    <p className="font-bold text-blue-600">{plan.progress}%</p>
                </div>
            </div>

            <div className="mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${plan.progress}%` }}
                    ></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                    <p className="text-gray-600">Treatment</p>
                    <p className="font-medium">{plan.treatment}</p>
                </div>
                <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium">{plan.duration}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                    <p className="text-gray-600">Medication</p>
                    <p className="font-medium">{plan.medication}</p>
                </div>
                <div>
                    <p className="text-gray-600">Dosage</p>
                    <p className="font-medium">{plan.dosage}</p>
                </div>
            </div>

            <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                    Update Progress
                </button>
                <button className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Veterinarian Dashboard</h1>
                            <p className="text-gray-600">Manage livestock health and appointments</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                    <span className="text-white font-medium">Dr</span>
                                </div>
                                <span className="text-gray-700 font-medium">Dr. Sarah Johnson</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Today's Appointments"
                        value={dashboardStats.totalAppointments}
                        icon={Calendar}
                        color="#3B82F6"
                        trend="+12% from yesterday"
                    />
                    <StatCard
                        title="Urgent Cases"
                        value={dashboardStats.urgentCases}
                        icon={AlertTriangle}
                        color="#EF4444"
                    />
                    <StatCard
                        title="Animals Under Care"
                        value={dashboardStats.animalsUnderCare}
                        icon={Heart}
                        color="#F59E0B"
                    />
                    <StatCard
                        title="Completed Today"
                        value={dashboardStats.completedToday}
                        icon={CheckCircle}
                        color="#10B981"
                        trend="+8% efficiency"
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: Activity },
                                { id: 'appointments', label: 'Appointments', icon: Calendar },
                                { id: 'health-records', label: 'Health Records', icon: FileText },
                                { id: 'treatments', label: 'Treatment Plans', icon: Pill }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                                        activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <tab.icon className="h-5 w-5" />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-lg font-semibold mb-4">Today's Schedule</h2>
                                    <div className="space-y-4">
                                        {appointments.slice(0, 3).map((appointment) => (
                                            <AppointmentCard key={appointment.id} appointment={appointment} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'appointments' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">All Appointments</h2>
                                        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Appointment
                                        </button>
                                    </div>

                                    <div className="flex space-x-4 mb-4">
                                        <div className="flex-1 relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <input
                                                type="text"
                                                placeholder="Search appointments..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <select
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={selectedFilter}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                        >
                                            <option value="all">All Priorities</option>
                                            <option value="high">High Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="low">Low Priority</option>
                                        </select>
                                    </div>

                                    <div className="space-y-4">
                                        {appointments.map((appointment) => (
                                            <AppointmentCard key={appointment.id} appointment={appointment} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'health-records' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Health Records</h2>
                                        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Record
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {healthRecords.map((record) => (
                                            <HealthRecordCard key={record.id} record={record} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'treatments' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-semibold">Active Treatment Plans</h2>
                                        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center">
                                            <Plus className="h-4 w-4 mr-2" />
                                            New Treatment
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {treatmentPlans.map((plan) => (
                                            <TreatmentPlanCard key={plan.id} plan={plan} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Emergency Visit
                                </button>
                                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Schedule Appointment
                                </button>
                                <button className="w-full bg-yellow-600 text-white py-3 px-4 rounded-md hover:bg-yellow-700 transition-colors flex items-center justify-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Generate Report
                                </button>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-sm font-medium">Vaccination completed</p>
                                        <p className="text-xs text-gray-500">Cattle C001 - 2 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Pill className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-sm font-medium">Treatment started</p>
                                        <p className="text-xs text-gray-500">Cattle C045 - 4 hours ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-yellow-500" />
                                    <div>
                                        <p className="text-sm font-medium">Appointment scheduled</p>
                                        <p className="text-xs text-gray-500">Poultry P123 - 6 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Health Alerts */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Health Alerts</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-md">
                                    <AlertTriangle className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">High Temperature</p>
                                        <p className="text-xs text-red-600">Cattle C045 - 39.8°C</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-md">
                                    <Clock className="h-5 w-5 text-yellow-500" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Vaccination Due</p>
                                        <p className="text-xs text-yellow-600">5 animals this week</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VetDashboard;