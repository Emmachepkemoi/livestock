import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const AddAnimalModal = ({ isOpen, onClose, onAnimalAdded }) => {
    const [previewURLs, setPreviewURLs] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [breeds, setBreeds] = useState([]);
    const fileInputRef = useRef(null);

    const initialAnimalState = {
        tagNumber: '',
        categoryId: '',
        breedId: '',
        gender: 'FEMALE',
        acquisitionDate: new Date().toISOString().split('T')[0],
        acquisitionMethod: 'PURCHASED',
        healthStatus: 'HEALTHY',
        name: '',
        isForSale: false,
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
        salePrice: '',
        notes: ''
    };

    const [newAnimal, setNewAnimal] = useState(initialAnimalState);

    // Fetch categories and breeds when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchCategoriesAndBreeds();
        }
    }, [isOpen]);

    // Cleanup preview URLs on component unmount
    useEffect(() => {
        return () => {
            previewURLs.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewURLs]);

    // Function to fetch categories and breeds
    const fetchCategoriesAndBreeds = async () => {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                setError('Authentication token not found');
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            // Fetch categories
            const categoriesResponse = await fetch('http://localhost:8080/api/categories', {
                headers
            });

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                const categoriesArray = categoriesData.data || categoriesData;

                if (Array.isArray(categoriesArray)) {
                    setCategories(categoriesArray);
                } else {
                    console.error('Categories data is not an array:', categoriesArray);
                    setError('Invalid categories data format');
                }
            } else {
                const errorText = await categoriesResponse.text();
                console.error('Failed to fetch categories:', categoriesResponse.status, errorText);
                setError('Failed to load categories');
            }

            // Fetch breeds
            const breedsResponse = await fetch('http://localhost:8080/api/breeds', {
                headers
            });

            if (breedsResponse.ok) {
                const breedsData = await breedsResponse.json();
                const breedsArray = breedsData.data || breedsData;

                if (Array.isArray(breedsArray)) {
                    setBreeds(breedsArray);
                } else {
                    console.error('Breeds data is not an array:', breedsArray);
                    setError('Invalid breeds data format');
                }
            } else {
                const errorText = await breedsResponse.text();
                console.error('Failed to fetch breeds:', breedsResponse.status, errorText);
                setError('Failed to load breeds');
            }
        } catch (error) {
            console.error('Error fetching categories and breeds:', error);
            setError('Failed to load categories and breeds');
        }
    };

    // Filter breeds based on selected category
// Replace your current getFilteredBreeds function with this corrected version:

    const getFilteredBreeds = () => {
        if (!newAnimal.categoryId || !categories.length || !breeds.length) {
            return [];
        }

        // Find the selected category by its ID (note: categories use 'id', not 'categoryId')
        const selectedCategory = categories.find(cat =>
            cat.id === parseInt(newAnimal.categoryId)
        );

        if (!selectedCategory) {
            console.log('Selected category not found for ID:', newAnimal.categoryId);
            return [];
        }

        console.log('Selected Category:', selectedCategory); // Debug log
        console.log('Available Breeds:', breeds); // Debug log

        // Filter breeds that match the selected category's name (case-insensitive)
        const filtered = breeds.filter(breed => {
            if (!breed.categoryName || !selectedCategory.name) {
                return false;
            }

            const breedCategoryName = breed.categoryName.toLowerCase().trim();
            const selectedCategoryName = selectedCategory.name.toLowerCase().trim();

            console.log(`Comparing: "${breedCategoryName}" === "${selectedCategoryName}"`); // Debug log

            return breedCategoryName === selectedCategoryName;
        });

        console.log('Filtered Breeds:', filtered); // Debug log
        return filtered;
    };

    const filteredBreeds = getFilteredBreeds();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'categoryId') {
            // Reset breed when category changes
            setNewAnimal(prev => ({
                ...prev,
                categoryId: value,
                breedId: ''
            }));
        } else {
            setNewAnimal(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleFiles = (files) => {
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

        // Cleanup previous URLs
        previewURLs.forEach(url => URL.revokeObjectURL(url));

        // Create new preview URLs
        const imageURLs = imageFiles.map(file => URL.createObjectURL(file));
        setSelectedFiles(imageFiles);
        setPreviewURLs(imageURLs);
    };

    const handleRemoveImage = (index) => {
        URL.revokeObjectURL(previewURLs[index]);
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewURLs(prev => prev.filter((_, i) => i !== index));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const resetModal = () => {
        setNewAnimal(initialAnimalState);
        setSelectedFiles([]);
        previewURLs.forEach(url => URL.revokeObjectURL(url));
        setPreviewURLs([]);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Validate required fields
            if (!newAnimal.categoryId || !newAnimal.breedId) {
                throw new Error('Please select both category and breed.');
            }

            if (!newAnimal.tagNumber.trim()) {
                throw new Error('Tag number is required.');
            }

            const formData = new FormData();

            // Prepare payload with proper type conversion
            const animalData = {
                tagNumber: newAnimal.tagNumber.trim(),
                categoryId: parseInt(newAnimal.categoryId),
                breedId: parseInt(newAnimal.breedId),
                gender: newAnimal.gender,
                acquisitionDate: newAnimal.acquisitionDate,
                acquisitionMethod: newAnimal.acquisitionMethod,
                healthStatus: newAnimal.healthStatus,
                isForSale: Boolean(newAnimal.isForSale),
                // Optional fields - only include if they have values
                ...(newAnimal.name.trim() && { name: newAnimal.name.trim() }),
                ...(newAnimal.dateOfBirth && { dateOfBirth: newAnimal.dateOfBirth }),
                ...(newAnimal.estimatedAgeMonths && { estimatedAgeMonths: parseInt(newAnimal.estimatedAgeMonths) }),
                ...(newAnimal.weightKg && { weightKg: parseFloat(newAnimal.weightKg) }),
                ...(newAnimal.color.trim() && { color: newAnimal.color.trim() }),
                ...(newAnimal.acquisitionCost && { acquisitionCost: parseFloat(newAnimal.acquisitionCost) }),
                ...(newAnimal.currentValue && { currentValue: parseFloat(newAnimal.currentValue) }),
                ...(newAnimal.motherId && { motherId: parseInt(newAnimal.motherId) }),
                ...(newAnimal.fatherId && { fatherId: parseInt(newAnimal.fatherId) }),
                ...(newAnimal.locationOnFarm.trim() && { locationOnFarm: newAnimal.locationOnFarm.trim() }),
                ...(newAnimal.identificationMarks.trim() && { identificationMarks: newAnimal.identificationMarks.trim() }),
                ...(newAnimal.microchipNumber.trim() && { microchipNumber: newAnimal.microchipNumber.trim() }),
                ...(newAnimal.insurancePolicyNumber.trim() && { insurancePolicyNumber: newAnimal.insurancePolicyNumber.trim() }),
                ...(newAnimal.insuranceValue && { insuranceValue: parseFloat(newAnimal.insuranceValue) }),
                ...(newAnimal.salePrice && { salePrice: parseFloat(newAnimal.salePrice) }),
                ...(newAnimal.notes.trim() && { notes: newAnimal.notes.trim() })
            };

            // Add images metadata if files are selected
            if (selectedFiles.length > 0) {
                animalData.images = JSON.stringify([selectedFiles[0].name]);
            }

            // Append JSON data as blob
            formData.append(
                'data',
                new Blob([JSON.stringify(animalData)], { type: 'application/json' })
            );

            // Append image file if present
            if (selectedFiles.length > 0) {
                formData.append('image', selectedFiles[0]);
            }

            // Submit the form
            const response = await fetch('http://localhost:8080/api/livestock/create', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.message || `Server error: ${response.status}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();

            // Notify parent component
            if (onAnimalAdded) {
                onAnimalAdded(result.data || result);
            }

            // Close modal and reset
            onClose();
            resetModal();

        } catch (err) {
            console.error('Error creating animal:', err);
            setError(err.message || 'Failed to save animal');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">Add New Animal</h3>
                        <button
                            onClick={() => {
                                onClose();
                                resetModal();
                            }}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                            disabled={loading}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Required Fields */}
                        <div className="border-b pb-4">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Required Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="tagNumber" className="block text-sm font-medium text-gray-700 mb-1">
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
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={newAnimal.categoryId}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="breedId" className="block text-sm font-medium text-gray-700 mb-1">
                                        Breed *
                                    </label>
                                    <select
                                        id="breedId"
                                        name="breedId"
                                        value={newAnimal.breedId}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        disabled={loading || !newAnimal.categoryId}
                                    >
                                        <option value="">
                                            {!newAnimal.categoryId ? 'Select category first' : 'Select a breed'}
                                        </option>
                                        {filteredBreeds.map(breed => (
                                            <option key={breed.breedId} value={breed.breedId}>
                                                {breed.name}
                                            </option>
                                        ))}
                                    </select>
                                    {newAnimal.categoryId && filteredBreeds.length === 0 && (
                                        <p className="text-sm text-gray-500 mt-1">No breeds available for selected category</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Gender *
                                    </label>
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={newAnimal.gender}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="FEMALE">Female</option>
                                        <option value="MALE">Male</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="acquisitionDate" className="block text-sm font-medium text-gray-700 mb-1">
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
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="acquisitionMethod" className="block text-sm font-medium text-gray-700 mb-1">
                                        Acquisition Method *
                                    </label>
                                    <select
                                        id="acquisitionMethod"
                                        name="acquisitionMethod"
                                        value={newAnimal.acquisitionMethod}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        disabled={loading}
                                    >
                                        <option value="PURCHASED">Purchased</option>
                                        <option value="BORN_ON_FARM">Born on Farm</option>
                                        <option value="GIFT">Gift</option>
                                        <option value="INHERITED">Inherited</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="healthStatus" className="block text-sm font-medium text-gray-700 mb-1">
                                        Health Status *
                                    </label>
                                    <select
                                        id="healthStatus"
                                        name="healthStatus"
                                        value={newAnimal.healthStatus}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        required
                                        disabled={loading}
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
                        <div className="border-b pb-4">
                            <h4 className="text-md font-medium text-gray-700 mb-3">Additional Information</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newAnimal.name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        min="1"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        min="1"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                        min="0"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                        disabled={loading}
                                    />
                                </div>

                                <div className="md:col-span-2">
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
                                        disabled={loading}
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
                                        disabled={loading}
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
                                            min="0"
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                            disabled={loading}
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
                                        disabled={loading}
                                    />
                                </div>

                                {/* Fixed Image Upload Section */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload Images
                                    </label>

                                    <div
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            const files = Array.from(e.dataTransfer.files);
                                            handleFiles(files);
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={triggerFileInput}
                                        className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    >
                                        <p>Drag & drop images here, or click to select</p>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => handleFiles(Array.from(e.target.files))}
                                        className="hidden"
                                    />

                                    {previewURLs.length > 0 && (
                                        <div className="grid grid-cols-3 gap-2 mt-3">
                                            {previewURLs.map((url, idx) => (
                                                <div key={idx} className="relative">
                                                    <img
                                                        src={url}
                                                        alt={`preview-${idx}`}
                                                        className="h-20 w-full object-cover rounded-md"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveImage(idx);
                                                        }}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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