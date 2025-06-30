import React, { useState, useEffect } from 'react';
import { User, Users, TrendingUp, Activity, Bell } from 'lucide-react';
import AddAnimalModal from '../components/AddAnimalModal';
import Header from './Header';
import StatsGrid from './StatsGrid';
import TabNavigation from './TabNavigation';
import OverviewTab from './tabs/OverviewTab';
import LivestockTab from './tabs/LivestockTab';
import AnalyticsTab from './tabs/AnalyticsTab';
import ProfileTab from './tabs/ProfileTab';
import SettingsTab from './tabs/SettingsTab';

function Dashboard({ user, onLogout }) {
    // State and logic remains the same until the return statement

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                user={user}
                onLogout={onLogout}
                userInitials={userInitials}
                displayName={displayName}
            />

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

                <StatsGrid stats={stats} />

                {/* Tabs */}
                <div className="bg-white rounded-xl shadow-sm border">
                    <div className="border-b">
                        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <OverviewTab recentActivities={livestockData.analytics.recentActivities} />
                        )}

                        {activeTab === 'livestock' && (
                            <LivestockTab
                                livestockData={livestockData}
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                setShowAddAnimalModal={setShowAddAnimalModal}
                                filteredAnimals={filteredAnimals}
                            />
                        )}

                        {activeTab === 'analytics' && (
                            <AnalyticsTab livestockData={livestockData} />
                        )}

                        {activeTab === 'profile' && (
                            <ProfileTab user={user} formatDate={formatDate} />
                        )}

                        {activeTab === 'settings' && (
                            <SettingsTab
                                notifications={notifications}
                                handleNotificationChange={handleNotificationChange}
                                handlePasswordChange={handlePasswordChange}
                            />
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