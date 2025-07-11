import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Edit } from "lucide-react";
import { API_BASE_URL } from "../../../../constant";

export default function UpdatestateForm({ state, onClose, onSuccess ,selectedCountryId}) {
  const [formData, setFormData] = useState({
    name: "",
    shortname: "",
    country: selectedCountryId,
    active: true,
  });

  // Initialize form data when state prop changes
  useEffect(() => {
    if (state) {
      setFormData({
        name: state.name,
        shortname: state.shortname,
        country: selectedCountryId,
        active: state.active,
      });
    }
  }, [state, selectedCountryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      active: !prev.active,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/admin/updatestate/${state._id}`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("State updated successfully!");
      onSuccess(response.data.data);
      onClose();
    } catch (error) {
      console.error(
        "Error updating state:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to update state");
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Edit className="w-5 h-5" /> Update State
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600"
          >
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              State Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Short Name*
            </label>
            <input
              type="text"
              name="shortname"
              value={formData.shortname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center mb-4">
            <div
              className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
                formData.active ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={handleToggleActive}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  formData.active ? "translate-x-6" : ""
                }`}
              />
            </div>
            <span className="ml-3 text-gray-700 font-medium">
              {formData.active ? "Active" : "Inactive"}
            </span>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update state
          </button>
        </form>
      </div>
    </div>
  );
}
