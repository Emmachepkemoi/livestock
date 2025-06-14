// src/components/dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { User, LogOut, BarChart3, Users, Calendar, Bell, Settings, Shield, Eye, EyeOff } from 'lucide-react';

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    healthAlerts: true,
    feedingReminders: true
  });
  const [showPassword, setShowPassword] = useState(false);

  // Add null check for user
  if (!user) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const stats = [
    { label: 'Total Livestock', value: '1,234', icon: Users, color: 'bg-blue-500' },
    { label: 'Health Alerts', value: '23', icon: Bell, color: 'bg-red-500' },
    { label: 'Feeding Schedule', value: '12', icon: Calendar, color: 'bg-green-500' },
    { label: 'Performance', value: '89%', icon: BarChart3, color: 'bg-purple-500' }
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
                      {[
                        { action: 'Health check completed', animal: 'Cow #1234', time: '2 hours ago' },
                        { action: 'Feeding scheduled', animal: 'Herd A', time: '4 hours ago' },
                        { action: 'Vaccination reminder', animal: 'Sheep #567', time: '1 day ago' }
                      ].map((activity, index) => (
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
                            <p className="text-sm text-gray-500">Critical health notifications</p>
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
                            <p className="text-sm text-gray-500">Scheduled feeding notifications</p>
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

                    {/* Security Settings */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Shield className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Security Settings</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                          <div className="space-y-3">
                            <div className="relative">
                              <input
                                  type={showPassword ? 'text' : 'password'}
                                  placeholder="Current password"
                                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              />
                              <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <input
                                type="password"
                                placeholder="New password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                              Update Password
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* App Settings */}
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <div className="flex items-center mb-4">
                        <Settings className="w-5 h-5 text-gray-600 mr-2" />
                        <h4 className="text-md font-semibold text-gray-800">Application Settings</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                            <option value="PST">PST (Pacific Standard Time)</option>
                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                            <option value="light">Light Mode</option>
                            <option value="dark">Dark Mode</option>
                            <option value="auto">Auto (System)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Save Settings Button */}
                    <div className="flex justify-end">
                      <button className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium">
                        Save All Settings
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}

export default Dashboard;