import { User, LogOut } from 'lucide-react';

export default function Header({ user, onLogout, userInitials, displayName }) {
    return (
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
                                <span className="text-white text-sm font-medium">{userInitials}</span>
                            </div>
                            <span className="text-gray-700 font-medium">{displayName}</span>
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
}