import React, { useState } from "react";

function AddProfileSectionModal({ onClose, onSelect }) {
  const [expandedSections, setExpandedSections] = useState({
    core: true,
    recommended: false,
    additional: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Core section items
  const coreItems = [
    { id: "about", label: "Add about" },
    { id: "education", label: "Add education" },
    { id: "experience", label: "Add position" },
    { id: "services", label: "Add services" },
    { id: "career-break", label: "Add career break" },
    { id: "skills", label: "Add skills" }
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(5px)" , backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Add to profile</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-grow">
          {/* Core Section */}
          <div className="border-b">
            <button 
              className="w-full flex justify-between items-center p-4 text-left font-semibold"
              onClick={() => toggleSection('core')}
            >
              Core
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSections.core ? 'transform rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {expandedSections.core && (
              <div className="px-4 pb-2">
                <p className="text-sm text-gray-600 mb-4">
                  Start with the basics. Filling out these sections will help you be discovered by recruiters and people you may know
                </p>
                <ul>
                  {coreItems.map((item) => (
                    <li key={item.id} className="border-t py-4 border-gray-200">
                      <button
                        onClick={() => onSelect(item.id)}
                        className="w-full text-left text-gray-700 hover:text-gray-900"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Recommended Section */}
          <div className="border-b">
            <button 
              className="w-full flex justify-between items-center p-4 text-left font-semibold"
              onClick={() => toggleSection('recommended')}
            >
              Recommended
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSections.recommended ? 'transform rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {expandedSections.recommended && (
              <div className="px-4 pb-2">
                <ul>
                  <li className="border-t py-4 border-gray-200">
                    <button
                      onClick={() => onSelect('featured')}
                      className="w-full text-left text-gray-700 hover:text-gray-900"
                    >
                      Add featured
                    </button>
                  </li>
                  <li className="border-t py-4">
                    <button
                      onClick={() => onSelect('projects')}
                      className="w-full text-left text-gray-700 hover:text-gray-900"
                    >
                      Add projects
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          
          {/* Additional Section */}
          <div className="border-b">
            <button 
              className="w-full flex justify-between items-center p-4 text-left font-semibold"
              onClick={() => toggleSection('additional')}
            >
              Additional
              <svg 
                className={`w-5 h-5 transition-transform ${expandedSections.additional ? 'transform rotate-180' : ''}`} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            {expandedSections.additional && (
              <div className="px-4 pb-2">
                <ul>
                  <li className="border-t py-4 border-gray-200">
                    <button
                      onClick={() => onSelect('accomplishments')}
                      className="w-full text-left text-gray-700 hover:text-gray-900"
                    >
                      Add accomplishments
                    </button>
                  </li>
                  <li className="border-t py-4">
                    <button
                      onClick={() => onSelect('volunteering')}
                      className="w-full text-left text-gray-700 hover:text-gray-900"
                    >
                      Add volunteering
                    </button>
                  </li>
                  <li className="border-t py-4">
                    <button
                      onClick={() => onSelect('certificates')}
                      className="w-full text-left text-gray-700 hover:text-gray-900"
                    >
                      Add certificates
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProfileSectionModal;