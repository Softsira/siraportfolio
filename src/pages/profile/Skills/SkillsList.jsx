import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AddSkillForm from "./AddSkillForm";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../../constant";

export default function SkillsList() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSkills = location.state?.skills || [];
  const [skills, setSkills] = useState(initialSkills);

  const handleRemove = async (name) => {
    try {
      const token = localStorage.getItem("token");
      const updatedSkills = skills.filter((s) => s.name !== name);
      await axios.put(
        `${API_BASE_URL}/user/updateAbout`,
        { skills: updatedSkills },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Skill removed");
      setSkills(updatedSkills);
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-8">
        <button
          className="mb-4 px-4 py-2 bg-white text-gray-600 rounded-lg shadow hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Skills</h2>
          </div>
          <ul className="space-y-2">
            {skills.length === 0 && <li className="text-gray-500">No skills added yet.</li>}
            {skills.map((s, idx) => (
              <li
                key={s.name || idx}
                className="text-gray-800 font-medium"
              >
            <div className="flex items-start space-x-4 border-b border-gray-200 pb-4 mb-4 justify-between" >
                {s.name}
                {/* Delete Button */}
                <button
                  className="text-gray-600 hover:text-red-600"
                  onClick={() => handleRemove(s.name)}
                >
                  🗑️
                </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}