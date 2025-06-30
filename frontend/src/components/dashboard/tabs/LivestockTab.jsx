import { Filter, Search, Plus } from 'lucide-react';

export default function LivestockTab({
                                         livestockData,
                                         selectedCategory,
                                         setSelectedCategory,
                                         searchTerm,
                                         setSearchTerm,
                                         setShowAddAnimalModal,
                                         filteredAnimals
                                     }) {
    return (
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
                    <AnimalCard key={animal.livestockId} animal={animal} />
                ))}
            </div>

            {filteredAnimals.length === 0 && (
                <div className="text-center py-12">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No animals found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}

function AnimalCard({ animal }) {
    return (
        <div className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow">
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
    );
}