import { useState, useEffect } from "react";
import { Search, Plus, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import AddServiceForm from "./AddServiceForm";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmationModal from "../../../components/ConfirmationModal";

export default function ServiceManagement() {
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // Get authorization token
  const getToken = () => localStorage.getItem("token");
  
  // API base URL
  const API_URL = "http://localhost:5001/api/v1/admin";

  // Load categories and services
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = getToken();
      
      // Fetch categories and services in parallel
      const [categoriesRes, servicesRes] = await Promise.all([
        axios.get(`${API_URL}/categoryList`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/serviceList`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      // Combine data
      const categoriesWithServices = categoriesRes.data.data.map(category => ({
        ...category,
        services: servicesRes.data.data.filter(service => 
          service.category && service.category._id === category._id
        )
      }));
      
      setCategories(categoriesWithServices);
      
      // Expand categories that have services
      const toExpand = categoriesWithServices
        .filter(cat => cat.services.length > 0)
        .map(cat => cat._id);
      setExpandedCategories(toExpand);
      
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Failed to load data";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const openDeleteModal = (id, type) => {
    setItemToDelete(id);
    setDeleteType(type);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setItemToDelete(null);
    setDeleteType(null);
    setIsDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const token = getToken();
      
      if (deleteType === 'service') {
        await axios.delete(`${API_URL}/deleteService/${itemToDelete}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Service deleted successfully");
      } else {
        await axios.delete(`${API_URL}/deleteCategory/${itemToDelete}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success("Category deleted successfully");
      }
      
      await loadData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Delete failed";
      toast.error(errorMsg);
    } finally {
      closeDeleteModal();
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const token = getToken();
      await axios.post(`${API_URL}/addcategory`, 
        { name }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category created successfully");
      setIsFormOpen(false);
      await loadData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Create failed";
      toast.error(errorMsg);
    }
  };

  const handleAddService = async (serviceData) => {
    try {
      const token = getToken();
      await axios.post(`${API_URL}/addService`, 
        serviceData, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Service created successfully");
      await loadData();
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Create failed";
      toast.error(errorMsg);
    }
  };

  const filteredCategories = categories.filter(category => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.services.some(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Service Management</h1>
          <p className="text-lg text-gray-600">
            Manage service categories and individual services
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md"
          onClick={() => setIsFormOpen(true)}
        >
          <Plus size={20} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="flex justify-between mb-6">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search services or categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Categories</h2>
          <p className="text-gray-600 mb-6">
            Click on a category to view its services
          </p>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading services...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCategories.map(category => (
                <div 
                  key={category._id} 
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div 
                    className="flex justify-between items-center p-4 bg-gray-50 cursor-pointer"
                    onClick={() => toggleCategory(category._id)}
                  >
                    <div className="flex items-center">
                      <h3 className="text-lg font-medium">{category.name}</h3>
                      <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-1 text-xs">
                        {category.services.length} services
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCategory(category);
                          }}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(category._id, 'category');
                          }}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <button>
                        {expandedCategories.includes(category._id) 
                          ? <ChevronUp className="w-5 h-5 text-gray-500" /> 
                          : <ChevronDown className="w-5 h-5 text-gray-500" />
                        }
                      </button>
                    </div>
                  </div>

                  {expandedCategories.includes(category._id) && (
                    <div className="p-4 border-t">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700">Services</h4>
                        <button
                          className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded"
                          onClick={() => {
                            setEditingService({
                              category: category._id,
                              categoryName: category.name
                            });
                          }}
                        >
                          <Plus size={16} />
                          <span>Add Service</span>
                        </button>
                      </div>

                      {category.services.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">
                          No services in this category
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {category.services.map(service => (
                            <div 
                              key={service._id} 
                              className="flex justify-between items-center p-3 border border-gray-200 rounded-lg"
                            >
                              <div>
                                <p className="font-medium">{service.name}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => setEditingService({
                                    ...service,
                                    category: category._id,
                                    categoryName: category.name
                                  })}
                                  className="text-gray-500 hover:text-blue-600"
                                >
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(service._id, 'service')}
                                  className="text-gray-500 hover:text-red-600"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Category Form */}
      {isFormOpen && (
        <AddServiceForm
          type="category"
          onClose={() => setIsFormOpen(false)}
          onSuccess={handleAddCategory}
        />
      )}

      {/* Add/Edit Service Form */}
      {editingService && (
        <AddServiceForm
          type="service"
          service={editingService}
          onClose={() => setEditingService(null)}
          onSuccess={async (serviceData) => {
            if (editingService._id) {
              // Update existing service
              try {
                const token = getToken();
                await axios.put(`${API_URL}/updateService/${editingService._id}`, 
                  serviceData, 
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success("Service updated successfully");
                await loadData();
              } catch (error) {
                const errorMsg = error.response?.data?.message || error.message || "Update failed";
                toast.error(errorMsg);
              }
            } else {
              // Add new service
              await handleAddService(serviceData);
            }
            setEditingService(null);
          }}
        />
      )}

      {/* Edit Category Form */}
      {editingCategory && (
        <AddServiceForm
          type="category"
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={async (name) => {
            try {
              const token = getToken();
              await axios.put(`${API_URL}/updateCategory/${editingCategory._id}`, 
                { name }, 
                { headers: { Authorization: `Bearer ${token}` } }
              );
              toast.success("Category updated successfully");
              await loadData();
            } catch (error) {
              const errorMsg = error.response?.data?.message || error.message || "Update failed";
              toast.error(errorMsg);
            }
            setEditingCategory(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmationModal
          message={`Are you sure you want to delete this ${deleteType}? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
        />
      )}
    </div>
  );
}