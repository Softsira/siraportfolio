import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../../components/ConfirmationModal";
import AddCityForm from "./AddCityForm";
import UpdateCityForm from "./UpdateCityForm";

export default function CityList({ selectedCountry, searchTerm }) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [cityToDelete, setCityToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

const handleAddCity = (newCity) => {
    setCities((prev) => [...prev, newCity]); // Update the local state
};


  const openDeleteModal = (cityId) => {
    setCityToDelete(cityId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCityToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (cityToDelete) {
      await handleDelete(cityToDelete);
      closeDeleteModal();
    }
  };

    const handleDelete = async (cityId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5001/api/v1/admin/deleteCity/${cityId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("City deleted successfully");
        setCities((prev) =>
          prev.filter((city) => city._id !== cityId)
        );
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to delete city");
    }
  };

useEffect(() => {
const fetchCities = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5001/api/v1/admin/cityList?country=${selectedCountry._id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data = await response.json();
      if (data.success) {
        setCities(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch countries");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
}
fetchCities()
  }, [selectedCountry]);

  // Filter states by search term
  const filteredCities = cities.filter(
    (city) =>
      city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          Cities in {selectedCountry?.name || "..."}
        </h2>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md"
        onClick={() => setIsFormOpen(true)}
        >
          + Add City
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-4 px-4 font-medium text-gray-600">Pincode</th>
              <th className="text-left py-4 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-4 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <tr key={city._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{city.name}</td>
                  <td className="py-4 px-4 font-medium">{city.pincode}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          city.active ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span>{city.active ? "Active" : "Inactive"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <button className="text-gray-500 hover:text-blue-600"
                       onClick={() => setEditingCity(city)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="text-gray-500 hover:text-red-600"
                      onClick={() => openDeleteModal(city._id)}>
                        <span role="img" aria-label="delete">🗑️</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                  No states found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          {/* Add Country Form */}
      {isFormOpen && (
        <AddCityForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleAddCity}
          selectedCountryId = {selectedCountry._id}
        />
      )}  
      {editingCity && (
              <UpdateCityForm
                city={editingCity}
                selectedCountryId = {selectedCountry._id}
                onClose={() => setEditingCity(null)}
                onSuccess={(updatedCity) => {
                  setCities(
                    cities.map((c) =>
                      c._id === updatedCity._id ? updatedCity : c
                    )
                  );
                }}
              />
            )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this city? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}