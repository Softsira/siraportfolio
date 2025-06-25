import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddExperienceForm from "./AddExperienceForm";
import axios from "axios";
import toast from "react-hot-toast";

function Experience() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [experienceList, setExperienceList] = useState([]);
  
    // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Present"; // Return "Present" if the date is null or undefined
      const date = new Date(dateString);
      return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

  const fetchExperienceList = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/v1/user/experienceList",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );      // Sort by endDate (most recent first)
      const sortedExperienceList = response.data.data.sort((a, b) => {
        const endDateA = a.endDate ? new Date(a.endDate) : new Date();
        const endDateB = b.endDate ? new Date(b.endDate) : new Date();
        return endDateB - endDateA;
      });

      setExperienceList(sortedExperienceList);
    } catch (error) {
      console.error(
        "Error fetching experience list:",
        error.response?.data?.message || error.message
      );
      toast.error("Failed to fetch experience list. Please try again.");
    }
  };
  useEffect(() => {
    fetchExperienceList();
  }, [setExperienceList]);

  const handleAddExperienceSuccess = (newExperience) => {
    setExperienceList((prev) => [newExperience, ...prev]); // Add the new experience to the list
  };

  const displayedExperienceList = experienceList?.slice(0, 2); // Show only 2 experiences by default
if(experienceList.length>0){
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-2.5">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Experience</h2>
        <div className="flex space-x-2">
          <button
            className="text-gray-600 hover:text-blue-600"
            onClick={() => setIsFormOpen(true)}
          >
            <span role="img" aria-label="add">
              ➕
            </span>
          </button>
          <button
            className="text-gray-600 hover:text-blue-600"
            onClick={() => navigate("/experiences", { state: { experienceList } })}
          >
            <span role="img" aria-label="view">
              ✏️
            </span>
          </button>
        </div>
      </div>
      <div className="mt-4">
        {displayedExperienceList && displayedExperienceList.length > 0 ? (
          displayedExperienceList.map((exp, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 border-b border-gray-200 pb-4 mb-4"
            >
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {exp.companyName || exp.careerBreakType || "Company Name"}
                </h3>
                <p className="text-sm text-gray-600">
                  {exp.role || ""} ({exp.location || "Location"})
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(exp.startDate) || "Start Date"} - {formatDate(exp.endDate) || "End Date"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No experience details available.</p>
        )}
      </div>
      {experienceList && experienceList.length > 0 && (
        <button
          className="text-blue-600 hover:underline mt-4"
          onClick={() => navigate("/experiences", { state: { experienceList } })}
        >
          Show all {experienceList.length} experiences →
        </button>
      )}
      {isFormOpen && (
        <AddExperienceForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleAddExperienceSuccess}
        />
      )}
    </div>
  );
} else {
  return (<></>)
}
}

export default Experience;