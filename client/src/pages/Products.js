import React, { useState, useEffect, useContext } from 'react';
import { getAllProducts, deleteProduct } from '../api/product';
import { getAllCategories } from '../api/categories';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext

const ProductsPage = () => {
  const { auth } = useContext(AuthContext); // Access AuthContext
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortOrder, setSortOrder] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(auth.token);
        setProducts(data);
      } catch (error) {
        setError('Failed to fetch products');
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
      } catch (error) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', error);
      }
    };

    fetchProducts();
    fetchCategories();
  }, [auth.token]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(auth.token, id);
        setProducts(products.filter((product) => product.id !== id));
        alert('Product deleted successfully');
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const filteredProducts = products.filter((product) => {
    const lowerCaseSearch = search.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerCaseSearch) ||
      product.description.toLowerCase().includes(lowerCaseSearch);
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    const matchesCategory =
      categoryFilter === 'all' || product.categoryId === Number(categoryFilter);
    const matchesPrice =
      (!priceRange.min || product.price >= Number(priceRange.min)) &&
      (!priceRange.max || product.price <= Number(priceRange.max));
    return matchesSearch && matchesStatus && matchesCategory && matchesPrice;
  });

  const sortedProducts = filteredProducts.sort((a, b) => {
    switch (sortOrder) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'created-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'created-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'updated-asc':
        return new Date(a.updatedAt) - new Date(b.updatedAt);
      case 'updated-desc':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto p-4 bg-background">
      <h1 className="text-3xl font-bold mb-4 text-text text-center">Products</h1>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <div className="mb-4 flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap space-x-4 mb-2">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border border-border rounded shadow-sm mb-2"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 border border-border rounded shadow-sm mb-2"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="p-2 border border-border rounded shadow-sm mb-2"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
            className="p-2 border border-border rounded shadow-sm mb-2"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="p-2 border border-border rounded shadow-sm mb-2"
          />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border border-border rounded shadow-sm mb-2"
          >
            <option value="">Sort By</option>
            <option value="name-asc">Name A to Z</option>
            <option value="name-desc">Name Z to A</option>
            <option value="price-asc">Price Low to High</option>
            <option value="price-desc">Price High to Low</option>
            <option value="created-asc">Created At (Earliest First)</option>
            <option value="created-desc">Created At (Latest First)</option>
            <option value="updated-asc">Updated At (Earliest First)</option>
            <option value="updated-desc">Updated At (Latest First)</option>
          </select>
        </div>
        <Link to="add" className="p-2 bg-primary text-white rounded shadow-sm hover:bg-secondary">
          Add New Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-border rounded shadow-sm">
          <thead>
            <tr>
              <th className="p-3 border-b border-border text-center text-text">Image</th>
              <th className="p-3 border-b border-border text-center text-text">Name</th>
              <th className="p-3 border-b border-border text-center text-text">Category</th>
              <th className="p-3 border-b border-border text-center text-text">Description</th>
              <th className="p-3 border-b border-border text-center text-text">Price</th>
              <th className="p-3 border-b border-border text-center text-text">Stock</th>
              <th className="p-3 border-b border-border text-center text-text">Status</th>
              <th className="p-3 border-b border-border text-center text-text">Created At</th>
              <th className="p-3 border-b border-border text-center text-text">Updated At</th>
              <th className="p-3 border-b border-border text-center text-text">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.map((product) => (
              <tr key={product.id}>
                <td className="p-2 border-b border-border text-center">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-32 h-32 object-cover rounded mx-auto"
                  />
                </td>
                <td className="p-2 border-b border-border text-center">{product.name}</td>
                <td className="p-2 border-b border-border text-center">
                  {categories.find((cat) => cat.id === product.categoryId)?.name || 'N/A'}
                </td>
                <td className="p-2 border-b border-border text-center">{product.description}</td>
                <td className="p-2 border-b border-border text-center">
                  ${product.price.toFixed(2)}
                </td>
                <td className="p-2 border-b border-border text-center">{product.stockQuantity}</td>
                <td className="p-2 border-b border-border text-center">{product.status}</td>
                <td className="p-2 border-b border-border text-center">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border-b border-border text-center">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </td>
                <td className="p-2 border-b border-border text-center">
                  <div className="flex justify-center space-x-2">
                    <Link
                      to={`edit/${product.id}`}
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
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
    </div>
  );
};

export default ProductsPage;
