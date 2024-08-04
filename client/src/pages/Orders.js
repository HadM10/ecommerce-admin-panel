import React, { useState, useEffect } from 'react';
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  archiveOrder,
} from '../api/orders'; // Adjust the path as needed

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const queryParams = { search, dateFrom, dateTo, status, sort };
        const data = await getAllOrders(queryParams);
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [search, dateFrom, dateTo, status, sort]);

  const handleArchiveOrder = async (orderId) => {
    try {
      const response = await archiveOrder(orderId);
      alert(response.message); // Notify the user
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId)); // Optionally, update local state to remove the archived order
    } catch (error) {
      console.error('Error archiving order:', error);
      alert('Failed to archive order');
    }
  };

  const handleOrderClick = async (orderId) => {
    try {
      const order = await getOrderById(orderId);
      setSelectedOrder(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)),
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prevOrder) => ({ ...prevOrder, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await deleteOrder(orderId);
      setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-primary">Orders Management</h1>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-border mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-text">Search and Filter</h2>
        <div className="flex flex-col gap-4 mb-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by status, user name, or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-border p-2 rounded-lg text-text placeholder:text-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 h-12"
          />

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="dateFrom" className="text-sm font-medium text-text">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-border p-2 rounded-lg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 h-12"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="dateTo" className="text-sm font-medium text-text">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-border p-2 rounded-lg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 h-12"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="status" className="text-sm font-medium text-text">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border border-border p-2 rounded-lg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 h-12"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="sort" className="text-sm font-medium text-text">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-border p-2 rounded-lg text-text shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition duration-300 h-12"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="priceHighLow">Highest Price First</option>
                <option value="priceLowHigh">Lowest Price First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-border mb-6">
        <h2 className="text-2xl font-semibold mb-4 text-text">Orders List</h2>
        <ul className="space-y-4">
          {orders.length > 0 ? (
            orders.map((order) => (
              <li
                key={order.id}
                className="border border-border p-4 rounded-lg bg-background flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-gray-100 transition duration-300"
              >
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="text-lg font-medium text-text">Order ID: {order.id}</div>
                  <div
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      order.status === 'Pending'
                        ? 'bg-gray-100 text-gray-800'
                        : order.status === 'Shipped'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    Status: {order.status}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOrderClick(order.id)}
                    className="bg-secondary text-white p-2 rounded-lg hover:bg-primary transition duration-300"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      const newStatus =
                        order.status === 'Pending'
                          ? 'Shipped'
                          : order.status === 'Shipped'
                            ? 'Delivered'
                            : 'Pending';
                      handleUpdateStatus(order.id, newStatus);
                    }}
                    className={`p-2 rounded-lg text-white font-semibold transition duration-300 ${
                      order.status === 'Pending'
                        ? 'bg-yellow-500 hover:bg-yellow-600'
                        : order.status === 'Shipped'
                          ? 'bg-green-500 hover:bg-green-600'
                          : order.status === 'Delivered'
                            ? 'bg-gray-500 hover:bg-gray-600'
                            : 'bg-accent hover:bg-accent-dark'
                    }`}
                  >
                    {order.status === 'Pending'
                      ? 'Mark as Shipped'
                      : order.status === 'Shipped'
                        ? 'Mark as Delivered'
                        : 'Mark as Pending'}
                  </button>
                  {order.status === 'Delivered' && (
                    <button
                      onClick={() => handleArchiveOrder(order.id)}
                      className="bg-accent text-white p-2 rounded-lg hover:bg-accent-dark transition duration-300"
                    >
                      Archive
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-text">No orders found.</p>
          )}
        </ul>
      </div>

      {/* Order Details */}
      {selectedOrder && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border relative">
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            {/* Order Details Section */}
            <div className="flex-1">
              <h2 className="text-2xl font-semibold mb-4 text-text">Order Details</h2>
              <div className="text-lg mb-2">
                <strong>Order ID:</strong> {selectedOrder.id}
              </div>
              <div className="text-lg mb-2">
                <strong>Status:</strong> {selectedOrder.status}
              </div>
              <div className="text-lg mb-2">
                <strong>Total Amount:</strong> ${selectedOrder.totalAmount}
              </div>
              <div className="text-lg mb-2">
                <strong>Tracking Number:</strong> {selectedOrder.trackingNumber}
              </div>
            </div>
            {/* Client Details Section */}
            <div className="flex-1">
              <h3 className="text-2xl font-semibold mb-4 text-text">Client Details</h3>
              <div className="text-lg mb-2">
                <strong>Name:</strong> {selectedOrder.ClientUser.firstName}{' '}
                {selectedOrder.ClientUser.lastName}
              </div>
              <div className="text-lg mb-2">
                <strong>Email:</strong> {selectedOrder.ClientUser.email}
              </div>
              <div className="text-lg mb-2">
                <strong>Phone:</strong> {selectedOrder.ClientUser.phoneNumber}
              </div>
              <div className="text-lg mb-4">
                <strong>Address:</strong> {selectedOrder.ClientUser.address}
              </div>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-4 text-text">Order Items</h3>
          <ul className="space-y-4">
            {selectedOrder.OrderItems.map((item) => (
              <li
                key={item.id}
                className="border border-border p-4 rounded-lg bg-background flex items-center gap-4 hover:bg-gray-100 transition duration-300"
              >
                <img
                  src={item.Product.imageUrl}
                  alt={item.Product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="text-lg font-medium text-text">{item.Product.name}</div>
                  <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                  <div className="text-sm text-gray-600">Price: ${item.price}</div>
                </div>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setSelectedOrder(null)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition duration-300 mt-6"
          >
            Close Details
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
