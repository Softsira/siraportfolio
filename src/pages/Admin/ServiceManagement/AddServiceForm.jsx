import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AddServiceForm({ 
  type, 
  service = null, 
  category = null, 
  onClose, 
  onSuccess 
}) {
  const isEdit = !!service || !!category;
  const [name, setName] = useState(service?.name || category?.name || '');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(service?.category || '');
  const [loading, setLoading] = useState(false);

    // API base URL
  const API_URL = "http://localhost:5001/api/v1/admin";
  
  // Get authorization token
  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    if (type === 'service') {
      const fetchCategories = async () => {
        try {
          const token = getToken();
          const response = await axios.get(`${API_URL}/categoryList`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data.success) {
            setCategories(response.data.data);
            
            // Set default selected category if not set
            if (!selectedCategory && response.data.data.length > 0) {
              setSelectedCategory(response.data.data[0]._id);
            }
          }
        } catch (error) {
          console.log(error)
          toast.error('Failed to fetch categories');
        }
      };
      fetchCategories();
    }
  }, [type, selectedCategory]);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (type === 'category') {
        // For categories, just pass the name to onSuccess
        onSuccess(name);
      } else {
        // For services, pass the complete service data
        const serviceData = { 
          name, 
          category: selectedCategory
        };
        onSuccess(serviceData);
      }
    } catch (error) {
      toast.error(error.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(5px)" , backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isEdit ? 'Edit' : 'Add'} {type === 'category' ? 'Category' : 'Service'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {type === 'service' && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
              >
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {type === 'category' ? 'Category' : 'Service'} Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}