import React, { useState, useEffect } from 'react';

// Lucide icons
import {
    Users,
    UserCheck,
    BarChart3,
    Settings,
    Shield,
    MapPin,
    TrendingUp,
    AlertTriangle,
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Eye,
    Download,
    Upload,
    Bell,
    Calendar,
    Activity,
    DollarSign,
    Building,
    Stethoscope,
    FileText,
    Clock,
    CheckCircle,
    XCircle,
    UserPlus,
    Mail,
    Phone,
    MoreVertical,
    PieChart as PieChartIcon,
    LineChart as LineChartIcon
} from 'lucide-react';

// Recharts components
import {
    LineChart,
    PieChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    BarChart,
    Bar,
    Legend, Line, Pie
} from 'recharts';

// Component definition
const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');

    // Mock data - replace with actual API calls
    const [dashboardStats, setDashboardStats] = useState({
        totalFarmers: 245,
        totalVets: 18,
        activeAnimals: 3420,
        totalRevenue: 125000,
        newRegistrations: 12,
        activeAppointments: 34,
        completedVisits: 156,
        pendingApprovals: 8
    });

    const [farmers, setFarmers] = useState([
        {
            id: 'F001',
            name: 'John Doe',
            email: 'john.doe@email.com',
            phone: '+254700123456',
            location: 'Kiambu County',
            farmSize: '50 acres',
            animalCount: 120,
            registrationDate: '2024-01-15',
            status: 'active',
            lastLogin: '2025-06-29',
            subscription: 'premium'
        },
        {
            id: 'F002',
            name: 'Mary Smith',
            email: 'mary.smith@email.com',
            phone: '+254700654321',
            location: 'Nakuru County',
            farmSize: '75 acres',
            animalCount: 200,
            registrationDate: '2024-02-20',
            status: 'active',
            lastLogin: '2025-06-30',
            subscription: 'basic'
        },
        {
            id: 'F003',
            name: 'Peter Kamau',
            email: 'peter.kamau@email.com',
            phone: '+254700987654',
            location: 'Eldoret County',
            farmSize: '30 acres',
            animalCount: 80,
            registrationDate: '2024-03-10',
            status: 'pending',
            lastLogin: 'Never',
            subscription: 'basic'
        }
    ]);

    const [veterinarians, setVeterinarians] = useState([
        {
            id: 'V001',
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@vet.com',
            phone: '+254711234567',
            location: 'Nairobi County',
            specialization: 'Large Animals',
            experience: '12 years',
            registrationDate: '2023-08-15',
            status: 'active',
            lastLogin: '2025-06-30',
            completedVisits: 89,
            rating: 4.8
        },
        {
            id: 'V002',
            name: 'Dr. Michael Brown',
            email: 'michael.brown@vet.com',
            phone: '+254722345678',
            location: 'Kiambu County',
            specialization: 'Poultry',
            experience: '8 years',
            registrationDate: '2023-10-20',
            status: 'active',
            lastLogin: '2025-06-29',
            completedVisits: 67,
            rating: 4.6
        },
        {
            id: 'V003',
            name: 'Dr. Grace Wanjiku',
            email: 'grace.wanjiku@vet.com',
            phone: '+254733456789',
            location: 'Nakuru County',
            specialization: 'Small Animals',
            experience: '5 years',
            registrationDate: '2024-01-10',
            status: 'pending',
            lastLogin: 'Never',
            completedVisits: 0,
            rating: 0
        }
    ]);

    const [systemMetrics, setSystemMetrics] = useState({
        userGrowth: [
            { month: 'Jan', farmers: 180, vets: 12 },
            { month: 'Feb', farmers: 195, vets: 14 },
            { month: 'Mar', farmers: 210, vets: 15 },
            { month: 'Apr', farmers: 225, vets: 16 },
            { month: 'May', farmers: 235, vets: 17 },
            { month: 'Jun', farmers: 245, vets: 18 }
        ],
        animalDistribution: [
            { name: 'Cattle', value: 1420, color: '#8884d8' },
            { name: 'Poultry', value: 1200, color: '#82ca9d' },
            { name: 'Goats', value: 500, color: '#ffc658' },
            { name: 'Sheep', value: 300, color: '#ff7300' }
        ],
        revenue: [
            { month: 'Jan', amount: 85000 },
            { month: 'Feb', amount: 92000 },
            { month: 'Mar', amount: 98000 },
            { month: 'Apr', amount: 105000 },
            { month: 'May', amount: 118000 },
            { month: 'Jun', amount: 125000 }
        ]
    });

    const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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

    const UserCard = ({ user, type, onEdit, onDelete, onView }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.id}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              user.status === 'active' ? 'bg-green-100 text-green-800' :
                  user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
          }`}>
            {user.status}
          </span>
                    <div className="relative">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium truncate">{user.email}</p>
                </div>
                <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium">{user.location}</p>
                </div>
                <div>
                    <p className="text-gray-600">Last Login</p>
                    <p className="font-medium">{user.lastLogin}</p>
                </div>
            </div>

            {type === 'farmer' && (
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="text-gray-600">Farm Size</p>
                        <p className="font-medium">{user.farmSize}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Animals</p>
                        <p className="font-medium">{user.animalCount}</p>
                    </div>
                </div>
            )}

            {type === 'vet' && (
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                        <p className="text-gray-600">Specialization</p>
                        <p className="font-medium">{user.specialization}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Experience</p>
                        <p className="font-medium">{user.experience}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Completed Visits</p>
                        <p className="font-medium">{user.completedVisits}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Rating</p>
                        <p className="font-medium">{user.rating}/5.0</p>
                    </div>
                </div>
            )}

            <div className="flex space-x-2">
                <button
                    onClick={() => onView(user)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </button>
                <button
                    onClick={() => onEdit(user)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(user)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    const handleUserAction = (action, user) => {
        console.log(`${action} user:`, user);
        // Implement actual user management actions
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType('');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Manage users, monitor system performance</p>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 text-gray-600 hover:text-gray-900">
                                <Bell className="h-6 w-6" />
                                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-gray-700 font-medium">Admin User</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Farmers"
                        value={dashboardStats.totalFarmers}
                        icon={Users}
                        color="#3B82F6"
                        trend="+12 this month"
                    />
                    <StatCard
                        title="Total Veterinarians"
                        value={dashboardStats.totalVets}
                        icon={Stethoscope}
                        color="#10B981"
                        trend="+2 this month"
                    />
                    <StatCard
                        title="Active Animals"
                        value="3,420"
                        icon={Activity} // ✅ This works as expected
                        color="#F59E0B"
                        trend="+8.5% growth"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={`KSh ${dashboardStats.totalRevenue.toLocaleString()}`}
                        icon={DollarSign}
                        color="#EF4444"
                        trend="+15.3% vs last month"
                    />
                </div>

                {/* Additional Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="New Registrations"
                        value={dashboardStats.newRegistrations}
                        icon={UserPlus}
                        color="#8B5CF6"
                        subtitle="This week"
                    />
                    <StatCard
                        title="Active Appointments"
                        value={dashboardStats.activeAppointments}
                        icon={Calendar}
                        color="#06B6D4"
                        subtitle="Today"
                    />
                    <StatCard
                        title="Completed Visits"
                        value={dashboardStats.completedVisits}
                        icon={CheckCircle}
                        color="#84CC16"
                        subtitle="This month"
                    />
                    <StatCard
                        title="Pending Approvals"
                        value={dashboardStats.pendingApprovals}
                        icon={Clock}
                        color="#F97316"
                        subtitle="Requires action"
                    />
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'farmers', label: 'Farmers', icon: Users },
                                { id: 'veterinarians', label: 'Veterinarians', icon: Stethoscope },
                                { id: 'analytics', label: 'Analytics', icon: PieChart },
                                { id: 'settings', label: 'Settings', icon: Settings }
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
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* User Growth Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">User Growth Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={systemMetrics.userGrowth}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="farmers"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        name="Farmers"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="vets"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        name="Veterinarians"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Animal Distribution */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Animal Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={systemMetrics.animalDistribution}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {systemMetrics.animalDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Revenue Trend (KSh)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={systemMetrics.revenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Revenue']} />
                                    <Bar dataKey="amount" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {activeTab === 'farmers' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">Farmer Management</h2>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => openModal('add-farmer')}
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Farmer
                                    </button>
                                    <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search farmers..."
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
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {farmers.map((farmer) => (
                                    <UserCard
                                        key={farmer.id}
                                        user={farmer}
                                        type="farmer"
                                        onView={(user) => handleUserAction('view', user)}
                                        onEdit={(user) => handleUserAction('edit', user)}
                                        onDelete={(user) => handleUserAction('delete', user)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'veterinarians' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold">Veterinarian Management</h2>
                                <div className="flex space-x-3">
                                    <button
                                        onClick={() => openModal('add-vet')}
                                        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Veterinarian
                                    </button>
                                    <button className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center">
                                        <Download className="h-4 w-4 mr-2" />
                                        Export
                                    </button>
                                </div>
                            </div>

                            <div className="flex space-x-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search veterinarians..."
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
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {veterinarians.map((vet) => (
                                    <UserCard
                                        key={vet.id}
                                        user={vet}
                                        type="vet"
                                        onView={(user) => handleUserAction('view', user)}
                                        onEdit={(user) => handleUserAction('edit', user)}
                                        onDelete={(user) => handleUserAction('delete', user)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* System Performance */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">System Performance</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Server Uptime</span>
                                    <span className="font-semibold text-green-600">99.8%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">API Response Time</span>
                                    <span className="font-semibold">245ms</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Active Sessions</span>
                                    <span className="font-semibold">1,247</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Database Size</span>
                                    <span className="font-semibold">2.4 GB</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Locations */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">Top Locations by Users</h3>
                            <div className="space-y-3">
                                {[
                                    { location: 'Kiambu County', users: 67, percentage: 85 },
                                    { location: 'Nakuru County', users: 54, percentage: 70 },
                                    { location: 'Eldoret County', users: 43, percentage: 55 },
                                    { location: 'Nairobi County', users: 38, percentage: 50 },
                                    { location: 'Meru County', users: 29, percentage: 35 }
                                ].map((item, index) => (
                                    <div key={index} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium">{item.location}</span>
                                            <span className="text-sm text-gray-600">{item.users} users</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${item.percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Recent System Activities</h3>
                            <div className="space-y-4">
                                {[
                                    { action: 'New farmer registration', user: 'John Smith', time: '2 minutes ago', type: 'success' },
                                    { action: 'Veterinarian profile updated', user: 'Dr. Mary Johnson', time: '15 minutes ago', type: 'info' },
                                    { action: 'Payment processed', user: 'Peter Kamau', time: '1 hour ago', type: 'success' },
                                    { action: 'System backup completed', user: 'System', time: '2 hours ago', type: 'info' },
                                    { action: 'Failed login attempt', user: 'Unknown', time: '3 hours ago', type: 'warning' }
                                ].map((activity, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                        <div className={`w-3 h-3 rounded-full ${
                                            activity.type === 'success' ? 'bg-green-500' :
                                                activity.type === 'info' ? 'bg-blue-500' :
                                                    'bg-yellow-500'
                                        }`}></div>
                                        <div className="flex-1">
                                            <p className="font-medium">{activity.action}</p>
                                            <p className="text-sm text-gray-600">{activity.user} • {activity.time}</p>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <MoreVertical className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold mb-6">System Settings</h2>

                        <div className="space-y-6">
                            {/* Notification Settings */}
                            <div className="border-b pb-6">
                                <h3 className="font-medium mb-4 flex items-center">
                                    <Bell className="h-5 w-5 mr-2 text-gray-600" />
                                    Notification Settings
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'email', label: 'Email Notifications', description: 'Receive system notifications via email' },
                                        { name: 'sms', label: 'SMS Alerts', description: 'Get important alerts via text message' },
                                        { name: 'push', label: 'Push Notifications', description: 'Enable in-app notifications' }
                                    ].map((setting) => (
                                        <div key={setting.name} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{setting.label}</p>
                                                <p className="text-sm text-gray-600">{setting.description}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Preferences */}
                            <div className="border-b pb-6">
                                <h3 className="font-medium mb-4 flex items-center">
                                    <Settings className="h-5 w-5 mr-2 text-gray-600" />
                                    System Preferences
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Timezone</label>
                                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Africa/Nairobi (EAT)</option>
                                            <option>UTC</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>DD/MM/YYYY</option>
                                            <option>MM/DD/YYYY</option>
                                            <option>YYYY-MM-DD</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Backup & Restore */}
                            <div>
                                <h3 className="font-medium mb-4 flex items-center">
                                    <Shield className="h-5 w-5 mr-2 text-gray-600" />
                                    Backup & Restore
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center">
                                        <Download className="h-4 w-4 mr-2" />
                                        Backup Now
                                    </button>
                                    <button className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center">
                                        <Upload className="h-4 w-4 mr-2" />
                                        Restore
                                    </button>
                                    <button className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center">
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        Clear Cache
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modals */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">
                                    {modalType === 'add-farmer' ? 'Add New Farmer' : 'Add New Veterinarian'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                </div>

                                {modalType === 'add-vet' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                                        <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                            <option>Large Animals</option>
                                            <option>Poultry</option>
                                            <option>Small Animals</option>
                                            <option>Mixed Practice</option>
                                        </select>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Save {modalType === 'add-farmer' ? 'Farmer' : 'Veterinarian'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;