// Import Link from Next.js for client-side navigation
import Link from 'next/link';
// Import Navbar component
import Navbar from '../../components/Navbar';
// Import TrashIcon from Heroicons
import { TrashIcon } from '@heroicons/react/24/outline';
// Import useCart hook from CartContext
import { useCart } from '../../context/CartContext';
// Import useAuth hook from AuthContext
import { useAuth } from '../../context/AuthContext';

// Define the Cart component
export default function Cart() {
  // Get cart functions and items from CartContext
  const {cartItems, updateQuantity, removeItem } = useCart();
  // Calculate order totals
  const subtotal = cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  const shipping = 10;
  const total = subtotal + shipping;

  // Return the JSX for the cart page
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Cart Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {/* Empty Cart State */}
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <Link
              href="/categories"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          /* Cart Items and Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items Section */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {/* Map through cart items */}
                  {cartItems.map((item) => (
                    <li key={item._id} className="p-6">
                      <div className="flex items-center">
                        {/* Product Image Placeholder */}
                        <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md">
                          {/* Image placeholder */}
                        </div>
                        {/* Product Details */}
                        <div className="ml-6 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                            {/* Remove Item Button */}
                            <button
                              onClick={() => removeItem(item.productId)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">RS {item.productPrice}</p>
                          {/* Quantity Controls */}
                          <div className="mt-4 flex items-center">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              -
                            </button>
                            <span className="mx-4 text-gray-900">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        {/* Item Total */}
                        <div className="ml-6">
                          <p className="text-lg font-medium text-gray-900">
                            RS {(item.productPrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">RS {subtotal.toFixed(2)}</span>
                  </div>
                  {/* Shipping */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">RS {shipping.toFixed(2)}</span>
                  </div>
                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-lg font-medium text-gray-900">RS {total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {/* Checkout Button */}
                <Link href="/checkout">
                <button
                  className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Proceed to Checkout
                </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 