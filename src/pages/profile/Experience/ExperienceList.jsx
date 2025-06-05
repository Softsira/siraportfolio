import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import UpdateExperienceForm from "./UpdateExperienceForm";
import ConfirmationModal from "../../../components/ConfirmationModal";

function ExperienceList() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialExperienceList = location.state?.experienceList || []; // Retrieve the experience list from state
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [experienceList, setExperienceList] = useState(initialExperienceList); // Manage experienceList as local state
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [experienceToDelete, setExperienceToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setExperienceToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setExperienceToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!experienceToDelete) return;
    await handleDelete(experienceToDelete); // Call the delete function
    closeDeleteModal(); // Close the modal
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present"; // Return "Present" if the date is null or undefined
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.delete(
        `http://localhost:5001/api/v1/user/deleteExperience/${id}`, // Use the experience ID in the URL
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("Deleted Experience:", response.data);
      toast.success("Experience deleted successfully!");

      // Update the experience list in the frontend
      const updatedList = experienceList.filter((exp) => exp._id !== id); // Remove the deleted entry
      setExperienceList(updatedList); // Update the state with the new list
    } catch (error) {
      console.error(
        "Error deleting experience:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete experience. Please try again.");
    }
  };

  const handleUpdate = async (updatedExperience) => {
    try {
      const { _id, ...formData } = updatedExperience; // Extract _id and the rest of the data
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.put(
        `http://localhost:5001/api/v1/user/updateExperience/${_id}`, // Use the experience ID
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("Updated Experience:", response.data);
      toast.success("Experience updated successfully!");

      // Update the experience list in the frontend
      const updatedList = experienceList.map((exp) =>
        exp._id === updatedExperience._id ? response.data.data : exp
      );
      setExperienceList(updatedList); // Update the state with the new list
      setIsUpdateFormOpen(false); // Close the update form
    } catch (error) {
      console.error(
        "Error updating experience:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to update experience. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <button
          className="mb-4 px-4 py-2 bg-white text-gray-600 rounded-lg shadow hover:bg-gray-100"
          onClick={() => navigate(-1)} // Go back to the previous page
        >
          ← Back
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Experience</h2>
          {experienceList && experienceList.length > 0 ? (
            experienceList.map((exp, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 border-b border-gray-200 pb-4 mb-4"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {exp.companyName || "Company Name"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {exp.role || "Role"} ({exp.location || "Location"})
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(exp.startDate) || "Start Date"} -{" "}
                    {formatDate(exp.endDate) || "End Date"}
                  </p>
                </div>
                <button
                  className="ml-auto text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setSelectedExperience(exp);
                    setIsUpdateFormOpen(true);
                  }}
                >
                  ✏️
                </button>
                {/* Delete Button */}
                <button
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => openDeleteModal(exp._id)} // Open the delete confirmation modal
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No experience details available.</p>
          )}
        </div>
      </div>
      {isUpdateFormOpen && selectedExperience && (
        <UpdateExperienceForm
          experience={selectedExperience}
          onClose={() => setIsUpdateFormOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this experience data?"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}

export default ExperienceList;