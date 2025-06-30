export default function OverviewTab({ recentActivities }) {
    return (
        <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
            <div className="space-y-4">
                {recentActivities.map((activity, index) => (
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
    );
}