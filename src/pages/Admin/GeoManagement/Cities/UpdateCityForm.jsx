import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function UpdateCityForm({ onClose, onSuccess, city, selectedCountryId }) {
  const [isActive, setIsActive] = useState(city?.active || true);
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    state: city?.state || "",
    name: city?.name || "",
    pincode: city?.pincode || "",
    active: city?.active || true,
  });

  useEffect(() => {
    // When selectedCity prop changes, update the form data
    if (city) {
      setFormData({
        state: city.state || "",
        name: city.name || "",
        pincode: city.pincode || "",
        active: city.active || true,
      });
      setIsActive(city.active || true);
    }
  }, [city]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        setLoading(true);
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
          throw new Error("Failed to fetch states");
        }

        const data = await response.json();
        if (data.success) {
          setStates(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch states");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedCountryId) {
      fetchStates();
    }
  }, [selectedCountryId]);

useEffect(() => {
  if (city?.state && states.length > 0) {
    // Find the matching state object
const matchedState = states.find(state => 
  state._id.toString() === city.state.toString()
);
    
    // If state exists in the list, update formData
    if (matchedState) {
      setFormData(prev => ({
        ...prev,
        state: matchedState._id // Ensure we're using the ID for value
      }));
    }
  }
}, [states, city]); // Trigger when states or city changes

  // Update formData when isActive changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, active: isActive }));
  }, [isActive]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.state || !formData.name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5001/api/v1/admin/updateCity/${city._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("City Updated:", response.data);
      toast.success("City updated successfully!");
      onSuccess(response.data.data); // Notify the parent component about the updated city
      onClose(); // Close the form modal
    } catch (error) {
      console.error(
        "Error updating city:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to update city. Please try again.");
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
          <h2 className="text-xl font-bold text-gray-800">Update City</h2>
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
              Select State:
            </label>
            {selectedCountryId ? (
              loading ? (
                <div>Loading states...</div>
              ) : error ? (
                <div>{error}</div>
              ) : (
                <select
                  key={states.length} // Force re-render when states change
                  name="state"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {states.map((state) => (
                    <option
                      key={state._id}
                      value={state._id}
                    >
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
            <label className="block text-sm font-medium text-gray-700">
              City name
            </label>
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
            <label className="block text-sm font-medium text-gray-700">
              Pin code
            </label>
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
                isActive ? "bg-blue-500" : "bg-gray-300"
              }`}
              onClick={() => setIsActive(!isActive)}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  isActive ? "translate-x-6" : ""
                }`}
              />
            </div>
            <span className="ml-3 text-gray-700 font-medium">
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCityForm;