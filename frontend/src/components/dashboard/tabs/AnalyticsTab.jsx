import { PieChart } from 'lucide-react';

export default function AnalyticsTab({ livestockData }) {
    return (
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
    );
}