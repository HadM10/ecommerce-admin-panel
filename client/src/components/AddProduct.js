import React, { useState, useEffect, useContext } from 'react';
import { createProduct } from '../api/product';
import { getAllCategories } from '../api/categories'; // Import the getAllCategories function
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const AddProduct = () => {
  const { auth } = useContext(AuthContext); // Access AuthContext
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    status: 'active',
    sku: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Use navigate instead of history

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories(); // Use getAllCategories from API
        setCategories(data);
        console.log('Fetched categories:', data); // Debugging: Check fetched categories
      } catch (error) {
        setError(error.message || 'Failed to fetch categories');
        console.error('Error fetching categories:', error); // Debugging: Log errors
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(auth.token, productData);
      navigate('/products'); // Navigate to the products page
    } catch (error) {
      setError(error.message || 'Failed to create product');
      console.error('Error creating product:', error); // Debugging: Log errors
    }
  };

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-text">Add New Product</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-text">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-text">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-text">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-text">Stock Quantity</label>
          <input
            type="number"
            name="stockQuantity"
            value={productData.stockQuantity}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-text">Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={productData.imageUrl}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-text">Status</label>
          <select
            name="status"
            value={productData.status}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-text">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-text">Category</label>
          <select
            name="categoryId"
            value={productData.categoryId}
            onChange={handleChange}
            className="w-full p-2 border border-border rounded shadow-sm"
          >
            <option value="">Select Category</option>
            {categories.length ? (
              categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              <option disabled>Loading categories...</option>
            )}
          </select>
        </div>
        <button
          type="submit"
          className="p-2 bg-primary text-white rounded shadow-sm hover:bg-secondary"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
