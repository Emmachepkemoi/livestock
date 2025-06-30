import { Bell, Shield, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function SettingsTab({ notifications, handleNotificationChange, handlePasswordChange }) {
    const [showPassword, setShowPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    return (
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

                    {/* Other notification toggles... */}
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

                    {/* Other password fields... */}
                </form>
            </div>
        </div>
    );
}