import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Orders from './pages/Orders';
import CategoriesPage from './pages/Categories';
import AddCategoryPage from './components/AddCategory';
import Products from './pages/Products';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import CustomerService from './pages/CustomerService';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import ApproveAdmin from './pages/ApproveAdmin';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordReset from './pages/PasswordReset';

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/forgot-password" element={<PasswordResetRequest />} />
    <Route path="/reset-password" element={<PasswordReset />} />
    <Route path="/" element={<ProtectedRoute element={<AdminPanel />} />}>
      <Route index element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route path="orders" element={<Orders />} />
      <Route path="categories" element={<CategoriesPage />} />
      <Route path="categories/add" element={<AddCategoryPage />} />
      <Route path="/categories/edit/:id" element={<AddCategoryPage />} /> {/* Route for editing */}
      <Route path="products" element={<Products />} />
      <Route path="products/add" element={<AddProduct />} />
      <Route path="products/edit/:id" element={<EditProduct />} />
      <Route path="customer-service" element={<CustomerService />} />
      <Route path="settings" element={<Settings />} />
      <Route path="approve" element={<ApproveAdmin />} />
    </Route>
  </Routes>
);

export default AppRoutes;
