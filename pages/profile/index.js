// Import React hooks
import { useState, useEffect } from 'react';
// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../../components/Navbar';
// Import useAuth hook from AuthContext
import { useAuth } from '../../context/AuthContext';
// Import axios for HTTP requests
import axios from 'axios';

// Define the Profile component
export default function Profile() {
  // Get the user from AuthContext
  const { user } = useAuth();
  // State to manage active tab
  const [activeTab, setActiveTab] = useState('profile');
  // State to store order history
  const [orderHistory, setOrderHistory] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(false);  // New state for loading

  // useEffect to fetch orders when active tab is 'orders'
  useEffect(() => {
    if (activeTab === 'orders' && user?.email) {
      fetchOrders();
    }
  }, [activeTab, user?.email]);

  // Function to fetch orders from the API
  const fetchOrders = async () => {
    setLoading(true); // Start loading
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.get(`${baseUrl}/api/orders?email=${user.email}`);
      console.log(response.data);
      setOrderHistory(response.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Return the JSX for the profile page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'profile'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'orders'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Order History
              </button>
            </nav>
          </div>

          {/* Profile Content */}
          {activeTab === 'profile' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    value={`${user?.firstname || ''} ${user?.lastname || ''}`.trim()}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}

          {/* Order History Content */}
          {activeTab === 'orders' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full border-4 border-t-4 border-blue-600 w-12 h-12 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Loading your orders...</p>
                  </div>
                ) : orderHistory.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
                ) : (
                  orderHistory.map((order) => (
                    <div key={order.orderId} className="border rounded-lg p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">Order {order.orderId}</h3>
                          <p className="text-sm text-gray-500">Placed on {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium text-gray-900">RS {order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Items</h4>
                        <ul className="space-y-2">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex justify-between text-sm">
                              <span className='text-black'>{item.productName} x {item.quantity}</span>
                              <span className='text-black'>RS {(item.productPrice * item.quantity).toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
