import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddSkillForm({ onClose, onSuccess }) {
  const [skill, setSkill] = useState("");
  const [about, setAbout] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Fetch about info and all skills for suggestions
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const [aboutRes, skillsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/v1/user/about", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5001/api/v1/admin/skillList", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setAbout(aboutRes.data.data);
      setAllSkills(skillsRes.data.data || []);
      setSelectedSkills(aboutRes.data.data.skills || []);
    };
    fetchData();
  }, []);

  // Filter suggestions as user types
  useEffect(() => {
    if (!skill.trim()) {
      setFilteredSkills([]);
      return;
    }
    setFilteredSkills(
      allSkills
        .filter(
          (s) =>
            s.name.toLowerCase().includes(skill.trim().toLowerCase()) &&
            !selectedSkills.some((sk) => sk.name === s.name)
        )
        .slice(0, 5)
    );
  }, [skill, allSkills, selectedSkills]);

  // Add selected skill to array
  const handleAddSkill = () => {
    if (!skill.trim()) return;
    // Only allow adding from suggestions
    const found = allSkills.find(
      (s) => s.name.toLowerCase() === skill.trim().toLowerCase()
    );
    if (!found) {
      toast.error("Please select a skill from the suggestions.");
      return;
    }
    if (selectedSkills.some((s) => s.name === found.name)) {
      toast.error("Skill already added.");
      return;
    }
    setSelectedSkills([...selectedSkills, { name: found.name }]);
    setSkill("");
  };

  // Remove skill from array
  const handleRemoveSkill = (name) => {
    setSelectedSkills(selectedSkills.filter((s) => s.name !== name));
  };

  // Save all selected skills
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:5001/api/v1/user/updateAbout",
        {
          ...about,
          skills: selectedSkills,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Skills updated!");
      if (onSuccess) onSuccess(selectedSkills);
      onClose();
    } catch (err) {
      toast.error("Failed to update skills");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Add skill</h2>
          <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-600">×</button>
        </div>
        <label className="block text-base font-medium mb-1">Skill*</label>
        <div className="mb-4 relative flex gap-2">
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Skill (ex: Project Management)"
            value={skill}
            onChange={e => setSkill(e.target.value)}
            autoComplete="on"
          />
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleAddSkill}
            disabled={!skill.trim()}
            type="button"
          >
            Add
          </button>
          {/* Suggestions dropdown */}
          {filteredSkills.length > 0 && (
            <ul className="absolute z-10 bg-white border w-full mt-12 left-0 rounded shadow">
              {filteredSkills.map((s) => (
                <li
                  key={s._id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {setSkill(s.name);
                    setFilteredSkills([]);
                  }}
                >
                  {s.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Show selected skills as chips */}
        {selectedSkills.length > 0 && (
          <div className="mb-4">
            <label className="block font-semibold mb-2">Added Skills</label>
            <div className="flex flex-wrap gap-2">
              {selectedSkills.map((s) => (
                <span
                  key={s.name}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {s.name}
                  <button
                    type="button"
                    className="ml-2 text-blue-600 hover:text-red-600"
                    onClick={() => handleRemoveSkill(s.name)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-end mt-6">
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            onClick={handleSave}
            disabled={selectedSkills.length === 0}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}