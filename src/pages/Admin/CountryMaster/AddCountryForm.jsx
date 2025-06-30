import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../constant";

function AddCountryForm({ onClose, onSuccess }) {
const [isActive, setIsActive] = useState(true);
  const [formData, setFormData] = useState({
  name: "",
  shortname: "",
  code: "",
  currency: "",
  symbol: "",
  phoneCode: "",
  timezone: "",
  active: isActive,
});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.post(
        `${API_BASE_URL


          
        }/admin/addCountry`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        }
      );
      console.log("New Country Added:", response.data);
      toast.success("Country added successfully!");
      onSuccess(response.data.data); // Notify the parent component about the new country
      onClose(); // Close the form modal
    } catch (error) {
      console.error(
        "Error adding country:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to add country. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(5px)" , backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add Country</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Country Name*</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: United States Of America"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Short name</label>
            <input
              type="text"
              name="shortname"
              value={formData.shortname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: USA"
            />
          </div>
          <div className="flex space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: US"
            />
          </div>
          <div>
              <label className="block text-sm font-medium text-gray-700">Phone Code</label>
              <input
                type="text"
                name="phoneCode"
                value={formData.phoneCode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: +1"
              />
            </div>
            </div> 
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: US Dollar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Symbol</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: $"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Timezone</label>
            <input
              type="text"
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: America/New_York"
            />
          </div>
          <div className="flex items-center mb-4">
        <div 
          className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${
            isActive ? 'bg-blue-500' : 'bg-gray-300'
          }`}
          onClick={() => setIsActive(!isActive)}
        >
          <div 
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              isActive ? 'translate-x-6' : ''
            }`}
          />
        </div>
        <span className="ml-3 text-gray-700 font-medium">
          {isActive ? 'Active' : 'Inactive'}
        </span>
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

export default AddCountryForm;