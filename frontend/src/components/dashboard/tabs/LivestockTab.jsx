import { Filter, Search, Plus, Users, Heart, Calendar, MapPin, Edit3, Eye } from 'lucide-react';

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
        <div className="space-y-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Livestock Management</h3>
                    <p className="text-gray-600">Manage and monitor your farm animals</p>
                </div>
                <button
                    onClick={() => setShowAddAnimalModal(true)}
                    className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                    <Plus className="w-5 h-5" />
                    <span className="font-medium">Add Animal</span>
                </button>
            </div>

            {/* Enhanced Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                            <Filter className="w-5 h-5 text-blue-600" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm min-w-[160px]"
                        >
                            <option value="all">All Categories</option>
                            {livestockData.categories.map((category) => (
                                <option key={category.categoryId} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center space-x-3 flex-1">
                        <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-lg">
                            <Search className="w-5 h-5 text-green-600" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name, tag number, or breed..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Animals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnimals.map((animal) => (
                    <AnimalCard key={animal.livestockId} animal={animal} />
                ))}
            </div>

            {filteredAnimals.length === 0 && (
                <div className="text-center py-16">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h4 className="text-lg font-medium text-gray-800 mb-2">No animals found</h4>
                        <p className="text-gray-500">Try adjusting your search criteria or add your first animal.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function AnimalCard({ animal }) {
    // Generate a placeholder image based on animal type
    const getAnimalImage = (category) => {
        const images = {
            'Cattle': 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=250&fit=crop',
            'Sheep': 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop',
            'Goat': 'https://images.unsplash.com/photo-1551592917-6b8b4d9c0b4c?w=400&h=250&fit=crop',
            'Pig': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=250&fit=crop',
            'Chicken': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=250&fit=crop',
            'Horse': 'https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=400&h=250&fit=crop'
        };
        return images[category] || 'https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?w=400&h=250&fit=crop';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
            {/* Animal Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={getAnimalImage(animal.category.name)}
                    alt={animal.name || animal.tagNumber}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ${
                        animal.healthStatus === 'HEALTHY'
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                    }`}>
                        {animal.healthStatus}
                    </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h4 className="font-bold text-white text-lg">{animal.name || animal.tagNumber}</h4>
                    <p className="text-white/90 text-sm">Tag: {animal.tagNumber}</p>
                </div>
            </div>

            {/* Animal Details */}
            <div className="p-5">
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                            Category
                        </span>
                        <span className="font-semibold text-gray-800">{animal.category.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            Breed
                        </span>
                        <span className="font-semibold text-gray-800">{animal.breed.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm flex items-center">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mr-2"></div>
                            Gender
                        </span>
                        <span className="font-semibold text-gray-800">{animal.gender}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                            Weight
                        </span>
                        <span className="font-semibold text-gray-800">{animal.weightKg} kg</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-gray-600 text-sm flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Value
                        </span>
                        <span className="font-bold text-green-600 text-lg">${animal.currentValue?.toLocaleString()}</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                    </button>
                    <button className="flex-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 py-2.5 px-4 rounded-lg text-sm font-medium hover:from-gray-200 hover:to-gray-300 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                </div>
            </div>
        </div>
    );
}