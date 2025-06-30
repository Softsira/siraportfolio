import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../constant";

function AddCareerBreakForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    careerBreakType: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrentlyWorking: true,
    isOnBreak: true,
    profileHeadline: "",
    media: [],
  });

  const [showMediaForm, setShowMediaForm] = useState(false);
  const [mediaLink, setMediaLink] = useState("");
  const [careerBreakCategories, setCareerBreakCategories] = useState([]); // New state for categories

  const handleRemoveMedia = (linkToRemove) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((link) => link !== linkToRemove),
    }));
  };
  // Fetch career break categories on component mount
  useEffect(() => {
    const fetchCareerBreakCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
         `${API_BASE_URL}/admin/careerBreakCategory`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCareerBreakCategories(response.data.data);
      } catch (error) {
        console.error(
          "Error fetching career break categories:",
          error.response?.data?.message || error.message
        );
        toast.error("Failed to load career break categories.");
      }
    };

    fetchCareerBreakCategories();
  }, []); // Empty dependency array means this runs once on mount

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    // Use checked for checkboxes, value for other input type
    const inputValue = type === "checkbox" ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // Get the token from localStorage
      const response = await axios.post(
        `${API_BASE_URL}/user/addExperience`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      console.log("New Experience Added:", response.data);
      toast.success("Career Break added successfully!");
      onSuccess(response.data.data); // Notify the parent component about the new experience
      onClose(); // Close the form modal
    } catch (error) {
      console.error(
        "Error adding experience:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to add experience. Please try again.");
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
          <h2 className="text-xl font-bold text-gray-800">Add Career Break</h2>
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
              Type*
            </label>
            <select
              id="careerBreakType" // Changed id to 'careerBreakType' for clarity
              name="careerBreakType"
              value={formData.careerBreakType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select a type</option>{" "}
              {/* Added a default empty option */}
              {careerBreakCategories.map((category) => (
                <option key={category._id} value={category.name}>
                  {" "}
                  {/* Use category.name as value */}
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              careerBreakType="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: London, United Kingdom"
            />
          </div>
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="month"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="month"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isCurrentlyWorking} // Disable if "isCurrentlyWorking" is true
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  formData.isCurrentlyWorking
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed" // Styles for disabled state
                    : "border-gray-300 focus:ring-blue-500" // Styles for enabled state
                }`}
              />
            </div>
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isCurrentlyWorking"
                checked={formData.isCurrentlyWorking}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                I am currently on this career break
              </span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile HeadLine
            </label>
            <input
              type="text"
              name="profileHeadline"
              value={formData.profileHeadline}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: On Break"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            ></textarea>
          </div>

          {/* {formData.media && formData.media.length > 0 && (
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Media Links
              </label>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.media.map((link, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                  >
                    <img src={link} alt="media icon" className="w-4 h-4 mr-1" />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(link)}
                      className="ml-1 text-blue-600 hover:text-red-600 focus:outline-none"
                      aria-label={`Remove ${link}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )} */}

          {formData.media && formData.media.length > 0 && (
            <div className="mb-4">
              <label className="block text-base font-semibold text-gray-800 mb-2">
                Uploaded Images
              </label>
              <div className="flex flex-wrap gap-4">
                {" "}
                {/* Increased gap for image thumbnails */}
                {formData.media.map((imageUrl, idx) => (
                  <div
                    key={idx}
                    className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg shadow-md overflow-hidden group" // Container for each image
                  >
                    <img
                      src={imageUrl}
                      alt={`Uploaded media ${idx + 1}`}
                      className="w-full h-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105" // Image styling
                      
                    />

                    {/* Overlay for remove button on hover */}
                    <div className="absolute inset-0  bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedia(imageUrl)}
                        className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                        aria-label={`Remove image ${idx + 1}`}
                        title={`Remove image ${idx + 1}`}
                      >
                        {/* Heroicon "Trash" icon, you'd need to import this or use a simple SVG */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            type="button"
            className="mt-2 btn btn-sm bg-transparent border-2 border-blue-600 rounded-full py-0.5 px-2 text-blue-500
             transform transition-all duration-300
            hover:bg-blue-50 hover:text-blue-800 hover:shadow-lg hover:border-blue-800"
            onClick={() => setShowMediaForm(true)}
          >
            + Add Media
          </button>
          <button
            careerBreakType="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Save
          </button>
          {showMediaForm && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50"
              style={{
                backdropFilter: "blur(5px)",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-2">Add Media Link</h3>
                <input
                  type="url"
                  value={mediaLink}
                  onChange={(e) => setMediaLink(e.target.value)}
                  placeholder="Paste or type a link to an article, file or video"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 border rounded-lg"
                    onClick={() => {
                      setShowMediaForm(false);
                      setMediaLink("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => {
                      if (mediaLink.trim()) {
                        setFormData((prev) => ({
                          ...prev,
                          media: [...(prev.media || []), mediaLink.trim()],
                        }));
                        setShowMediaForm(false);
                        setMediaLink("");
                      }
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default AddCareerBreakForm;
