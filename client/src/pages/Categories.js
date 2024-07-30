import React, { useState, useEffect } from 'react';
import { getAllCategories, deleteCategory } from '../api/categories';
import { Link } from 'react-router-dom';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch categories');
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        setCategories(categories.filter((category) => category.id !== id));
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to delete category');
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-primary">Categories</h1>
      {error && <p className="text-red-500 mb-4">{error.message || error}</p>}
      <div className="mb-4">
        <Link to="add" className="p-2 bg-primary text-white rounded shadow-sm hover:bg-secondary">
          Add New Category
        </Link>
      </div>
      <table className="min-w-full bg-white border border-gray-300 rounded shadow-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 border-b border-gray-300 text-left text-gray-600">Name</th>
            <th className="p-3 border-b border-gray-300 text-center text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="p-3 border-b border-gray-300 text-gray-700">{category.name}</td>
              <td className="p-3 border-b border-gray-300 text-center">
                <div className="flex justify-center space-x-2">
                  <Link
                    to={`edit/${category.id}`}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesPage;
