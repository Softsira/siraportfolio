import React, { useState } from "react";

function UpdateAboutForm({aboutText, onClose, onSave }) {
 const [about,setAboutText] = useState(aboutText)

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(about); // Pass the about text to the parent component
    onClose(); // Close the form modal
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Update About</h2>
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
              value={about}
              name="about"
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write about yourself..."
              rows="5"
              required
            ></textarea>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateAboutForm;