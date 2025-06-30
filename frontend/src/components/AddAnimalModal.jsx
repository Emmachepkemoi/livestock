import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddAnimalModal = ({ isOpen, onClose, categories, breeds, onAnimalAdded, user }) => {
    const [newAnimal, setNewAnimal] = useState({
        // Required fields
        tagNumber: '',
        categoryId: '',
        breedId: '',
        gender: 'FEMALE',
        acquisitionDate: new Date().toISOString().split('T')[0],
        acquisitionMethod: 'PURCHASED',
        healthStatus: 'HEALTHY',

        // Optional fields
        name: '',
        dateOfBirth: '',
        estimatedAgeMonths: '',
        weightKg: '',
        color: '',
        acquisitionCost: '',
        currentValue: '',
        motherId: '',
        fatherId: '',
        locationOnFarm: '',
        identificationMarks: '',
        microchipNumber: '',
        insurancePolicyNumber: '',
        insuranceValue: '',
        isForSale: false,
        salePrice: '',
        notes: '',
        images: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare the data according to your DTO structure
            const requestData = {
                tagNumber: newAnimal.tagNumber,
                categoryId: parseInt(newAnimal.categoryId),
                breedId: parseInt(newAnimal.breedId),
                gender: newAnimal.gender,
                acquisitionDate: newAnimal.acquisitionDate,
                acquisitionMethod: newAnimal.acquisitionMethod,
                healthStatus: newAnimal.healthStatus,

                // Optional fields - only send if they have values
                ...(newAnimal.name && { name: newAnimal.name }),
                ...(newAnimal.dateOfBirth && { dateOfBirth: newAnimal.dateOfBirth }),
                ...(newAnimal.estimatedAgeMonths && { estimatedAgeMonths: parseInt(newAnimal.estimatedAgeMonths) }),
                ...(newAnimal.weightKg && { weightKg: parseFloat(newAnimal.weightKg) }),
                ...(newAnimal.color && { color: newAnimal.color }),
                ...(newAnimal.acquisitionCost && { acquisitionCost: parseFloat(newAnimal.acquisitionCost) }),
                ...(newAnimal.currentValue && { currentValue: parseFloat(newAnimal.currentValue) }),
                ...(newAnimal.motherId && { motherId: parseInt(newAnimal.motherId) }),
                ...(newAnimal.fatherId && { fatherId: parseInt(newAnimal.fatherId) }),
                ...(newAnimal.locationOnFarm && { locationOnFarm: newAnimal.locationOnFarm }),
                ...(newAnimal.identificationMarks && { identificationMarks: newAnimal.identificationMarks }),
                ...(newAnimal.microchipNumber && { microchipNumber: newAnimal.microchipNumber }),
                ...(newAnimal.insurancePolicyNumber && { insurancePolicyNumber: newAnimal.insurancePolicyNumber }),
                ...(newAnimal.insuranceValue && { insuranceValue: parseFloat(newAnimal.insuranceValue) }),
                ...(newAnimal.salePrice && { salePrice: parseFloat(newAnimal.salePrice) }),
                ...(newAnimal.notes && { notes: newAnimal.notes }),
                ...(newAnimal.images && { images: newAnimal.images }),

                isForSale: newAnimal.isForSale
            };

            const token = localStorage.getItem('token');

            const response = await fetch('http://localhost:8080/api/livestock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add animal');
            }

            const result = await response.json();

            // Success
            onAnimalAdded && onAnimalAdded(result.data);
            onClose(); // Use the passed onClose prop instead of setShowAddAnimalModal

            // Reset form
            setNewAnimal({
                tagNumber: '',
                categoryId: '',
                breedId: '',
                gender: 'FEMALE',
                acquisitionDate: new Date().toISOString().split('T')[0],
                acquisitionMethod: 'PURCHASED',
                healthStatus: 'HEALTHY',
                name: '',
                dateOfBirth: '',
                estimatedAgeMonths: '',
                weightKg: '',
                color: '',
                acquisitionCost: '',
                currentValue: '',
                motherId: '',
                fatherId: '',
                locationOnFarm: '',
                identificationMarks: '',
                microchipNumber: '',
                insurancePolicyNumber: '',
                insuranceValue: '',
                isForSale: false,
                salePrice: '',
                notes: '',
                images: ''
            });

        } catch (error) {
            console.error('Error adding animal:', error);
            setError(error.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAnimal(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Don't render anything if modal is not open
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Add New Animal</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Required Fields */}
                        <div className="border-b pb-4 mb-4">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Required Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="tagNumber"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Tag Number *
                                    </label>
                                    <input
                                        type="text"
                                        id="tagNumber"
                                        name="tagNumber"
                                        value={newAnimal.tagNumber}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoryId"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={newAnimal.categoryId}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        {categories?.map((category) => (
                                            <option key={category.categoryId} value={category.categoryId}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="breedId"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Breed *
                                    </label>
                                    <select
                                        id="breedId"
                                        name="breedId"
                                        value={newAnimal.breedId}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        disabled={!newAnimal.categoryId}
                                    >
                                        <option value="">Select a breed</option>
                                        {breeds
                                            ?.filter(breed => breed.categoryId === parseInt(newAnimal.categoryId))
                                            .map((breed) => (
                                                <option key={breed.breedId} value={breed.breedId}>
                                                    {breed.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="gender"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={newAnimal.gender}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="FEMALE">Female</option>
                                        <option value="MALE">Male</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="acquisitionDate"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Acquisition Date *
                                    </label>
                                    <input
                                        type="date"
                                        id="acquisitionDate"
                                        name="acquisitionDate"
                                        value={newAnimal.acquisitionDate}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="acquisitionMethod"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Acquisition Method *
                                    </label>
                                    <select
                                        id="acquisitionMethod"
                                        name="acquisitionMethod"
                                        value={newAnimal.acquisitionMethod}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="PURCHASED">Purchased</option>
                                        <option value="BORN_ON_FARM">Born on Farm</option>
                                        <option value="GIFT">Gift</option>
                                        <option value="INHERITED">Inherited</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="healthStatus"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Health Status *
                                    </label>
                                    <select
                                        id="healthStatus"
                                        name="healthStatus"
                                        value={newAnimal.healthStatus}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="HEALTHY">Healthy</option>
                                        <option value="SICK">Sick</option>
                                        <option value="RECOVERING">Recovering</option>
                                        <option value="DECEASED">Deceased</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Optional Fields */}
                        <div className="border-b pb-4 mb-4">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Additional Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newAnimal.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        id="dateOfBirth"
                                        name="dateOfBirth"
                                        value={newAnimal.dateOfBirth}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="estimatedAgeMonths" className="block text-sm font-medium text-gray-700 mb-1">
                                        Estimated Age (months)
                                    </label>
                                    <input
                                        type="number"
                                        id="estimatedAgeMonths"
                                        name="estimatedAgeMonths"
                                        value={newAnimal.estimatedAgeMonths}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="weightKg" className="block text-sm font-medium text-gray-700 mb-1">
                                        Weight (kg)
                                    </label>
                                    <input
                                        type="number"
                                        id="weightKg"
                                        name="weightKg"
                                        value={newAnimal.weightKg}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">
                                        Color
                                    </label>
                                    <input
                                        type="text"
                                        id="color"
                                        name="color"
                                        value={newAnimal.color}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="acquisitionCost" className="block text-sm font-medium text-gray-700 mb-1">
                                        Acquisition Cost
                                    </label>
                                    <input
                                        type="number"
                                        id="acquisitionCost"
                                        name="acquisitionCost"
                                        value={newAnimal.acquisitionCost}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Value
                                    </label>
                                    <input
                                        type="number"
                                        id="currentValue"
                                        name="currentValue"
                                        value={newAnimal.currentValue}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="motherId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Mother ID
                                    </label>
                                    <input
                                        type="number"
                                        id="motherId"
                                        name="motherId"
                                        value={newAnimal.motherId}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="fatherId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Father ID
                                    </label>
                                    <input
                                        type="number"
                                        id="fatherId"
                                        name="fatherId"
                                        value={newAnimal.fatherId}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="locationOnFarm" className="block text-sm font-medium text-gray-700 mb-1">
                                        Location on Farm
                                    </label>
                                    <input
                                        type="text"
                                        id="locationOnFarm"
                                        name="locationOnFarm"
                                        value={newAnimal.locationOnFarm}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="identificationMarks" className="block text-sm font-medium text-gray-700 mb-1">
                                        Identification Marks
                                    </label>
                                    <textarea
                                        id="identificationMarks"
                                        name="identificationMarks"
                                        value={newAnimal.identificationMarks}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={2}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="microchipNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Microchip Number
                                    </label>
                                    <input
                                        type="text"
                                        id="microchipNumber"
                                        name="microchipNumber"
                                        value={newAnimal.microchipNumber}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Insurance Policy Number
                                    </label>
                                    <input
                                        type="text"
                                        id="insurancePolicyNumber"
                                        name="insurancePolicyNumber"
                                        value={newAnimal.insurancePolicyNumber}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="insuranceValue" className="block text-sm font-medium text-gray-700 mb-1">
                                        Insurance Value
                                    </label>
                                    <input
                                        type="number"
                                        id="insuranceValue"
                                        name="insuranceValue"
                                        value={newAnimal.insuranceValue}
                                        onChange={handleChange}
                                        step="0.01"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isForSale"
                                        name="isForSale"
                                        checked={newAnimal.isForSale}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="isForSale" className="ml-2 block text-sm text-gray-700">
                                        Mark as For Sale
                                    </label>
                                </div>

                                {newAnimal.isForSale && (
                                    <div>
                                        <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700 mb-1">
                                            Sale Price
                                        </label>
                                        <input
                                            type="number"
                                            id="salePrice"
                                            name="salePrice"
                                            value={newAnimal.salePrice}
                                            onChange={handleChange}
                                            step="0.01"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        />
                                    </div>
                                )}

                                <div className="md:col-span-2">
                                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                                        Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={newAnimal.notes}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                                        Images (comma-separated URLs)
                                    </label>
                                    <textarea
                                        id="images"
                                        name="images"
                                        value={newAnimal.images}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        rows={2}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Animal'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAnimalModal;