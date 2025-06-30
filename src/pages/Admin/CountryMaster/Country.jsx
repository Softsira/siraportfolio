import { useState, useEffect } from "react";
import { Search, Filter, Plus, Edit, Trash2 } from "lucide-react";
import AddCountryForm from "./AddCountryForm";
import UpdateCountryForm from "./UpdateCountryForm";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { API_BASE_URL } from "../../../constant";

// eslint-disable-next-line react-refresh/only-export-components
export const fetchCountries = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/admin/countryList`,
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
      return data.data;
    } else {
      throw new Error(data.message || "Failed to fetch countries");
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
export default function Country() {
  const [countries, setCountries] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [editingCountry, setEditingCountry] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [countryToDelete, setCountryToDelete] = useState(null);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await fetchCountries();
      setCountries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadCountries();
  }, []);

  const openDeleteModal = (countryId) => {
    setCountryToDelete(countryId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setCountryToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (countryToDelete) {
      await handleDelete(countryToDelete);
      closeDeleteModal();
    }
  };

  const handleAddCountry = (newCountry) => {
    setCountries((prev) => [...prev, newCountry]); // Update the local state
  };

  const handleDelete = async (countryId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/admin/deleteCountry/${countryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Country deleted successfully");
        setCountries((prev) =>
          prev.filter((country) => country._id !== countryId)
        );
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to delete country");
    }
  };

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (activeFilter === "All") return matchesSearch;
    // This is a placeholder as the API doesn't provide an 'active' status
    // In a real application, you'd filter based on an actual status field
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Country Master</h1>
          <p className="text-lg text-gray-600">
            Manage countries, states, and cities for your application
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={20} />
          <span>Add Country</span>
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <div className="mr-2">
            <svg
              className="w-6 h-6 text-gray-500"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12H22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span className="text-gray-700 font-medium">Countries</span>
        </div>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search countries..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex space-x-2">
          <div className="flex rounded-md overflow-hidden border border-gray-200">
            <button
              className={`px-4 py-2 ${
                activeFilter === "All"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setActiveFilter("All")}
            >
              All
            </button>
            <button
              className={`px-4 py-2 ${
                activeFilter === "Active"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setActiveFilter("Active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 ${
                activeFilter === "Inactive"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-white text-gray-600"
              }`}
              onClick={() => setActiveFilter("Inactive")}
            >
              Inactive
            </button>
          </div>

          <button className="p-2 border border-gray-200 rounded-md">
            <Filter className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Countries</h2>
          <p className="text-gray-600 mb-6">
            Manage countries and their details. Click on a country to view its
            states.
          </p>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading countries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      <div className="flex items-center">
                        Name
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ml-1"
                        >
                          <path
                            d="M8 3.33337V12.6667"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 8.00004L8 12L4 8.00004"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      Code
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      Phone Code
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      Currency
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      Symbol
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 font-medium text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCountries.map((country) => (
                    <tr
                      key={country._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 font-medium">{country.name}</td>
                      <td className="py-4 px-4">{country.shortname}</td>
                      <td className="py-4 px-4">{country.phoneCode}</td>
                      <td className="py-4 px-4">{country.currency}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center justify-center w-8 h-6 bg-gray-100 text-gray-700 rounded-md">
                          {/* Placeholder for states count - would come from API */}
                          {country.symbol}
                        </span>
                      </td>
                      {/* Update Status cell */}
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              country.active === true
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span>{country.active === true
                            ? "Active" : "InActive"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => setEditingCountry(country)}
                            className="text-gray-500 hover:text-blue-600"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(country._id)}
                            className="text-gray-500 hover:text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Add Country Form */}
      {isFormOpen && (
        <AddCountryForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleAddCountry}
        />
      )}
      {editingCountry && (
        <UpdateCountryForm
          country={editingCountry}
          onClose={() => setEditingCountry(null)}
          onSuccess={(updatedCountry) => {
            setCountries(
              countries.map((c) =>
                c._id === updatedCountry._id ? updatedCountry : c
              )
            );
          }}
        />
      )}

      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this country? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}
