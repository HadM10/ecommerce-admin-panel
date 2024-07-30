import React, { useState, useEffect } from 'react';
import { createCategory, getCategoryById, updateCategory } from '../api/categories';
import { useNavigate, useParams } from 'react-router-dom';

const AddCategoryPage = () => {
  const [categoryData, setCategoryData] = useState({ name: '', description: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchCategory = async () => {
        try {
          const category = await getCategoryById(id);
          setCategoryData(category);
        } catch (error) {
          setError('Failed to fetch category');
        }
      };

      fetchCategory();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateCategory(id, categoryData);
      } else {
        await createCategory(categoryData);
      }
      navigate('/categories');
    } catch (error) {
      setError('Failed to save category');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-primary">
        {id ? 'Edit Category' : 'Add New Category'}
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={categoryData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
       
        <button
          type="submit"
          className="bg-primary text-white p-3 rounded-lg shadow-sm hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-accent"
        >
          {id ? 'Update Category' : 'Add Category'}
        </button>
      </form>
    </div>
  );
};

export default AddCategoryPage;
