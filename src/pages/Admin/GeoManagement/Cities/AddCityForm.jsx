import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function AddCityForm({ onClose, onSuccess, selectedCountryId }) {
const [isActive, setIsActive] = useState(true);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
  state: "",
  name: "",
  pincode: "",
  active: isActive,
});

useEffect(() => {
const fetchStates = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5001/api/v1/admin/stateList?country=${selectedCountryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

if (!response.ok) {
        throw new Error("Failed to fetch countries");
      }

      const data = await response.json();
      if (data.success) {
        setStates(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch countries");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
}
fetchStates()
  }, [selectedCountryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.post(
        "http://localhost:5001/api/v1/admin/addCity",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
            "Content-Type": "application/json",
          },
        }
      );
      console.log("New City Added:", response.data);
      toast.success("City added successfully!");
      onSuccess(response.data.data); // Notify the parent component about the new country
      onClose(); // Close the form modal
    } catch (error) {
      console.error(
        "Error adding city:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to add city. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(5px)" , backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add City</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
        <label className="block text-sm font-medium text-gray-700">Select State:</label>
        {selectedCountryId ? (
          loading ? (
            <div>Loading states...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <select 
            name="state"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.state}
            onChange={handleChange}>
              <option value="">Select a state</option>
              {states.map(state => (
                <option key={state._id} value={state._id}>
                  {state.name}
                </option>
              ))}
            </select>
          )
        ) : (
          <div>Please select a country first</div>
        )}
      </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Los Angeles"
            />
          </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Pin code</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 90001"
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

export default AddCityForm;