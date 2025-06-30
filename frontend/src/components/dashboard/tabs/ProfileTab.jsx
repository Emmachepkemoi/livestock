export default function ProfileTab({ user, formatDate }) {
    return (
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
    );
}