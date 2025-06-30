import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import UpdateEducationForm from "./UpdateEducationForm";
import ConfirmationModal from "../../../components/ConfirmationModal";
import { API_BASE_URL } from "../../../constant";

function EducationList() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialEducationList = location.state?.educationList || []; // Retrieve the education list from state
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [educationList, setEducationList] = useState(initialEducationList); // Manage educationList as local state
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [educationToDelete, setEducationToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setEducationToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setEducationToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!educationToDelete) return;
    await handleDelete(educationToDelete); // Call the delete function
    closeDeleteModal(); // Close the modal
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const handleDelete = async (id) => {
  
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.delete(
        `${API_BASE_URL}/user/deleteEducation/${id}`, // Use the education ID in the URL
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("Deleted Education:", response.data);
      toast.success("Education deleted successfully!");

      // Update the education list in the frontend
      const updatedList = educationList.filter((edu) => edu._id !== id); // Remove the deleted entry
      setEducationList(updatedList); // Update the state with the new list
    } catch (error) {
      console.error(
        "Error deleting education:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to delete education. Please try again.");
    }
  };

  const handleUpdate = async (updatedEducation) => {
    try {
      const { _id, ...formData } = updatedEducation; // Extract _id and the rest of the data
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.put(
        `${API_BASE_URL}/user/updateEducation/${_id}`, // Use the education ID
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("Updated Education:", response.data);
      toast.success("Education updated successfully!");

      // Update the education list in the frontend
      const updatedList = educationList.map((edu) =>
        edu._id === updatedEducation._id ? response.data.data : edu
      );
      setEducationList(updatedList); // Update the state with the new list
      setIsUpdateFormOpen(false); // Close the update form
    } catch (error) {
      console.error(
        "Error updating education:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to update education. Please try again.");
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
          <h2 className="text-xl font-bold text-gray-800 mb-4">Education</h2>
          {educationList && educationList.length > 0 ? (
            educationList.map((edu, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 border-b border-gray-200 pb-4 mb-4"
              >
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {edu.schoolName || "School Name"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {edu.degree || "Degree"} (
                    {edu.fieldOfStudy || "Field of Study"})
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate) || "Start Date"} -{" "}
                    {formatDate(edu.endDate) || "End Date"}
                  </p>
                  {edu.skills && (
                    <p className="text-sm text-gray-500">
                      <strong>Skills:</strong> {edu.skills}
                    </p>
                  )}
                </div>
                <button
                  className="ml-auto text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    setSelectedEducation(edu);
                    setIsUpdateFormOpen(true);
                  }}
                >
                  ✏️
                </button>
                {/* Delete Button */}
                <button
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => openDeleteModal(edu._id)} // Open the delete confirmation modal
                >
                  🗑️
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education details available.</p>
          )}
        </div>
      </div>
      {isUpdateFormOpen && selectedEducation && (
        <UpdateEducationForm
          education={selectedEducation}
          onClose={() => setIsUpdateFormOpen(false)}
          onUpdate={handleUpdate}
        />
      )}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this education data?"
          onConfirm={confirmDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}

export default EducationList;
