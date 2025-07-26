
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    LineChart as LineChartIcon,
    Heart,
    Target,
    Globe,
    Info
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
    const [isLoading, setIsLoading] = useState(false);

    // Mock data - replace with actual API calls
    const [dashboardStats, setDashboardStats] = useState({
        totalFarmers: 245,
        totalVets: 18,
        activeAnimals: 3420,
        totalRevenue: 125000,
        newRegistrations: 12,
        activeAppointments: 34,
        completedVisits: 156,
        pendingApprovals: 8,
        totalBreeds: 45 // Added for breed management
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

    // FIX: Add the missing categories state
    const [categories, setCategories] = useState([]);
    const [breeds, setBreeds] = useState([]); // NEW: State for breeds

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        icon: '',
        color: '#3B82F6', // Default color
        isActive: true,
        sortOrder: 0
    });

    const handleCategoryFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCategoryForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCategorySubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(categoryForm)
            });

            if (response.ok) {
                const newCategory = await response.json();
                setCategories(prev => [...prev, newCategory]);
                // Reset form
                setCategoryForm({
                    name: '',
                    description: '',
                    icon: '',
                    color: '#3B82F6',
                    isActive: true,
                    sortOrder: 0
                });
                setShowModal(false);
                alert('Category added successfully!');
            } else {
                throw new Error('Failed to add category');
            }
        } catch (error) {
            console.error('Error adding category:', error);
            alert('Failed to add category. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const fetchBreeds = async () => {
            const token = localStorage.getItem('token');

            try {
                const response = await fetch('http://localhost:8080/api/breeds', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });


                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched breeds:", data); // 👈 check this
                    setBreeds(data.data); // assuming your ApiResponse wraps in `.data`
                } else {
                    console.error("Error fetching breeds:", response.status);
                }
            } catch (error) {
                console.error("Error fetching breeds:", error);
            }
        };
        fetchBreeds();
    }, []); // Empty dependency array means this runs once on component mount




    // IMPROVED: Enhanced useEffect for fetching categories with better error handling
    useEffect(() => {
        const fetchCategories = async () => {
            const token = localStorage.getItem('token');

            // Check if token exists
            if (!token) {
                console.error('No authentication token found');
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:8080/api/categories', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Categories fetched successfully:', data);
                    setCategories(data);

                    // Update dashboard stats with actual category count
                    setDashboardStats(prev => ({
                        ...prev,
                        totalBreeds: data.length
                    }));
                } else {
                    // Handle different HTTP error codes
                    if (response.status === 401) {
                        console.error('Authentication failed. Please log in again.');
                        // Optionally redirect to login page
                    } else if (response.status === 403) {
                        console.error('Access forbidden. You do not have permission to view categories.');
                    } else {
                        console.error('Failed to fetch categories:', response.status, response.statusText);
                    }
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // You might want to show a user-friendly error message here
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []); // Empty dependency array means this runs once on component mount

    // NEW: Form state for breed addition
    const [breedForm, setBreedForm] = useState({
        name: '',
        categoryName: '',
        originCountry: '',
        primaryPurpose: '',
        averageLifespanYears: '',
        averageLitterSize: '',
        averageWeightFemaleKg: '',
        averageWeightMaleKg: '',
        gestationPeriodDays: '',
        maturityAgeMonths: '',
        characteristics: '',
        description: '',
        isActive: true
    });

    const handleBreedFormChange = (e) => {
        const { name, value, type, checked } = e.target;

        setBreedForm((prev) => ({
            ...prev,
            [name]: type === 'checkbox'
                ? checked
                : ['average_lifespan_years', 'average_weight_female_kg', 'average_weight_male_kg', 'gestation_period_days', 'average_litter_size', 'maturity_age_months'].includes(name)
                    ? parseFloat(value) || null
                    : value
        }));
    };


    // NEW: Handle breed form submission
    const handleBreedSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/breeds', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(breedForm)
            });

            if (response.ok) {
                const newBreed = await response.json();
                setBreeds(prev => [...prev, newBreed]);
                // Reset form
                setBreedForm({
                    name: '',
                    categoryName: '',
                    originCountry: '',
                    primaryPurpose: '',
                    averageLifespanYears: '',
                    averageLitterSize: '',
                    averageWeightFemaleKg: '',
                    averageWeightMaleKg: '',
                    gestationPeriodDays: '',
                    maturityAgeMonths: '',
                    characteristics: '',
                    description: '',
                    isActive: true
                });

                setShowModal(false);
                alert('Breed added successfully!');
            } else {
                throw new Error('Failed to add breed');
            }
        } catch (error) {
            console.error('Error adding breed:', error);
            alert('Failed to add breed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

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

    // NEW: Function to refresh categories (useful for manual refresh)
    const refreshCategories = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('No authentication token found');
            return;
        }

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:8080/api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setCategories(data);
                console.log('Categories refreshed successfully');
            } else {
                console.error('Failed to refresh categories:', response.status);
            }
        } catch (error) {
            console.error('Error refreshing categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
    );const CategoryCard = ({ category, onEdit, onDelete, onView }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: category.color || '#3B82F6' }}
                    >
                        <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-600">Order: {category.sortOrder}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                {category.isActive ? 'Active' : 'Inactive'}
            </span>
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={() => onView(category)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </button>
                <button
                    onClick={() => onEdit(category)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(category)}
                    className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );

    // NEW: Breed Card Component
    const BreedCard = ({ breed, onEdit, onDelete, onView }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{breed.name}</h3>
                        <p className="text-sm text-gray-600">{breed.breedId}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        breed.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {breed.isActive ? 'Active' : 'Inactive'}
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
                    <p className="text-gray-600">Category</p>
                    <p className="font-medium">{breed.categoryName}</p>
                </div>
                <div>
                    <p className="text-gray-600">Origin</p>
                    <p className="font-medium">{breed.originCountry}</p>
                </div>
                <div>
                    <p className="text-gray-600">Primary Purpose</p>
                    <p className="font-medium">{breed.primaryPurpose}</p>
                </div>
                <div>
                    <p className="text-gray-600">Lifespan</p>
                    <p className="font-medium">{breed.averageLifespanYears} years</p>
                </div>
                <div>
                    <p className="text-gray-600">Female Weight</p>
                    <p className="font-medium">{breed.averageWeightFemaleKg} kg</p>
                </div>
                <div>
                    <p className="text-gray-600">Male Weight</p>
                    <p className="font-medium">{breed.averageWeightMaleKg} kg</p>
                </div>
            </div>

            <div className="mb-4">
                <p className="text-gray-600 text-sm mb-1">Characteristics</p>
                <p className="text-sm text-gray-800 line-clamp-2">{breed.characteristics}</p>
            </div>

            <div className="flex space-x-2">
                <button
                    onClick={() => onView(breed)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </button>
                <button
                    onClick={() => onEdit(breed)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(breed)}
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

    // NEW: Breed management functions
    const handleBreedAction = (action, breed) => {
        console.log(`${action} breed:`, breed);
        // Implement actual breed management actions
    };

    // const handleBreedFormChange = (e) => {
    //     const { name, value, type, checked } = e.target;
    //     setBreedForm(prev => ({
    //         ...prev,
    //         [name]: type === 'checkbox' ? checked : value
    //     }));
    // };

    // const handleBreedSubmit = async (e) => {
    //     e.preventDefault();
    //     setIsLoading(true);
    //
    //     const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    //
    //     try {
    //         const response = await fetch('http://localhost:8080/api/breeds', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify(breedForm)
    //         });
    //
    //
    //         if (response.ok) {
    //             const newBreed = await response.json();
    //             // Add the new breed to the local state
    //             setBreeds(prev => [...prev, newBreed]);
    //             // Reset form
    //             setBreedForm({
    //                 name: '',
    //                 category_id: '',
    //                 origin_country: '',
    //                 primary_purpose: '',
    //                 average_lifespan_years: '',
    //                 average_litter_size: '',
    //                 average_weight_female_kg: '',
    //                 average_weight_male_kg: '',
    //                 gestation_period_days: '',
    //                 maturity_age_months: '',
    //                 characteristics: '',
    //                 description: '',
    //                 is_active: true
    //             });
    //             setShowModal(false);
    //             // Show success message
    //             alert('Breed added successfully!');
    //         } else {
    //             throw new Error('Failed to add breed');
    //         }
    //     } catch (error) {
    //         console.error('Error adding breed:', error);
    //         alert('Failed to add breed. Please try again.');
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType('');
        // Reset breed form when closing
        if (modalType === 'add-breed') {
            setBreedForm({
                name: '',
                categoryName: '',
                originCountry: '',
                primaryPurpose: '',
                averageLifespanYears: '',
                averageLitterSize: '',
                averageWeightFemaleKg: '',
                averageWeightMaleKg: '',
                gestationPeriodDays: '',
                maturityAgeMonths: '',
                characteristics: '',
                description: '',
                isActive: true
            });
        }

    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                            <p className="text-gray-600">Manage users, breeds, and monitor system performance</p>
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
                        icon={Activity}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
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
                    {/* NEW: Total Breeds Stat Card */}
                    <StatCard
                        title="Total Breeds"
                        value={dashboardStats.totalBreeds}
                        icon={Heart}
                        color="#EC4899"
                        subtitle="In database"
                    />
                </div>

                {/* Navigation Tabs - UPDATED to include breeds */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8 px-6">
                            {[
                                { id: 'overview', label: 'Overview', icon: BarChart3 },
                                { id: 'farmers', label: 'Farmers', icon: Users },
                                { id: 'veterinarians', label: 'Veterinarians', icon: Stethoscope },
                                { id: 'breeds', label: 'Breeds', icon: Heart },
                                {id: 'categories', label: 'categories', icon: Building },// NEW TAB
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

                        {/* Revenue Trend */}
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={systemMetrics.revenue}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`KSh ${value.toLocaleString()}`, 'Revenue']} />
                                    <Bar dataKey="amount" fill="#3B82F6" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Farmers Management */}
                {activeTab === 'farmers' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Farmers Management</h3>
                                <button
                                    onClick={() => openModal('add-farmer')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Farmer
                                </button>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search farmers..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Farmers Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {farmers.map((farmer) => (
                                    <UserCard
                                        key={farmer.id}
                                        user={farmer}
                                        type="farmer"
                                        onEdit={(user) => handleUserAction('edit', user)}
                                        onDelete={(user) => handleUserAction('delete', user)}
                                        onView={(user) => handleUserAction('view', user)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Veterinarians Management */}
                {activeTab === 'veterinarians' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Veterinarians Management</h3>
                                <button
                                    onClick={() => openModal('add-vet')}
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Veterinarian
                                </button>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search veterinarians..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Veterinarians Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {veterinarians.map((vet) => (
                                    <UserCard
                                        key={vet.id}
                                        user={vet}
                                        type="vet"
                                        onEdit={(user) => handleUserAction('edit', user)}
                                        onDelete={(user) => handleUserAction('delete', user)}
                                        onView={(user) => handleUserAction('view', user)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* NEW: Breeds Management Tab */}
                {activeTab === 'breeds' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Breeds Management</h3>
                                <button
                                    onClick={() => openModal('add-breed')}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Breed
                                </button>
                            </div>

                            {/* Search and Filter */}
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <input
                                        type="text"
                                        placeholder="Search breeds..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Breeds Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {breeds.map((breed) => (
                                    <BreedCard
                                        key={breed.breed_id}
                                        breed={breed}
                                        onEdit={(breed) => handleBreedAction('edit', breed)}
                                        onDelete={(breed) => handleBreedAction('delete', breed)}
                                        onView={(breed) => handleBreedAction('view', breed)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {/* Categories Management Tab */}
                {activeTab === 'categories' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Categories Management</h3>
                                <button
                                    onClick={() => openModal('add-category')}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Category
                                </button>
                            </div>

                            {/* Categories Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onEdit={(cat) => handleCategoryAction('edit', cat)}
                                        onDelete={(cat) => handleCategoryAction('delete', cat)}
                                        onView={(cat) => handleCategoryAction('view', cat)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">System Analytics</h3>
                            <p className="text-gray-600">Advanced analytics and reporting features coming soon...</p>
                        </div>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-lg font-semibold mb-4">System Settings</h3>
                            <p className="text-gray-600">Configuration and system settings coming soon...</p>
                        </div>
                    </div>
                )}
            </div>




            {/*add breed form modal*/}
            {showModal && modalType === 'add-breed' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleBreedSubmit} className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Add New Breed</h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Breed Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Breed Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={breedForm.name}
                                            onChange={handleBreedFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category *
                                        </label>
                                        <select
                                            name="categoryName"
                                            value={breedForm.categoryName }
                                            onChange={handleBreedFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map((category) => (
                                                <option key={category.name} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>

                                    {/* Origin Country */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Origin Country *
                                        </label>
                                        <input
                                            type="text"
                                            name="originCountry"
                                            value={breedForm.originCountry}
                                            onChange={handleBreedFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Primary Purpose */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Primary Purpose *
                                        </label>
                                        <input
                                            type="text"
                                            name="primaryPurpose"
                                            value={breedForm.primaryPurpose}
                                            onChange={handleBreedFormChange}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Lifespan */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Average Lifespan (Years) *
                                        </label>
                                        <input
                                            type="number"
                                            name="averageLifespanYears"
                                            value={breedForm.averageLifespanYears}
                                            onChange={handleBreedFormChange}
                                            required
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Litter Size */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Average Litter Size
                                        </label>
                                        <input
                                            type="number"
                                            name="averageLitterSize"
                                            value={breedForm.averageLitterSize}
                                            onChange={handleBreedFormChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Female Weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Female Weight (kg) *
                                        </label>
                                        <input
                                            type="number"
                                            name="averageWeightFemaleKg"
                                            value={breedForm.averageWeightFemaleKg}
                                            onChange={handleBreedFormChange}
                                            required
                                            min="0"
                                            step="0.1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Male Weight */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Male Weight (kg) *
                                        </label>
                                        <input
                                            type="number"
                                            name="averageWeightMaleKg"
                                            value={breedForm.averageWeightMaleKg}
                                            onChange={handleBreedFormChange}
                                            required
                                            min="0"
                                            step="0.1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Gestation Period */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gestation Period (Days)
                                        </label>
                                        <input
                                            type="number"
                                            name="gestationPeriodDays"
                                            value={breedForm.gestationPeriodDays}
                                            onChange={handleBreedFormChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Maturity Age */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Maturity Age (Months)
                                        </label>
                                        <input
                                            type="number"
                                            name="maturityAgeMonths"
                                            value={breedForm.maturityAgeMonths}
                                            onChange={handleBreedFormChange}
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Characteristics */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Characteristics *
                                    </label>
                                    <textarea
                                        name="characteristics"
                                        value={breedForm.characteristics}
                                        onChange={handleBreedFormChange}
                                        required
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={breedForm.description}
                                        onChange={handleBreedFormChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                {/* Is Active */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={breedForm.isActive}
                                        onChange={handleBreedFormChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Adding...' : 'Add Breed'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {showModal && modalType === 'add-category' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Add New Category</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={categoryForm.name}
                                        onChange={handleCategoryFormChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={categoryForm.description}
                                        onChange={handleCategoryFormChange}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Icon
                                    </label>
                                    <input
                                        type="text"
                                        name="icon"
                                        value={categoryForm.icon}
                                        onChange={handleCategoryFormChange}
                                        placeholder="e.g., cattle, poultry, goat"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Color
                                    </label>
                                    <input
                                        type="color"
                                        name="color"
                                        value={categoryForm.color}
                                        onChange={handleCategoryFormChange}
                                        className="w-full h-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sort Order
                                    </label>
                                    <input
                                        type="number"
                                        name="sortOrder"
                                        value={categoryForm.sortOrder}
                                        onChange={handleCategoryFormChange}
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={categoryForm.isActive}
                                        onChange={handleCategoryFormChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label className="ml-2 block text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>

                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCategorySubmit}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    >
                                        {isLoading ? 'Adding...' : 'Add Category'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Other Modals (Add Farmer, Add Vet, etc.) */}
            {showModal && modalType === 'add-farmer' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Add New Farmer</h3>
                            <p className="text-gray-600">Farmer registration form coming soon...</p>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showModal && modalType === 'add-vet' && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Add New Veterinarian</h3>
                            <p className="text-gray-600">Veterinarian registration form coming soon...</p>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;