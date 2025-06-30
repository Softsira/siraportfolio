import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../constant";

export default function CareerBreakCategory() {
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/admin/careerBreakCategory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (editingCategory) {
        await axios.put(
          `${API_BASE_URL}/admin/updatecareerBreakCategory/${editingCategory._id}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category updated");
      } else {
        await axios.post(
          `${API_BASE_URL}/admin/addcareerBreakCategory`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Category added");
      }
      setIsFormOpen(false);
      setEditingCategory(null);
      setForm({ name: "" });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `${API_BASE_URL}/admin/deletecareerBreakCategory/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Career Break Categories</h1>
          <p className="text-lg text-gray-600">
            Manage career break categories for your application
          </p>
        </div>
        <button
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-md"
          onClick={() => {
            setIsFormOpen(true);
            setEditingCategory(null);
            setForm({ name: "", description: "" });
          }}
        >
          + Add Category
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backdropFilter: "blur(5px)" , backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "Edit" : "Add"} Category
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-lg"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded-lg"
                  onClick={() => setIsFormOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {editingCategory ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mt-6">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Categories</h2>
          <p className="text-gray-600 mb-6">
            Manage categories and their details.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{cat.name}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-4">
                        <button
                          className="text-gray-500 hover:text-blue-600"
                          onClick={() => {
                            setEditingCategory(cat);
                            setForm({ name: cat.name, description: cat.description });
                            setIsFormOpen(true);
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600"
                          onClick={() => handleDelete(cat._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 px-4 text-center text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}