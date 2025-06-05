import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AddStateForm from "./AddStateForm";
import UpdatestateForm from "./UpdateStateForm";
import ConfirmationModal from "../../../../components/ConfirmationModal";

export default function StateList({ selectedCountry, searchTerm }) {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingState, setEditingState] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [stateToDelete, setStateToDelete] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

const handleAddState = (newState) => {
    setStates((prev) => [...prev, newState]); // Update the local state
};


  const openDeleteModal = (stateId) => {
    setStateToDelete(stateId);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setStateToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (stateToDelete) {
      await handleDelete(stateToDelete);
      closeDeleteModal();
    }
  };

    const handleDelete = async (stateId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `http://localhost:5001/api/v1/admin/deleteState/${stateId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("State deleted successfully");
        setStates((prev) =>
          prev.filter((state) => state._id !== stateId)
        );
      }
    } catch (error) {
      console.error(
        "Delete error:",
        error.response?.data?.message || error.message
      );
      toast.error(error.response?.data?.message || "Failed to delete state");
    }
  };

useEffect(() => {
const fetchStates = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:5001/api/v1/admin/stateList?country=${selectedCountry._id}`,
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
  }, [selectedCountry]);

  // Filter states by search term
  const filteredStates = states.filter(
    (state) =>
      state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      state.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">
          States in {selectedCountry?.name || "..."}
        </h2>
        <button className="flex items-center gap-2 bg-black text-white px-6 py-2 rounded-md"
        onClick={() => setIsFormOpen(true)}
        >
          + Add State
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-4 font-medium text-gray-600">Name</th>
              <th className="text-left py-4 px-4 font-medium text-gray-600">ShortName</th>
              <th className="text-left py-4 px-4 font-medium text-gray-600">Status</th>
              <th className="text-left py-4 px-4 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <tr key={state._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{state.name}</td>
                  <td className="py-4 px-4">{state.shortname}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          state.active ? "bg-green-500" : "bg-red-500"
                        }`}
                      ></div>
                      <span>{state.active ? "Active" : "Inactive"}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-4">
                      <button className="text-gray-500 hover:text-blue-600"
                       onClick={() => setEditingState(state)}>
                        <span role="img" aria-label="edit">✏️</span>
                      </button>
                      <button className="text-gray-500 hover:text-red-600"
                      onClick={() => openDeleteModal(state._id)}>
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
        <AddStateForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleAddState}
          selectedCountryId = {selectedCountry._id}
        />
      )}  
      {editingState && (
              <UpdatestateForm
                state={editingState}
                selectedCountryId = {selectedCountry._id}
                onClose={() => setEditingState(null)}
                onSuccess={(updatedState) => {
                  setStates(
                    states.map((s) =>
                      s._id === updatedState._id ? updatedState : s
                    )
                  );
                }}
              />
            )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this state? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}