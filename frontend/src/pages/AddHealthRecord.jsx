import React, { useState } from "react";
import axios from "axios";

const AddHealthRecord = ({ isOpen, livestockId, onClose, onSave, onRecordAdded }) => {
    const [formData, setFormData] = useState({
        livestockId: livestockId || "",
        animalId: "",
        animalType: "",
        farmerName: "",
        examinationDate: "",
        examinationType: "ROUTINE_CHECKUP",
        temperatureCelsius: "",
        heartRateBpm: "",
        respiratoryRateBpm: "",
        weightKg: "",
        bodyConditionScore: "",
        symptoms: "",
        diagnosis: "",
        treatmentGiven: "",
        medicationsPrescribed: "",
        recommendations: "",
        followUpRequired: false,
        followUpDate: "",
        consultationFee: "",
        status: "ACTIVE",
        healthStatus: "Healthy"
    });

    const [loading, setLoading] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            // Validate required fields
            if (!formData.livestockId) {
                alert("❌ Livestock ID is required!");
                setLoading(false);
                return;
            }

            if (!formData.animalId || !formData.animalType || !formData.farmerName) {
                alert("❌ Please fill in all required fields!");
                setLoading(false);
                return;
            }

            const payload = {
                livestockId: parseInt(formData.livestockId), // Ensure it's converted to number
                vetId: formData.vetId ? parseInt(formData.vetId) : null,
                examinationDate: formData.examinationDate,
                examinationType: formData.examinationType,
                temperatureCelsius: formData.temperatureCelsius
                    ? parseFloat(formData.temperatureCelsius) : null,
                heartRateBpm: formData.heartRateBpm
                    ? parseInt(formData.heartRateBpm) : null,
                respiratoryRateBpm: formData.respiratoryRateBpm
                    ? parseInt(formData.respiratoryRateBpm) : null,
                weightKg: formData.weightKg
                    ? parseFloat(formData.weightKg) : null,
                bodyConditionScore: formData.bodyConditionScore
                    ? parseInt(formData.bodyConditionScore) : null,
                symptoms: formData.symptoms
                    ? formData.symptoms.split(",").map(s => s.trim())
                    : [],
                diagnosis: formData.diagnosis,
                treatmentGiven: formData.treatmentGiven,
                medicationsPrescribed: formData.medicationsPrescribed
                    ? formData.medicationsPrescribed.split(",").map(m => m.trim())
                    : [],
                recommendations: formData.recommendations,
                followUpRequired: formData.followUpRequired,
                followUpDate: formData.followUpDate || null,
                consultationFee: formData.consultationFee
                    ? parseFloat(formData.consultationFee) : null,
                status: formData.status
            };

            console.log("Payload being sent:", payload); // Debug log

            const res = await axios.post(
                "http://localhost:8080/api/health-records",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (res.data.success) {
                alert("✅ Health record added successfully!");
                if (onRecordAdded) onRecordAdded(res.data.data);
                if (onSave) onSave(res.data.data);
                handleClose(); // Use handleClose to reset form
            } else {
                alert(`❌ ${res.data.message}`);
            }
        } catch (error) {
            console.error("❌ Error adding health record:", error);

            // Better error handling
            if (error.response) {
                const errorMsg = error.response.data?.message || "Server error occurred";
                alert(`❌ Error: ${errorMsg}`);
                console.log("Server response:", error.response.data);
            } else if (error.request) {
                alert("❌ Network error! Please check your connection.");
            } else {
                alert("❌ Unexpected error occurred!");
            }
        } finally {
            setLoading(false);
        }
    };

    // Reset form when modal closes
    const handleClose = () => {
        setFormData({
            livestockId: livestockId || "",
            animalId: "",
            animalType: "",
            farmerName: "",
            examinationDate: "",
            examinationType: "ROUTINE_CHECKUP",
            temperatureCelsius: "",
            heartRateBpm: "",
            respiratoryRateBpm: "",
            weightKg: "",
            bodyConditionScore: "",
            symptoms: "",
            diagnosis: "",
            treatmentGiven: "",
            medicationsPrescribed: "",
            recommendations: "",
            followUpRequired: false,
            followUpDate: "",
            consultationFee: "",
            status: "ACTIVE",
            healthStatus: "Healthy"
        });
        onClose();
    };

    // Don't render if modal is not open
    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-4">Add Health Record</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Livestock ID (Hidden or Display Only) */}
                    <div>
                        <label className="block text-sm font-medium">Livestock ID *</label>
                        <input
                            type="number"
                            name="livestockId"
                            value={formData.livestockId}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2 bg-gray-100"
                            required
                            placeholder="Enter Livestock ID"
                        />
                        <small className="text-gray-600">This should be the ID of the livestock animal</small>
                    </div>

                    {/* Basic Animal Info */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Animal ID *</label>
                            <input
                                type="text"
                                name="animalId"
                                value={formData.animalId}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                                placeholder="e.g., C001"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Animal Type *</label>
                            <select
                                name="animalType"
                                value={formData.animalType}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="Cattle">Cattle</option>
                                <option value="Goat">Goat</option>
                                <option value="Sheep">Sheep</option>
                                <option value="Pig">Pig</option>
                                <option value="Poultry">Poultry</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Farmer Name *</label>
                            <input
                                type="text"
                                name="farmerName"
                                value={formData.farmerName}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                required
                                placeholder="e.g., John Doe"
                            />
                        </div>
                    </div>

                    {/* Examination date */}
                    <div>
                        <label className="block text-sm font-medium">Examination Date *</label>
                        <input
                            type="date"
                            name="examinationDate"
                            value={formData.examinationDate}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        />
                    </div>

                    {/* Examination Type */}
                    <div>
                        <label className="block text-sm font-medium">Examination Type</label>
                        <select
                            name="examinationType"
                            value={formData.examinationType}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            required
                        >
                            <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                            <option value="SICK_VISIT">Sick Visit</option>
                            <option value="FOLLOW_UP">Follow Up</option>
                            <option value="EMERGENCY">Emergency</option>
                        </select>
                    </div>

                    {/* Health Status */}
                    <div>
                        <label className="block text-sm font-medium">Health Status</label>
                        <select
                            name="healthStatus"
                            value={formData.healthStatus}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="Healthy">Healthy</option>
                            <option value="Under Treatment">Under Treatment</option>
                            <option value="Critical">Critical</option>
                        </select>
                    </div>

                    {/* Vitals */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Temperature (°C)</label>
                            <input
                                type="number"
                                name="temperatureCelsius"
                                value={formData.temperatureCelsius}
                                onChange={handleChange}
                                step="0.1"
                                className="w-full border rounded-lg p-2"
                                placeholder="38.5"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Heart Rate (bpm)</label>
                            <input
                                type="number"
                                name="heartRateBpm"
                                value={formData.heartRateBpm}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                placeholder="70"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Respiratory Rate (bpm)</label>
                            <input
                                type="number"
                                name="respiratoryRateBpm"
                                value={formData.respiratoryRateBpm}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-2"
                                placeholder="20"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Weight (Kg)</label>
                            <input
                                type="number"
                                name="weightKg"
                                value={formData.weightKg}
                                onChange={handleChange}
                                step="0.1"
                                className="w-full border rounded-lg p-2"
                                placeholder="450"
                            />
                        </div>
                    </div>

                    {/* Body Condition Score */}
                    <div>
                        <label className="block text-sm font-medium">Body Condition Score (1-9)</label>
                        <input
                            type="number"
                            name="bodyConditionScore"
                            value={formData.bodyConditionScore}
                            onChange={handleChange}
                            min="1"
                            max="9"
                            className="w-full border rounded-lg p-2"
                            placeholder="5"
                        />
                    </div>

                    {/* Symptoms */}
                    <div>
                        <label className="block text-sm font-medium">Symptoms (comma-separated)</label>
                        <input
                            type="text"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            placeholder="fever, cough, loss of appetite"
                        />
                    </div>

                    {/* Diagnosis */}
                    <div>
                        <label className="block text-sm font-medium">Diagnosis</label>
                        <textarea
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            rows="3"
                            placeholder="Enter diagnosis details..."
                        />
                    </div>

                    {/* Treatment */}
                    <div>
                        <label className="block text-sm font-medium">Treatment Given</label>
                        <textarea
                            name="treatmentGiven"
                            value={formData.treatmentGiven}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            rows="3"
                            placeholder="Describe treatment administered..."
                        />
                    </div>

                    {/* Medications */}
                    <div>
                        <label className="block text-sm font-medium">Medications/Vaccinations (comma-separated)</label>
                        <input
                            type="text"
                            name="medicationsPrescribed"
                            value={formData.medicationsPrescribed}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            placeholder="FMD, Anthrax, Antibiotics"
                        />
                    </div>

                    {/* Recommendations */}
                    <div>
                        <label className="block text-sm font-medium">Recommendations</label>
                        <textarea
                            name="recommendations"
                            value={formData.recommendations}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                            rows="3"
                            placeholder="Enter recommendations for farmer..."
                        />
                    </div>

                    {/* Follow Up */}
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="followUpRequired"
                                checked={formData.followUpRequired}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            Follow Up Required
                        </label>
                        {formData.followUpRequired && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Follow Up Date</label>
                                <input
                                    type="date"
                                    name="followUpDate"
                                    value={formData.followUpDate}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2"
                                />
                            </div>
                        )}
                    </div>

                    {/* Consultation Fee */}
                    <div>
                        <label className="block text-sm font-medium">Consultation Fee (KSh)</label>
                        <input
                            type="number"
                            name="consultationFee"
                            value={formData.consultationFee}
                            onChange={handleChange}
                            step="0.01"
                            className="w-full border rounded-lg p-2"
                            placeholder="1500"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium">Record Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="ONGOING">Ongoing</option>
                        </select>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition-colors"
                            onClick={handleClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Save Record"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHealthRecord;