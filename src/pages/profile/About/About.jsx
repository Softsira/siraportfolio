import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import UpdateAboutForm from "./UpdateAboutForm";
import { API_BASE_URL } from "../../../constant";

function About() {
  const [aboutText, setAboutText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false); // State to manage the modal visibility

  const fetchAbout = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/user/about`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAboutText(response.data.data.aboutText || ""); // Set the about text
    } catch (error) {
      console.error("Error fetching about section:", error.message);
      if(error.success === "true"){
      toast.error(`${error.message}`);
      }
    }
  };
  useEffect(() => {
    fetchAbout();
  }, [setAboutText]);
  

  const handleUpdateAbout = async (updatedText) => {
    try {
      const token = localStorage.getItem("token");
      
      if (updatedText.trim() === "") {
        // If the text is empty, delete the about section
        const res = await axios.delete(
          `${API_BASE_URL}/user/deleteAbout`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setAboutText("");
        toast.success("About section deleted successfully!");
      } else {
        // Otherwise update it
        const response = await axios.put(
          `${API_BASE_URL}/user/updateAbout`,
          { aboutText: updatedText },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAboutText(response.data.data.aboutText);
        toast.success("About section updated successfully!");
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating about section:", error.message);
      toast.error("Failed to update about section.");
    }
  };
 {
  if (aboutText) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mt-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">About</h2>
          {/* Edit Icon */}
          <button
            onClick={() => setIsFormOpen(true)}
            className="text-gray-600 hover:text-blue-600"
          >
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </button>
        </div>
        <div className="mt-4">
          <p className="text-gray-600">{aboutText || "No about information provided."}</p>
        </div>
          {/* Update About Form Modal */}
        {isFormOpen && (
          <UpdateAboutForm
            aboutText={aboutText}
            onClose={() => setIsFormOpen(false)} // Close the modal
            onSave={handleUpdateAbout} // Handle the save action
          />
        )}
      </div>
    );
  }
  else {
    return(
      <></>
    )
  }
 }
  
}

export default About;