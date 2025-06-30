export default function TabNavigation({ activeTab, setActiveTab }) {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'livestock', label: 'Livestock Management' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'profile', label: 'Profile' },
        { id: 'settings', label: 'Settings' }
    ];

    return (
        <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
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
    );
}