import React, { useState } from "react";
import { useNavigate } from "react-router-dom"
import AddEducationForm from "./AddEducationForm";

function Education({ educationList }) {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [localEducationList, setLocalEducationList] = useState(educationList);
  
  const handleAddEducationSuccess = (newEducation) => {
    setLocalEducationList((prev) => [...prev, newEducation]); // Update the local state
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", { month: "short", year: "numeric" });
  };

   // Determine the list to display (only 2 by default or full list)
   const displayedEducationList = educationList?.slice(0, 2);
   if(educationList.length>0){
     return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-2.5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Education</h2>
          <div className="flex space-x-2">
            <button
              className="text-gray-600 hover:text-blue-600"
              onClick={() => setIsFormOpen(true)}
            >
              <span role="img" aria-label="add">
                ➕
              </span>
            </button>
            <button className="text-gray-600 hover:text-blue-600"
            onClick={() => navigate("/educations",  { state: { educationList } })} // Navigate to the full list page
            >
              <span role="img" aria-label="edit">
                ✏️
              </span>
            </button>
          </div>
        </div>
        <div className="mt-4">
          {displayedEducationList && displayedEducationList.length > 0 ? (
            displayedEducationList.map((edu, index) => (
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
                    {edu.degree || "Degree"} ({edu.board || "Board"})
                  </p>
                  <p className="text-sm text-gray-500">
                  {formatDate(edu.startDate) || "Start Date"} - {formatDate(edu.endDate) || "End Date"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No education details available.</p>
          )}
        </div>
        {localEducationList && localEducationList.length > 0 && (
          <button className="text-blue-600 hover:underline mt-4"
          onClick={() => navigate("/educations", { state: { educationList } })}
          >
            Show all {localEducationList.length} educations →
          </button>
        )}
        {/* Add Education Form */}
        {isFormOpen && (
          <AddEducationForm
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleAddEducationSuccess}
          />
        )}
      </div>
    );
   }
   else{
    return(
      <></>
    )
   }
  
}

export default Education;
