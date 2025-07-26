import React, { useState, useEffect } from 'react';
import {
  User, LogOut, BarChart3, Users, Calendar, Bell,
  Settings, Shield, Eye, EyeOff, Plus, TrendingUp,
  Activity, PieChart, Filter, Search, X
} from 'lucide-react';
import AddAnimalModal from '../components/AddAnimalModal.jsx';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    healthAlerts: true,
    feedingReminders: true
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAddAnimalModal, setShowAddAnimalModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Loading states
  const [loading, setLoading] = useState({
    categories: false,
    breeds: false,
    animals: false,
    analytics: false
  });

  // Error states
  const [error, setError] = useState({
    categories: null,
    breeds: null,
    animals: null,
    analytics: null
  });

  const [livestockData, setLivestockData] = useState({
    animals: [],
    categories: [],
    breeds: [],
    analytics: {
      totalAnimals: 0,
      totalValue: 0,
      healthyAnimals: 0,
      sickAnimals: 0,
      categoryBreakdown: [],
      recentActivities: []
    }
  });

  // API configuration
  const API_BASE_URL = 'http://localhost:8080/api';
  const RETRY_ATTEMPTS = 3;
  const RETRY_DELAY = 1000; // 1 second

  useEffect(() => {
    initializeData();
  }, []);

  // Initialize all data on component mount
  const initializeData = async () => {
    await Promise.all([
      fetchCategories(),
      fetchBreeds(),
      fetchLivestockData()
    ]);
  };

  // Get authentication headers
  const getAuthHeaders = () => {
    const token = user?.accessToken || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  };

  // Retry utility function
  const withRetry = async (apiCall, retries = RETRY_ATTEMPTS) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        console.warn(`API call attempt ${attempt} failed:`, error.message);

        if (attempt === retries) {
          throw error; // Re-throw on final attempt
        }

        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  };

  // Enhanced API call handler with better error handling
  const apiCall = async (endpoint, options = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options
    });

    // Handle different HTTP status codes
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');

      switch (response.status) {
        case 401:
          console.warn('Unauthorized access - redirecting to login');
          onLogout();
          throw new Error('Unauthorized access');
        case 403:
          throw new Error('Access forbidden');
        case 404:
          throw new Error('Resource not found');
        case 500:
          throw new Error('Server error');
        default:
          throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    return response.text();
  };

  // Set loading state helper
  const setLoadingState = (key, isLoading) => {
    setLoading(prev => ({ ...prev, [key]: isLoading }));
  };

  // Set error state helper
  const setErrorState = (key, errorMessage) => {
    setError(prev => ({ ...prev, [key]: errorMessage }));
  };

  // Fetch categories from database
  const fetchCategories = async () => {
    setLoadingState('categories', true);
    setErrorState('categories', null);

    try {
      const data = await withRetry(() => apiCall('/categories'));

      // Validate and process categories data
      const categories = Array.isArray(data) ? data : (data?.data || []);

      // Ensure each category has required fields
      const processedCategories = categories.map(category => ({
        categoryId: category.categoryId || category.id,
        name: category.name || 'Unknown Category',
        color: category.color || '#6B7280', // Default gray color
        description: category.description || '',
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }));

      setLivestockData(prev => ({ ...prev, categories: processedCategories }));
      console.log(`Successfully loaded ${processedCategories.length} categories`);

    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setErrorState('categories', err.message);

      // Set empty array instead of fallback data
      setLivestockData(prev => ({ ...prev, categories: [] }));
    } finally {
      setLoadingState('categories', false);
    }
  };

  // Fetch breeds from database
  const fetchBreeds = async () => {
    setLoadingState('breeds', true);
    setErrorState('breeds', null);

    try {
      const data = await withRetry(() => apiCall('/breeds'));

      // Validate and process breeds data
      const breeds = Array.isArray(data) ? data : (data?.data || []);

      const processedBreeds = breeds.map(breed => ({
        breedId: breed.breedId || breed.id,
        name: breed.name || 'Unknown Breed',
        categoryId: breed.categoryId || breed.category_id,
        description: breed.description || '',
        createdAt: breed.createdAt,
        updatedAt: breed.updatedAt
      }));

      setLivestockData(prev => ({ ...prev, breeds: processedBreeds }));
      console.log(`Successfully loaded ${processedBreeds.length} breeds`);

    } catch (err) {
      console.error('Failed to fetch breeds:', err);
      setErrorState('breeds', err.message);

      setLivestockData(prev => ({ ...prev, breeds: [] }));
    } finally {
      setLoadingState('breeds', false);
    }
  };

  // Fetch livestock data from database
  const fetchLivestockData = async () => {
    setLoadingState('animals', true);
    setErrorState('animals', null);

    try {
      const data = await withRetry(() => apiCall('/livestock'));

      // Handle different response structures
      const animals = Array.isArray(data) ? data : (data?.data || data?.content || []);

      // Process and validate animal data
      const processedAnimals = animals.map(animal => ({
        livestockId: animal.livestockId || animal.id,
        tagNumber: animal.tagNumber || `ANIMAL-${animal.livestockId || animal.id}`,
        name: animal.name || 'Unnamed',
        category: {
          categoryId: animal.category?.categoryId || animal.categoryId,
          name: animal.category?.name || animal.categoryName || 'Unknown Category'
        },
        breed: {
          breedId: animal.breed?.breedId || animal.breedId,
          name: animal.breed?.name || animal.breedName || 'Unknown Breed'
        },
        gender: animal.gender || 'UNKNOWN',
        healthStatus: animal.healthStatus || 'UNKNOWN',
        weightKg: animal.weightKg || animal.weight || 0,
        currentValue: animal.currentValue || animal.acquisitionCost || 0,
        acquisitionDate: animal.acquisitionDate,
        acquisitionCost: animal.acquisitionCost || 0,
        dateOfBirth: animal.dateOfBirth,
        estimatedAgeMonths: animal.estimatedAgeMonths || 0,
        color: animal.color || '',
        locationOnFarm: animal.locationOnFarm || '',
        notes: animal.notes || '',
        images: animal.images || [],
        microchipNumber: animal.microchipNumber || '',
        insurancePolicyNumber: animal.insurancePolicyNumber || '',
        insuranceValue: animal.insuranceValue || 0,
        isForSale: animal.isForSale || false,
        salePrice: animal.salePrice || 0,
        motherId: animal.motherId,
        fatherId: animal.fatherId,
        identificationMarks: animal.identificationMarks || '',
        createdAt: animal.createdAt,
        updatedAt: animal.updatedAt
      }));

      setLivestockData(prev => ({ ...prev, animals: processedAnimals }));
      console.log(`Successfully loaded ${processedAnimals.length} animals`);

      // After loading animals, calculate analytics
      await calculateAnalytics(processedAnimals);

    } catch (err) {
      console.error('Failed to fetch livestock data:', err);
      setErrorState('animals', err.message);

      setLivestockData(prev => ({ ...prev, animals: [] }));
    } finally {
      setLoadingState('animals', false);
    }
  };

  // Calculate analytics from actual data instead of separate API call
  const calculateAnalytics = async (animals = null) => {
    setLoadingState('analytics', true);
    setErrorState('analytics', null);

    try {
      const animalData = animals || livestockData.animals;

      // Calculate basic statistics
      const totalAnimals = animalData.length;
      const totalValue = animalData.reduce((sum, animal) => sum + (animal.currentValue || 0), 0);
      const healthyAnimals = animalData.filter(animal =>
          animal.healthStatus === 'HEALTHY' || animal.healthStatus === 'healthy'
      ).length;
      const sickAnimals = animalData.filter(animal =>
          animal.healthStatus === 'SICK' || animal.healthStatus === 'sick'
      ).length;

      // Calculate category breakdown
      const categoryMap = new Map();
      animalData.forEach(animal => {
        const categoryName = animal.category?.name || 'Unknown';
        const existing = categoryMap.get(categoryName) || { category: categoryName, count: 0, value: 0 };
        existing.count += 1;
        existing.value += animal.currentValue || 0;
        categoryMap.set(categoryName, existing);
      });

      const categoryBreakdown = Array.from(categoryMap.values());

      // Generate recent activities (you might want to fetch these from a separate endpoint)
      const recentActivities = animalData
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 5)
          .map(animal => ({
            action: 'Animal registered',
            animal: `${animal.tagNumber} - ${animal.name}`,
            time: formatRelativeTime(animal.createdAt)
          }));

      const analytics = {
        totalAnimals,
        totalValue,
        healthyAnimals,
        sickAnimals,
        categoryBreakdown,
        recentActivities
      };

      setLivestockData(prev => ({ ...prev, analytics }));
      console.log('Analytics calculated successfully');

    } catch (err) {
      console.error('Failed to calculate analytics:', err);
      setErrorState('analytics', err.message);
    } finally {
      setLoadingState('analytics', false);
    }
  };

  // Alternative: Fetch analytics from dedicated endpoint (if available)
  const fetchAnalyticsFromAPI = async () => {
    setLoadingState('analytics', true);
    setErrorState('analytics', null);

    try {
      const data = await withRetry(() => apiCall('/livestock/analytics'));
      const analytics = data?.data || data || {};

      setLivestockData(prev => ({
        ...prev,
        analytics: {
          totalAnimals: analytics.totalAnimals || 0,
          totalValue: analytics.totalValue || 0,
          healthyAnimals: analytics.healthyAnimals || 0,
          sickAnimals: analytics.sickAnimals || 0,
          categoryBreakdown: analytics.categoryBreakdown || [],
          recentActivities: analytics.recentActivities || []
        }
      }));

    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setErrorState('analytics', err.message);

      // Fall back to calculated analytics
      await calculateAnalytics();
    } finally {
      setLoadingState('analytics', false);
    }
  };

  // Refresh all data
  const refreshData = async () => {
    console.log('Refreshing all data...');
    await initializeData();
  };

  // Format relative time utility
  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'Unknown time';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    } catch {
      return 'Unknown time';
    }
  };

  // Format date utility
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Handle notification changes
  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle animal added successfully
  const handleAnimalAdded = async () => {
    setShowAddAnimalModal(false);
    console.log('Animal added successfully, refreshing data...');
    await fetchLivestockData(); // Refresh animals and analytics
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      await apiCall('/user/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      alert('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      alert(`Failed to update password: ${error.message}`);
    }
  };

  // Filter animals based on category and search
  const filteredAnimals = livestockData.animals.filter(animal => {
    const matchesCategory = selectedCategory === 'all' ||
        animal.category?.name === selectedCategory;
    const matchesSearch = searchTerm === '' ||
        animal.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        animal.tagNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Statistics for dashboard cards
  const stats = [
    {
      label: 'Total Livestock',
      value: livestockData.analytics.totalAnimals?.toString() || '0',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      label: 'Total Value',
      value: `$${(livestockData.analytics.totalValue || 0).toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      label: 'Healthy Animals',
      value: livestockData.analytics.healthyAnimals?.toString() || '0',
      icon: Activity,
      color: 'bg-emerald-500'
    },
    {
      label: 'Health Alerts',
      value: livestockData.analytics.sickAnimals?.toString() || '0',
      icon: Bell,
      color: 'bg-red-500'
    }
  ];

  // Safe user data access with fallbacks
  const userInitials = user.firstName
      ? user.firstName[0] + (user.lastName?.[0] || '')
      : (user.username?.[0]?.toUpperCase() || 'U');

  const displayName = user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : (user.username || 'User');

  const welcomeName = user.firstName || user.username || 'User';
  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800">FarmTech Livestock</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {userInitials}
                  </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                  {displayName}
                </span>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Welcome back, {welcomeName}!
            </h2>
            <p className="text-gray-600">
              Here's what's happening with your livestock today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border">
            <div className="border-b">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'livestock', label: 'Livestock Management' },
                  { id: 'analytics', label: 'Analytics' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'settings', label: 'Settings' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                                ? 'border-green-500 text-green-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                    <div className="space-y-4">
                      {livestockData.analytics.recentActivities.map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{activity.action}</p>
                              <p className="text-sm text-gray-600">{activity.animal}</p>
                            </div>
                            <span className="text-sm text-gray-500">{activity.time}</span>
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {activeTab === 'livestock' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">Livestock Management</h3>
                      <button
                          onClick={() => setShowAddAnimalModal(true)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Animal</span>
                      </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                      <div className="flex items-center space-x-2">
                        <Filter className="w-4 h-4 text-gray-500" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="all">All Categories</option>
                          {livestockData.categories.map((category) => (
                              <option key={category.categoryId} value={category.name}>
                                {category.name}
                              </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center space-x-2 flex-1">
                        <Search className="w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search by name or tag number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Animals Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredAnimals.map((animal) => (
                          <div key={animal.livestockId} className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-gray-800">{animal.name || animal.tagNumber}</h4>
                                  <p className="text-sm text-gray-500">Tag: {animal.tagNumber}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    animal.healthStatus === 'HEALTHY'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                  {animal.healthStatus}
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Category:</span>
                                  <span className="font-medium">{animal.category.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Breed:</span>
                                  <span className="font-medium">{animal.breed.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Gender:</span>
                                  <span className="font-medium">{animal.gender}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Weight:</span>
                                  <span className="font-medium">{animal.weightKg} kg</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Value:</span>
                                  <span className="font-medium">${animal.currentValue?.toLocaleString()}</span>
                                </div>
                              </div>
                              <div className="mt-4 flex space-x-2">
                                <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm hover:bg-blue-600 transition-colors">
                                  View Details
                                </button>
                                <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                                  Edit
                                </button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>

                    {filteredAnimals.length === 0 && (
                        <div className="text-center py-12">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No animals found matching your criteria.</p>
                        </div>
                    )}
                  </div>
              )}

              {activeTab === 'analytics' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Analytics Dashboard</h3>

                    {/* Category Breakdown */}
                    <div className="bg-white border rounded-lg p-6">
                      <div className="flex items-center mb-4">
                        <PieChart className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Livestock by Category</h4>
                      </div>
                      <div className="space-y-4">
                        {livestockData.analytics.categoryBreakdown.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: livestockData.categories.find(c => c.name === item.category)?.color || '#6B7280' }}
                                ></div>
                                <span className="text-gray-700">{item.category}</span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-800">{item.count} animals</div>
                                <div className="text-sm text-gray-500">${item.value?.toLocaleString()}</div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Average Animal Value</h4>
                        <p className="text-2xl font-bold text-gray-800">
                          ${livestockData.analytics.totalAnimals > 0
                            ? Math.round(livestockData.analytics.totalValue / livestockData.analytics.totalAnimals).toLocaleString()
                            : '0'
                        }
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Health Rate</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {livestockData.analytics.totalAnimals > 0
                              ? Math.round((livestockData.analytics.healthyAnimals / livestockData.analytics.totalAnimals) * 100)
                              : 0
                          }%
                        </p>
                      </div>
                      <div className="bg-white border rounded-lg p-6">
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Categories</h4>
                        <p className="text-2xl font-bold text-gray-800">{livestockData.categories.length}</p>
                      </div>
                    </div>
                  </div>
              )}

              {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.username || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.email || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.phoneNumber || 'Not provided'}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.firstName || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{user.lastName || 'Not provided'}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                    </div>

                    {user.lastLoginDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Last Login</label>
                          <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{formatDate(user.lastLoginDate)}</p>
                        </div>
                    )}
                  </div>
              )}

              {activeTab === 'settings' && (
                  <div className="space-y-8">
                    <h3 className="text-lg font-semibold text-gray-800">Account Settings</h3>

                    {/* Notification Settings */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Bell className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Notification Preferences</h4>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates via email</p>
                          </div>
                          <button
                              onClick={() => handleNotificationChange('email')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  notifications.email ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                          >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.email ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive alerts via text message</p>
                          </div>
                          <button
                              onClick={() => handleNotificationChange('sms')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  notifications.sms ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                          >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                notifications.sms ? 'translate-x-6' : 'translate-x-1'
                            }`}
                        />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Health Alerts</p>
                            <p className="text-sm text-gray-500">Get notified about animal health issues</p>
                          </div>
                          <button
                              onClick={() => handleNotificationChange('healthAlerts')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  notifications.healthAlerts ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                          >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    notifications.healthAlerts ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-700">Feeding Reminders</p>
                            <p className="text-sm text-gray-500">Get reminders for feeding schedules</p>
                          </div>
                          <button
                              onClick={() => handleNotificationChange('feedingReminders')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  notifications.feedingReminders ? 'bg-green-500' : 'bg-gray-200'
                              }`}
                          >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    notifications.feedingReminders ? 'translate-x-6' : 'translate-x-1'
                                }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Password Change */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Shield className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Change Password</h4>
                      </div>
                      <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData(prev => ({
                                  ...prev,
                                  currentPassword: e.target.value
                                }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData(prev => ({
                                ...prev,
                                newPassword: e.target.value
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <input
                              type={showPassword ? 'text' : 'password'}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData(prev => ({
                                ...prev,
                                confirmPassword: e.target.value
                              }))}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              required
                          />
                        </div>

                        <button
                            type="submit"
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Add Animal Modal */}
        {showAddAnimalModal && (
            <AddAnimalModal
                isOpen={showAddAnimalModal}
                onClose={() => setShowAddAnimalModal(false)}
                onAnimalAdded={handleAnimalAdded}
                categories={livestockData.categories}
                breeds={livestockData.breeds}
                user={user}
            />
        )}
      </div>
  );
}

export default Dashboard;