import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
function AddAboutForm({ onClose, onSuccess }) {
  const [aboutText, setAboutText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(aboutText){
        try {
          const token = localStorage.getItem("token"); // Get the token from localStorage
          const response = await axios.post(
            "http://localhost:5001/api/v1/user/addAbout",
           {aboutText},
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the Authorization header
              },
            }
          );
          console.log("About Section Updated:", response.data);
          toast.success("About Section added successfully!");
          onSuccess(response.data.data.aboutText); // Notify the parent component about the new education
          onClose(); // Close the form modal
          window.location.reload();
        } catch (error) {
          console.error(
            "Error adding education:",
            error.response?.data?.message || error.message
          );
          toast.error("Failed to add about. Please try again.");
        }
    }
  };


  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Add About</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">
            ✖
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              About
            </label>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about yourself..."
              rows="5"
              required
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

export default AddAboutForm;