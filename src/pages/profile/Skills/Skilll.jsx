import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddSkillForm from "./AddSkillForm";
import { API_BASE_URL } from "../../../constant";

export default function Skilll() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [skills, setSkills] = useState([]);
  const navigate = useNavigate();

  // Fetch skills from about API
  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/user/about`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSkills(res.data.data.skills || []);
    } catch {
      setSkills([]);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Show only first 2 skills by default
  const displayedSkills = skills.slice(0, 2);

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-2.5">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-bold">Skills</h3>
        <div>
        {/* Remove the add button below if you want to match Experience exactly */}
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
            onClick={() => navigate("/skills", { state: { skills } })}
          >
            <span role="img" aria-label="view">
              ✏️
            </span>
        </button>
        </div>
      </div>
      <div>
        {displayedSkills.length === 0 ? (
          <span className="text-gray-500">No skills added yet.</span>
        ) : (
          <ul className="space-y-2">
            {displayedSkills.map((s, idx) => (
              <li key={s.name || idx} className="text-gray-800 font-medium">
                <div className="flex items-start space-x-4 border-b border-gray-200 pb-4 mb-4" >
                  {s.name}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      {skills.length > 2 && (
        <button
          className="text-blue-600 hover:underline"
          onClick={() => navigate("/skills", { state: { skills } })}
        >
          Show all {skills.length} skills →
        </button>
      )}
      {isFormOpen && (
        <AddSkillForm
          onClose={() => setIsFormOpen(false)}
          onSuccess={fetchSkills}
        />
      )}
    </div>
  );
}