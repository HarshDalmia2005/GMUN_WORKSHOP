import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react";
import blockchainService from "../services/blockchainService";

export default function BlockchainPrescriptionStore({ patientId, doctorId }) {
  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    duration: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      if (!blockchainService.isConnected) {
        throw new Error("Please connect wallet first");
      }

      if (!formData.medication || !formData.dosage || !formData.duration) {
        throw new Error("Please fill all fields");
      }

      const result = await blockchainService.storePrescription(
        patientId,
        doctorId,
        formData.medication,
        formData.dosage,
        parseInt(formData.duration)
      );

      setMessage({
        type: "success",
        text: `Prescription stored on blockchain!`,
        hash: result.transactionHash,
      });

      // Reset form
      setFormData({
        medication: "",
        dosage: "",
        duration: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to store prescription",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Store Prescription</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Medication Name
          </label>
          <input
            type="text"
            name="medication"
            value={formData.medication}
            onChange={handleChange}
            placeholder="e.g., Amoxicillin"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dosage
          </label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            placeholder="e.g., 500mg - 3 times daily"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (Days)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 7"
            min="1"
            max="365"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            disabled={isLoading}
          />
        </div>

        {message && (
          <div
            className={`flex items-gap-2 p-3 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <div>
              <p className="font-medium">{message.text}</p>
              {message.hash && (
                <p className="text-xs mt-1">
                  Tx: {message.hash.slice(0, 10)}...
                </p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition font-medium"
        >
          {isLoading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Storing...
            </>
          ) : (
            <>
              <Upload size={18} />
              Store on Blockchain
            </>
          )}
        </button>
      </form>
    </div>
  );
}
