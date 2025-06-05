import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddExperienceForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrentlyWorking: true,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    // Use checked for checkboxes, value for other input types
    const inputValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.post(
        "http://localhost:5001/api/v1/user/addExperience",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("New Experience Added:", response.data);
      toast.success("Experience added successfully!");
      onSuccess(response.data.data); // Notify the parent component about the new experience
      onClose(); // Close the form modal
    } catch (error) {
      console.error(
        "Error adding experience:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to add experience. Please try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Experience</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name*</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Google"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role*</label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Software Engineer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Mountain View, CA"
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="month"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="month"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isCurrentlyWorking} // Disable if "isCurrentlyWorking" is true
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formData.isCurrentlyWorking
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" // Styles for disabled state
                    : "border-gray-300 focus:ring-blue-500" // Styles for enabled state
                }`}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isCurrentlyWorking"
                checked={formData.isCurrentlyWorking}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                I am currently working in this role
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your role and responsibilities"
              rows="3"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddExperienceForm;
